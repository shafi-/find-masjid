import React, { useEffect, useState } from "react";

// components

import CardTable from "components/Cards/CardTable.js";

// layout for page

import Admin from "layouts/Admin.js";
import { createClient } from "@supabase/supabase-js";

export default function Tables() {
  const supabase = createClient('https://apfvanrrmosixcmtitkb.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwZnZhbnJybW9zaXhjbXRpdGtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk1NDk3NjMsImV4cCI6MjAxNTEyNTc2M30.5UlVLJ1tolVZ5FI01w6O1Hj8kOETYgOoy1rDgPtUeAw');
  const [masjids, setMasjids] = useState([]);

  useEffect(() => {
    supabase.from('masjids').select('*', { count: 10 }).then(res => setMasjids(res.data));
  }, []);

  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardTable color="dark" data={masjids} />
        </div>
      </div>
    </>
  );
}

Tables.layout = Admin;
