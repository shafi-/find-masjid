import { createClient } from "@supabase/supabase-js";
import Admin from "layouts/Admin";
import { useEffect, useState } from 'react';
import { getSupabaseInstance } from "utils/supabase";

// class Masjid {
//   id: String;
  
//   name: String;
  
//   lat: Number;
  
//   lng: Number;
  
//   created_at: Date;
  
//   updated_at: Date;

//   fajr_at: Date;
  
//   juhr_at: Date;
  
//   asr_at: Date;
  
//   magrib_at: Date;
  
//   isha_at: Date;
  
//   juma_at?: Date;
// }

export default function MasjidList({ masjidList }) {
    const supabase = getSupabaseInstance();
    const [masjids, setMasjids] = useState(masjidList || [])
    const [newTaskText, setNewTaskText] = useState('')
    const [errorText, setErrorText] = useState('')
  
    useEffect(() => {
      const fetchMasjids = async () => {
        const { data: masjids, error } = await supabase
          .from('masjids')
          .select('*')
          .order('id', { ascending: true })
  
        if (error) console.log('error', error)
        else setMasjids(masjids)
      }
  
      fetchMasjids()
    }, []);
  
    const addMasjid = async (taskText) => {
      let task = taskText.trim()
      if (task.length) {
        const { data: masjid, error } = await supabase
          .from('masjids')
          .insert({ task, user_id: '' })
          .select()
          .single()
  
        if (error) {
          setErrorText(error.message)
        } else {
          setMasjids([...masjids, masjid])
          setNewTaskText('')
        }
      }
    }
  
    const deleteMasjid = async (id) => {
      try {
        await supabase.from('masjids').update({ deletedAt: Date.now() }).eq('id', id).throwOnError()
        setMasjids(masjids.filter((x) => x.id != id))
      } catch (error) {
        console.log('error', error)
      }
    }
  
    const onEdit = (id) => {
      alert('Edit is coming soon');
    }

    return (
      <div className="w-full">
        <h1 className="mb-12">Masjid List</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            addMasjid(newTaskText)
          }}
          className="flex gap-2 my-2"
        >
          <input
            className="rounded w-full p-2"
            type="text"
            placeholder="make coffee"
            value={newTaskText}
            onChange={(e) => {
              setErrorText('')
              setNewTaskText(e.target.value)
            }}
          />
          <button className="btn-black" type="submit">
            Add
          </button>
        </form>
        {!!errorText && <Alert text={errorText} />}
        <div className="bg-white shadow overflow-hidden rounded-md">
          <ul>
            {masjids.map((masjid) => (
              <Masjid key={masjid.id} supabase={supabase} masjid={masjid} onEdit={onEdit} onDelete={() => deleteMasjid(masjid.id)} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  const Masjid = ({ masjid, onDelete, onEdit }) => {
    const [isCompleted, setIsCompleted] = useState(masjid.is_complete)
  
    const toggle = async () => {
      onDelete && onDelete(masjid.id);
    }
  
    return (
      <li className="w-full block cursor-pointer hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition duration-150 ease-in-out">
        <div className="flex items-center px-4 py-4 sm:px-6">
          <div className="min-w-0 flex-1 flex items-center">
            <div className="text-sm leading-5 font-medium truncate">{masjid.task}</div>
          </div>
          <div>
            <input
              className="cursor-pointer"
              onChange={(e) => toggle()}
              type="checkbox"
              checked={isCompleted ? true : false}
            />
          </div>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onDelete()
            }}
            className="w-4 h-4 ml-2 border-2 hover:border-black rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="gray">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </li>
    )
  }
  
  const Alert = ({ text }) => (
    <div className="rounded-md bg-red-100 p-4 my-3">
      <div className="text-sm leading-5 text-red-700">{text}</div>
    </div>
  )
  
  MasjidList.layout = Admin;
