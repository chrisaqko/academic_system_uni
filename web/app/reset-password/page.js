"use client";

import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import RequestReset from "@/components/auth/RequestReset";
import UpdatePassword from "@/components/auth/UpdatePassword";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [view, setView] = useState("request"); // 'request' or 'update'
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      // Look for active session in case they clicked the reset link
      const { data: { session } } = await supabase.auth.getSession();
      
      // If there's a fragment with an access token or an active session, they are ready to update
      if (session || window.location.hash.includes("access_token")) {
        setView("update");
      }
      setChecking(false);
    };

    checkSession();

    // Supabase will fire the PASSWORD_RECOVERY event when the user clicks the link in their email
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setView("update");
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin h-8 w-8 text-primary-600 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-primary-50/30 flex flex-col">
      <header className="px-6 py-4 flex items-center gap-3">
        <div
          className="w-8 h-8 bg-primary-700 rounded-lg flex items-center justify-center cursor-pointer"
          onClick={() => router.push("/")}
        >
          <GraduationCap size={16} className="text-white" />
        </div>
        <span className="font-bold text-slate-900">Scholastic Curator</span>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-card p-6">
            {view === "request" ? <RequestReset /> : <UpdatePassword />}
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-300">
        © {new Date().getFullYear()} The Scholastic Curator. All institutional rights reserved.
      </footer>
    </div>
  );
}
