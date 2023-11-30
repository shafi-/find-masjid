// pages/crud.js

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Admin from 'layouts/Admin';
import Modal from 'components/Modal/Modal';
import { useRouter } from 'next/router';
import MasjidInfoCard from 'components/Cards/MasjidInfoCard';
import { getSupabaseInstance } from 'utils/supabase';

const CRUDPage = () => {
  const router = useRouter();
  const supabase = getSupabaseInstance();

  const [items, setItems] = useState([]);
  const [showArchiveWarning, setShowArchiveWarning] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Pagination
  const [itemsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(router.query.page || 1);
  const [action, setAction] = useState('next');

  function onCurrentPageChange(pageNumber) {
    setAction(currentPage > pageNumber ? 'prev' : 'next');
    setCurrentPage(pageNumber);
    router.push(
      {
        pathname: '/admin/masjids',
        query: { page: pageNumber },
      },
      undefined,
      { shallow: true }
    );
  }

  const indexOfLastItem = 0;

  useEffect(() => {
    const query = supabase.from('masjids').select('*', { count: itemsPerPage });

    if (action === 'prev') {
      const firstItemId = items.length ? items[0].id : 1;
      query.lt('id', firstItemId);
    } else {
      const lastItemId = items.length ? items[items.length - 1].id : 0;
      query.gt('id', lastItemId);
    }

    query.order('id', { ascending: false }).limit(itemsPerPage).then(({ data, error }) => {
      if (error) console.log('error', error);
      else setItems(data);
    });
  }, [currentPage, itemsPerPage]);

  // Toggle Add Modal
  const toggleAddModal = () => {
    // setShowAddModal(!showAddModal);
    router.push('/admin/masjids/add');
  };

  // Toggle Edit Modal
  const toggleEditModal = (id) => {
    // setSelectedItem(item);
    // setShowEditModal(!showEditModal);
    router.push(`/admin/masjids/${id}/edit`);
  };

  // Handle Archive Warning
  const handleArchiveWarning = (item) => {
    setSelectedItem(item);
    setShowArchiveWarning(!showArchiveWarning);
  };

  // Archive Item
  const archiveItem = () => {
    // Add your API request logic here to archive the item
    const updatedItems = items.map((item) =>
      item.id === selectedItem.id ? { ...item, archived: true } : item
    );
    setItems(updatedItems);
    setShowArchiveWarning(false);
  };

  return (
    <div>
      <Head>
        <title>Masjid List</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <header className="bg-gray-800 text-black text-center p-4">
        <h1 className="text-2xl font-bold text-white">Manage Masjids</h1>
      </header>

      <main className="p-4">
        <button
          className="bg-green-500 hover:bg-green-700 text-black font-bold py-2 px-4 rounded mb-4"
          onClick={() => toggleAddModal()}
        >
          Add New
        </button>

        {/* Items List */}
        <div className="grid sm:grid-cols-3 gap-3 md:grid-cols-2 xl:grid-cols-3">{items.map(item => 
          <MasjidInfoCard className="p mb-3 md:w-11/12" key={item.id} item={item} onEdit={toggleEditModal} />
        )}</div>

        {/* Pagination */}
        <div className="mt-4">
          <button
            onClick={() => onCurrentPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
          >
            Prev
          </button>
          <button
            onClick={() => onCurrentPageChange(currentPage + 1)}
            disabled={items.length < itemsPerPage}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
          >
            Next
          </button>
        </div>
      </main>

      {/* Archive Warning Modal */}
      {showArchiveWarning && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">Warning</h2>
            <p>Are you sure you want to archive this item?</p>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={() => archiveItem()}
              >
                Archive
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={() => setShowArchiveWarning(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRUDPage;

CRUDPage.layout = Admin;

function AddModal(toggleAddModal) {
  return <div className="add-modal fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
    <div className="bg-white p-8 rounded shadow-md">
      <h2 className="text-lg font-semibold mb-4">Add New Item</h2>
      {/* Add your form for adding a new item here */ }
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={ () => toggleAddModal() }
      >
        Close
      </button>
    </div>
  </div>;
}

