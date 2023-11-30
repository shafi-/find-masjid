import React, { StrictMode, useEffect, useState } from "react";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";
import Navbar from "components/Navbars/IndexNavbar";
import Footer from "components/Footers/Footer";
import Drawer from "components/Navbars/Drawer";
import { getSupabaseInstance } from "utils/supabase";
import DrawerNavbar from "components/Navbars/DrawerNavbar";
import { useRouter } from "next/router";

export default function Admin({ children }) {
  const supabase = getSupabaseInstance();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      supabase.auth.getSession().then(res => {
        if (res.error || !res.data?.session) {
          router.replace('/auth/login');
        }
      }).catch(err => {
        console.error(err);
        router.replace('/auth/login');
      });
    }, 300);
  }, []);

  return (
    <main className={isDrawerOpen ? "h-screen overflow-y-hidden" : "bg-gray-200 min-h-screen"}>
      <Drawer isLoggedIn={isLoggedIn} isOpen={isDrawerOpen} onDrawerClose={() => setIsDrawerOpen(false)} />

      <DrawerNavbar className="drawer-navbar absolute left-0 top-0 max-h-[10vh] w-full" onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen) } />

      <section className="container pt-16 items-center">
        <div className="flex flex-wrap items-center mx-auto">
          <div className="p-8 bg-white my-6 rounded w-full px-4">
            {children}        
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
