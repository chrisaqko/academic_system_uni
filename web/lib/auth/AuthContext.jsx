"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

// ── Context ──────────────────────────────────────────────────────

const AuthContext = createContext(null);

// ── Provider ─────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Called once when the dashboard layout mounts.
    // All child components read from context — no individual useEffects needed.
    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const { data: prof, error } = await supabase
        .from("profile")
        .select(
          "id_profile, name, surname, second_surname, email, user_type, country_code, phone_number, id_status, id_specialization, id_study_program",
        )
        .eq("id_profile", session.user.id)
        .single();

      if (error || !prof) {
        console.error("AuthProvider: could not load profile", error?.message);
        router.replace("/login");
        return;
      }

      setProfile(prof);
      setLoading(false);
    }

    init();

    // Keep session in sync if the user logs out in another tab
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          setProfile(null);
          router.replace("/login");
        }
      },
    );

    return () => listener.subscription.unsubscribe();
  }, [router]);

  return (
    <AuthContext.Provider value={{ profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}

// ── Logout helper ─────────────────────────────────────────────────

export async function signOut() {
  await supabase.auth.signOut();
}
