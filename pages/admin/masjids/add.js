import Admin from 'layouts/Admin';
import React, { useEffect, useState } from 'react';
import { getSupabaseInstance } from '../../../utils/supabase';
import { TIMES } from '../../../utils/config';
import { useRouter } from 'next/router';

const TIMES_BN = ["ফজরের সময়", "যোহরের সময়", "আসরের সময়", "মাগরিবের সময়", "ঈশার সময়", "জুমার সময়"];

const AddItem = () => {
    const router = useRouter();
    const supabase = getSupabaseInstance();

    const [name, setName] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [locationName, setLocationName] = useState('');
    const [tags, setTags] = useState('');
    const [times, setTimes] = useState(['', '', '', '', '', '']);

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
        data.user_id = (await supabase.auth.getUser()).data.user.id;
        console.log('Form submitted:', data);

        const res = await supabase.from('masjids').insert(data);
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
                <h1 className="text-2xl font-bold text-white">নতুন মসজিদ যুক্ত করুন</h1>
            </header>

            <div className='pt-4'>
                <p className='bg-gray-200 p-4'><i className='fa fa-info-circle pr-3'></i>এই মসজিদের তথ্য ইতিমধ্যে আছে কিনা চেক করুন। যদি তথ্য আপডেট না থাকে তবে এই ফর্মটি ব্যবহার করুন।</p>
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
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded">
                        সেইভ করুন
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddItem;

AddItem.layout = Admin;
