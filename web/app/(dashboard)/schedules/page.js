"use client";

import { useEffect, useState } from "react";
import TopNav from "@/components/layout/TopNav";
import ScheduleGrid from "@/components/dashboard/ScheduleGrid";
import { supabase } from "@/lib/supabase/client";
import {
  getSchedules,
  getTeacherSchedule,
  getStudentEnrollments,
} from "@/lib/supabase/queries";

export default function SchedulesPage() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      try {
        const { data: authData, error: authError } =
          await supabase.auth.getSession();
        const currentSession = authData?.session;

        if (authError || !currentSession) {
          setLoading(false);
          return;
        }
        setSession(currentSession);
        const { data: profile, error: profileError } = await supabase
          .from("profile")
          .select("user_type, id_profile")
          .eq("id_profile", currentSession.user.id)
          .single();

        if (profileError || !profile) {
          console.error("No se pudo cargar el perfil:", profileError);
          setLoading(false);
          return;
        }

        let fetchedData = [];

        if (profile.user_type === "admin") {
          fetchedData = await getSchedules();
        } else if (profile.user_type === "teacher") {
          fetchedData = await getTeacherSchedule(profile.id_profile);
        } else {
          fetchedData = await getStudentEnrollments(profile.id_profile);
        }

        setEntries(fetchedData);
      } catch (err) {
        console.error("Error inesperado en load:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const titles = {
    admin: "All Schedules",
    teacher: "My Teaching Schedule",
    student: "My Schedule",
  };

  return (
    <>
      <TopNav title="Schedule Management" subtitle="Academic Calendar" />
      <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
        <ScheduleGrid
          entries={entries}
          title={titles[session?.user_type] || "Schedule"}
        />
      </main>
    </>
  );
}
