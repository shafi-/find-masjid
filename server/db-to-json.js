const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const bucketDir = 'public';
const bucketName = 'masjid-info';

/**
 * Type definitions
 *
 * @typedef {Date} Timetz
 *
 * @typedef {{ id: string, name: string, description: string, fajr_at: Timetz, juhr_at: Timetz, asr_at: Timetz, magrib_at: Timetz, isha_at: Timetz, location: { lat: string, lng: string }, tags: string[] }} MasjidDto
 */

const supabase = createClient(process.env.SB_URL, process.env.SB_API_PASS, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function fetchData() {
    const total = (await supabase.from('masjids').select('*', { head: true, count: 'exact' })).count;

    const pages = [];
    let page = 1;
    let perPage = 100;
    const totalPage = Math.ceil(total / perPage);

    while (page <= totalPage) {
        const pageData = await supabase.from('masjids').select().range((page - 1) * perPage, page * perPage);
        page += 1;
        pages.push(pageData.data);
    }

    return pages.flat();
}

/**
 * @param {Object} masjid
 * @param {string} masjid.id
 * @param {string} masjid.name
 * @param {Date} masjid.created_at
 * @param {Date} masjid.updated_at
 * @param {Number} masjid.lat
 * @param {Number} masjid.lng
 * @param {string} masjid.user_id
 * @param {Timetz} masjid.fajr_at
 * @param {Timetz} masjid.juhr_at
 * @param {Timetz} masjid.asr_at
 * @param {Timetz} masjid.magrib_at
 * @param {Timetz} masjid.isha_at
 * @param {Timetz} masjid.juma_at
 * @param {string} masjid.locationName
 * @param {string} masjid.tags
 *
 * @returns {MasjidDto[]}
 */
function convert(masjid) {
    return {
        id: masjid.id,
        name: masjid.name,
        description: `${masjid.locationName}`,
        location: {
            lat: masjid.lat,
            lng: masjid.lng,
            text: masjid.locationName,
        },
        fajr_at: masjid.fajr_at,
        juhr_at: masjid.juhr_at,
        asr_at: masjid.asr_at,
        magrib_at: masjid.magrib_at,
        isha_at: masjid.isha_at,
        juma_at: masjid.juma_at,
        tags: masjid.tags ? masjid.tags.split(',').map(tag => tag.trim()) : [],
    };
}

/**
 * @param {string} fileName - file name
 * @param {Object|Array} data
 * @returns {boolean}
 */
async function saveAsStaticFile(fileName, data) {
    let completed = false;

    const abortController = new AbortController();

    const timeout = setTimeout(() => {
        if (!completed) {
            abortController.abort('Timed out');
            completed = false;
        }
    }, 10 * 1000);

    try {
        fs.writeFileSync(
            `./${fileName}`,
            JSON.stringify(data),
            { encoding: 'utf8', signal: abortController.signal }
        );

        await uploadToStorage(fileName);

        fs.rmSync(`./${fileName}`);

        completed = true;
    } catch (error) {
        console.error(error);
        completed = false;
    } finally {
        clearTimeout(timeout);
    }

    return completed;
}

async function uploadToStorage(fileName) {
    const file = fs.readFileSync(fileName);
    await backupIfExist(fileName);

    const { data, error } = await supabase
        .storage
        .from(bucketName)
        .upload(
            `${bucketDir}/${fileName}`, 
            file, 
            {
                cacheControl: '3600',
                upsert: true
            }
        );
}

/**
 * Create search index for masjid names, tags, location name
 *
 * ***In future*** creates search index by location.lng, location.lat
 * 
 * @param {MasjidDto[]} masjids 
 * @returns {{ textSearchIndex: { [key: string]: string[] }, location: {} }}
 */
function createIndex(masjids) {
    const searchIndex = {};
    
    masjids.map(masjid => {
        if (!searchIndex[masjid.name]) {
            searchIndex[masjid.name] = [masjid.id];
        } else {
            searchIndex[masjid.name].push(masjid.id);
        }
        
        masjid.tags.map(tag => {
            if (searchIndex[tag]) {
                searchIndex[tag].push(masjid.id);
            } else {
                searchIndex[tag] = [masjid.id];
            }
        });
    });
    
    return searchIndex;
}

function backupIfExist(fileName) {
    return supabase.storage.from(bucketName).copy(`${bucketDir}/${fileName}`, `backup/${new Date().toDateString()}-${fileName}`);
}

async function run() {
    const data = await fetchData();
    
    const processedData = data.map(row => convert(row));

    const searchIndex = createIndex(processedData);

    const isProcessed = await saveAsStaticFile('masjids.json', processedData);
    
    const isSaved = await saveAsStaticFile('index.json', searchIndex);
    
    if (isProcessed && isSaved) {
        console.log('Data processed');
    } else {
        process.exit(1);
    }
}

run().catch(console.error);
