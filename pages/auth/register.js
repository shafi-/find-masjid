import React, { useEffect, useState } from "react";
import Auth from "layouts/Auth.js";
import { createClient } from "@supabase/supabase-js";
import { validate } from "json-schema";
import { useRouter } from "next/router";
import { getSupabaseInstance } from "utils/supabase";
import Modal from "components/Modal/Modal";

export default function Register() {
  const supabase = getSupabaseInstance();

  const [user, setUser] = useState({});
  const [errors, setErrors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(res => {
      if (res.data.session?.access_token) {
        router.replace('/admin');
      }
    });
  }, []);
  
  function handleFormSubmit() {
    const result = validate(user, {
      email: String,
      password: String,
      name: String,
    });
    
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    
    supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          name: user.name,
        },
        // captchaToken: '',
      }
    }).then(res => {
      return res.data;
    }).then(data => {
      console.log(data);
      if (!data.user) {
        setErrors(['User registration failed']);
        return;
      } else if (data.user.email !== user.email) {
        // User already exists, go to login
        router.push('/login');
      } else if (data.session) {
        // User is logged in, go to home page
        router.push('/admin/dashboard');
      } else if (!data.user.confirmed_at && data.user.confirmation_sent_at) {
        setMessage('A confirmation email is sent. Please check your email and confirm your registration.');
        setIsModalOpen(true);
      }
    });
  }

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 mt-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="rounded-t mb-0 px-6 py-6 hidden">
                <div className="text-center mb-3">
                  <h6 className="text-blueGray-500 text-sm font-bold">
                    Sign up with
                  </h6>
                </div>
                <div className="btn-wrapper text-center">
                  <button
                    className="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                    type="button"
                  >
                    <img alt="..." className="w-5 mr-1" src="/img/github.svg" />
                    Github
                  </button>
                  <button
                    className="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                    type="button"
                  >
                    <img alt="..." className="w-5 mr-1" src="/img/google.svg" />
                    Google
                  </button>
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div className="text-blueGray-400 text-center mb-3 font-bold hidden">
                  <small>Or sign up with credentials</small>
                </div>
                <form>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="user-name"
                    >
                      Name
                    </label>
                    <input
                      type="email"
                      id="user-name"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Name"
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="user-email"
                    >
                      Email
                    </label>
                    <input
                      id="user-email"
                      type="email"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Email"
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="user-password"
                    >
                      Password
                    </label>
                    <input
                      id="user-password"
                      type="password"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Password"
                      onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        id="customCheckLogin"
                        type="checkbox"
                        className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                      />
                      <span className="ml-2 text-sm font-semibold text-blueGray-600">
                        I agree with the{" "}
                        <a
                          href="#"
                          className="text-lightBlue-500"
                          onClick={(e) => e.preventDefault()}
                        >
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>

                  <div className="text-center mt-6">
                    <button
                      className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => handleFormSubmit()}
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => console.log('Modal is closed')}>
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            {message}
          </div>
        </div>
      </Modal>
    </>
  );
}

Register.layout = Auth;
