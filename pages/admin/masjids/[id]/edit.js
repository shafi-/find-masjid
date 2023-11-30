import Admin from 'layouts/Admin';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getSupabaseInstance } from 'utils/supabase';

const TIMES = ['fajr', 'juhr', 'asr', 'magrib', 'isha', 'juma'];
const TIMES_BN = ["ফজরের সময়", "যোহরের সময়", "আসরের সময়", "মাগরিবের সময়", "ঈশার সময়", "জুমার সময়"];

const EditItem = () => {
    const router = useRouter();
    const supabase = getSupabaseInstance();

    const id = router.query.id;
    const [name, setName] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [locationName, setLocationName] = useState('');
    const [tags, setTags] = useState('');
    const [times, setTimes] = useState(['', '', '', '', '', '']);
    
    useEffect(() => {
        if (id) {
            supabase.from('masjids').select('*').eq('id', id).limit(1)
                .then(({ data, error }) => {
                    if (error) return console.log('error', error);
                    if (data.length) {
                        const item = data[0];
                        setName(item.name);
                        setLat(item.lat);
                        setLng(item.lng);
                        setLocationName(item.locationName);
                        setTags(item.tags);
                        setTimes(item.times || []);
                    }
                });
        }
    }, [id]);

    const handleInputChange = (index, value) => {
        const updatedTimes = [...times];
        updatedTimes[index] = value;
        setTimes(updatedTimes);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
        const data = {
            name,
            lat,
            lng,
            locationName,
            tags,
            fajr_at: times[0],
            juhr_at: times[1],
            asr_at: times[2],
            magrib_at: times[3],
            isha_at: times[4],
            juma_at: times[5],
        };
        console.log('Form submitted:', data);

        const res = await supabase.from('masjids').update(data).eq('id', id).select('*');

        if (res.error) {
            console.log('error', res.error);
        } else {
            console.log('data', res.data);
            router.push('/admin/masjids');
        }
    };

    return (
        <div className=''>
            <header className="bg-gray-800 text-black text-center p-4">
                <h1 className="text-2xl font-bold text-white">মাসজিদের তথ্য আপডেট</h1>
            </header>

            <div className='pt-4'>
                <p className='bg-gray-200 p-4'><i className='fa fa-info-circle pr-3'></i>তথ্য আপডেট করার ক্ষেত্রে সর্বোচ্চ সতর্কতা অবলম্বন করুন। মাসজিদের সময়সূচীর সাথে মিলিয়ে নিন।</p>
                <form className='py-4' onSubmit={ handleSubmit }>
                    <label className="block">
                        <span className="text-gray-700">নামঃ</span>
                        <input
                            type="text"
                            value={ name }
                            onChange={ (e) => setName(e.target.value) }
                            className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </label>
                    <br />
                    <label className="block">
                        <span className="text-gray-700">Latitude:</span>
                        <input
                            type="text"
                            value={ lat }
                            onChange={ (e) => setLat(e.target.value) }
                            className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </label>
                    <br />
                    <label className="block">
                        <span className="text-gray-700">Longitude:</span>
                        <input
                            type="text"
                            value={ lng }
                            onChange={ (e) => setLng(e.target.value) }
                            className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </label>
                    <br />
                    <label className="block">
                        <span className="text-gray-700">জায়গার নামঃ</span>
                        <input
                            type="text"
                            value={ locationName }
                            onChange={ (e) => setLocationName(e.target.value) }
                            className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </label>
                    <br />
                    <label className="block">
                        <span className="text-gray-700">সার্চ ট্যাগঃ</span>
                        <input
                            type="text"
                            value={ tags }
                            onChange={ (e) => setTags(e.target.value) }
                            className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </label>
                    <br />
                    {times.map((time, index) => (
                        <label className="block" key={ index }>
                            <span className="text-gray-700">{TIMES_BN[index]}</span>
                            <input
                                type="time"
                                value={ time }
                                onChange={ (e) => handleInputChange(index, e.target.value) }
                                className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </label>
                    ))}
                    <br />
                    <button type="submit" className="hover:bg-blue-700 font-bold py-2 px-4 rounded border bg-teal-100">
                        সেইভ করুন
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditItem;

EditItem.layout = Admin;
