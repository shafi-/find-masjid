import React from 'react';
import PropTypes from 'prop-types';

import Link from 'next/link';

const Drawer = ({ isOpen, isLoggedIn, onDrawerClose, className }) => {
    // Add your drawer navigation logic here
    if (!isOpen) return (<></>);

    return (
        <div className={"absolute h-screen w-full bg-black z-10 transition-opacity " + className || ''} onClick={() => onDrawerClose(false)}>
            <div className="p-4 w-10/12 bg-blueGray-600 h-screen text-white">
                {/* Add your drawer navigation content here */ }
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <a href="/admin/masjids" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Masjid List</a>
                    <a href="/about" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">About</a>
                    <a href="/profile" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Profile</a>
                    { isLoggedIn ? <a href="/logout" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Logout</a> :
                    <a href="/auth/login" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Login</a>}
                </div>

                <ul className="space-y-2 hidden">
                    <li>
                        <Link href="/masjids" className="text-gray-800">
                            <>
                                <i className="mr-2 fas fa-masjid" />
                                Masjids
                            </>
                        </Link>
                    </li>
                    <li>
                        <Link href="/profile" className="text-gray-800">
                            <>
                                <i className="mr-2 fas fa-masjid" />
                                Profile
                            </>
                        </Link>
                    </li>
                    { isLoggedIn ? (
                        <li>
                            <Link href="/logout" className="text-gray-800">
                                <>
                                    <i className="mr-2 fas fa-masjid" />
                                    Logout
                                </>
                            </Link>
                        </li>
                    ) : (
                        <>
                            <li>
                                <Link href="/login" className="text-gray-800">
                                    <>
                                        <i className="mr-2 fas fa-masjid" />
                                        Login
                                    </>
                                </Link>
                            </li>
                            <li>
                                <Link href="/register" className="text-gray-800">
                                    <>
                                        <i className="mr-2 fas fa-masjid" />
                                        Register
                                    </>
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};

Drawer.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onDrawerClose: PropTypes.func.isRequired,
};

export default Drawer;
