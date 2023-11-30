// pages/crud.js

import React, { useState } from 'react';
import Head from 'next/head';
import Admin from 'layouts/Admin';
import Modal from 'components/Modal/Modal';
import { useRouter } from 'next/router';

const CRUDPage = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1', description: 'Description 1', archived: false },
    { id: 2, name: 'Item 2', description: 'Description 2', archived: false },
    // Add more items as needed
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchiveWarning, setShowArchiveWarning] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Pagination
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const router = useRouter();

  // Toggle Add Modal
  const toggleAddModal = () => {
    // setShowAddModal(!showAddModal);
    router.push('/admin/crud/add');
  };

  // Toggle Edit Modal
  const toggleEditModal = (item) => {
    // setSelectedItem(item);
    // setShowEditModal(!showEditModal);
    router.push({
      href: '/admin/crud/edit',
      query: { id: item.id },
    });
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

  // Render Items
  const renderItems = () => {
    return currentItems.map((item) => (
      <div key={item.id} className="mb-4 md:w-1/2 lg:w-1/3 xl:w-1/4 p-4">
        <div className="border p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
          <p>{item.description}</p>
          <div className="mt-4 flex justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => toggleEditModal(item)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleArchiveWarning(item)}
            >
              Archive
            </button>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div>
      <Head>
        <title>CRUD Page</title>
        <meta name="description" content="CRUD operations with Next.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <header className="bg-gray-800 text-black text-center p-4">
        <h1 className="text-2xl">CRUD Page</h1>
      </header>

      <main className="p-4">
        <button
          className="bg-green-500 hover:bg-green-700 text-black font-bold py-2 px-4 rounded mb-4"
          onClick={() => toggleAddModal()}
        >
          Add New
        </button>

        {/* Items List */}
        <div className="flex flex-wrap">{renderItems()}</div>

        {/* Pagination */}
        <div className="mt-4">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={indexOfLastItem >= items.length}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
          >
            Next
          </button>
        </div>
      </main>

      {/* Add Item Modal */}
      {showAddModal && (
        <Modal isOpen={showAddModal} toggleAddModal={toggleAddModal}>
          Add New Item
        </Modal>
      )}

      {/* Edit Item Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">Edit Item</h2>
            {/* Add your form for editing the selected item here */}
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                toggleEditModal();
                setSelectedItem(null);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

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

