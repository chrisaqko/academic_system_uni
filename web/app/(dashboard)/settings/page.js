"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { supabase } from "@/lib/supabase/client";
import TopNav from "@/components/layout/TopNav";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { getCountries, getProvinces, getAddressIdByCombination, upsertUser } from "@/lib/supabase/queries";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const { profile } = useAuth();
  
  const [form, setForm] = useState({
    name: "",
    surname: "",
    second_surname: "",
    country_code: "+506",
    phone_number: "",
    email: "",
    id_country: "",
    id_province: "",
    password: "",
    confirm_password: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!profile) return;
    
    async function loadData() {
      try {
        const [prof, countryOptions, provinceOptions] = await Promise.all([
          supabase.from("profile").select(`*, address(*)`).eq("id_profile", profile.id_profile).single().then(res => res.data),
          getCountries(),
          getProvinces()
        ]);

        if (prof) {
          const address = Array.isArray(prof.address) ? prof.address[0] : prof.address;
          setForm({
            name: prof.name || "",
            surname: prof.surname || "",
            second_surname: prof.second_surname || "",
            country_code: prof.country_code || "+506",
            phone_number: prof.phone_number || "",
            email: prof.email || "",
            id_country: address?.id_country || "",
            id_province: address?.id_province || "",
            password: "",
            confirm_password: ""
          });
        }
        
        setCountries(countryOptions.map(c => ({ value: Number(c.id_country), label: c.country })));
        setProvinces(provinceOptions.map(p => ({ value: Number(p.id_province), label: p.province })));
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [profile]);

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.surname.trim()) e.surname = "Surname is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email format";
    if (form.password) {
      if (form.password.length < 6) e.password = "Password must be at least 6 characters";
      if (form.password !== form.confirm_password) e.confirm_password = "Passwords do not match";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setSuccessMsg("");
    try {
      let final_id_address = null;

      if (form.id_country && form.id_province) {
        const foundAddressId = await getAddressIdByCombination(form.id_country, form.id_province);
        if (foundAddressId) {
          final_id_address = foundAddressId;
        } else {
          const { data: newAddr, error } = await supabase
            .from("address")
            .insert({ id_country: form.id_country, id_province: form.id_province })
            .select("id_address")
            .single();
          if (error) throw new Error("Error creating new address record");
          final_id_address = newAddr.id_address;
        }
      }

      await upsertUser({
        id_profile: profile.id_profile,
        name: form.name,
        surname: form.surname,
        second_surname: form.second_surname,
        country_code: form.country_code,
        phone_number: form.phone_number,
        email: form.email, 
        id_address: final_id_address
      });

      if (form.password) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: form.password
        });
        if (passwordError) throw passwordError;
      }
      
      setSuccessMsg("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <TopNav title="Settings" subtitle="Your Profile" />
        <main className="p-6">
          <div className="text-slate-400">Loading...</div>
        </main>
      </>
    );
  }

  return (
    <>
      <TopNav title="Settings" subtitle="Your Profile" />
      <main className="p-6 max-w-3xl animate-fade-in">
        <div className="bg-white rounded-xl shadow-soft border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Personal Information</h2>
          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium">
              {successMsg}
            </div>
          )}
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="First Name"
                id="name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                error={errors.name}
                placeholder="e.g. Alex"
              />
              <Input
                label="Surname"
                id="surname"
                value={form.surname}
                onChange={(e) => update("surname", e.target.value)}
                error={errors.surname}
                placeholder="e.g. Rivers"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Second Surname (optional)"
                id="second_surname"
                value={form.second_surname}
                onChange={(e) => update("second_surname", e.target.value)}
              />
              <Input
                label="Email"
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                error={errors.email}
                placeholder="user@scholastic.edu"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex gap-2">
                <div className="w-1/3">
                  <Select
                    label="Code"
                    id="country_code"
                    value={form.country_code}
                    onChange={(e) => update("country_code", e.target.value)}
                    options={[
                      { value: "+506", label: "+506 (CR)" },
                      { value: "+1", label: "+1 (US)" },
                    ]}
                  />
                </div>
                <div className="w-2/3">
                  <Input
                    label="Phone"
                    id="phone"
                    value={form.phone_number}
                    onChange={(e) => update("phone_number", e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="5550100"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Select
                label="Country"
                id="id_country"
                value={form.id_country}
                onChange={(e) => update("id_country", e.target.value ? Number(e.target.value) : "")}
                options={[{ value: "", label: "Select Country" }, ...countries]}
              />
              <Select
                label="Province"
                id="id_province"
                value={form.id_province}
                onChange={(e) => update("id_province", e.target.value ? Number(e.target.value) : "")}
                options={[{ value: "", label: "Select Province" }, ...provinces]}
                disabled={!form.id_country}
              />
            </div>

            <h3 className="text-md font-bold text-slate-800 pt-4 border-t border-slate-100 mt-6">Security</h3>
            <p className="text-xs text-slate-500 mb-2">Leave blank if you do not wish to change your password.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="New Password"
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                error={errors.password}
                placeholder="••••••••"
              />
              <Input
                label="Confirm New Password"
                id="confirm_password"
                type="password"
                value={form.confirm_password}
                onChange={(e) => update("confirm_password", e.target.value)}
                error={errors.confirm_password}
                placeholder="••••••••"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button type="submit" loading={saving}>
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
