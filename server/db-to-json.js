const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

/**
 * @returns {Array<Object>}
 */
async function fetchData() {
    const provider = createClient(process.env.SB_URL, process.env.SB_KEY);
    const authResponse = await provider.auth.signInWithPassword({
        email: 'bot@masjidinfo.com',
        password: process.env.SB_BOT_PASS,
    });
    if (authResponse.error?.status) {
        throw new Error(`${authResponse.error.name} - ${authResponse.error.message}`);
    }

    const access_token = authResponse.data.session.access_token;
    
    const total = (await provider.from('masjids').select('*', { head: true, count: 'exact' })).count;

    const pages = [];
    let page = 1;
    let perPage = 100;
    const totalPage = Math.ceil(total / perPage);
    let pageData = [];

    while (page <= totalPage) {
        pageData = await provider.from('masjids').select().range((page - 1) * perPage, page * perPage);
        page += 1;
        pages.push(pageData);
    }
    
    return pages.flat();
}

/**
 * @typedef {Date} Timetz
 */

/**
 * @typedef {{ id: string, name: string, description: string, fajr_at: Timetz, juhr_at: Timetz, asr_at: Timetz, magrib_at: Timetz, isha_at: Timetz, location: { lat: string, lng: string }, tags: string[] }} MasjidDto
 */

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
        tags: masjid.tags.split(',').map(tag => tag.trim()),
    };
}

/**
 * @param {string} name - file name
 * @param {Object|Array} data
 * @returns {boolean}
 */
async function saveAsStaticFile(name, data) {
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
            `../data/${name}`,
            JSON.stringify(data),
            { encoding: 'utf8', signal: abortController }
        );
        completed = true;
    } catch (error) {
        console.error(error);
        completed = false;
    } finally {
        clearTimeout(timeout);
    }

    return completed;
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
        if (searchIndex[masjid.])
    })
}

async function run() {
    const data = await fetchData();
    
    const processedData = data.map(row => convert(row));

    const searchIndex = createIndex(processedData);

    const isProcessed = await saveAsStaticFile(processedData);
    
    if (isProcessed) {
        console.log('Data processed');
    } else {
        process.exit(1);
    }
}

run().catch(console.error).then(console.log);
