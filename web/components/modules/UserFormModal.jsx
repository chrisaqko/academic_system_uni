"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import {
  getProgramOptions,
  getCountries,
  getProvinces,
  getSpecializations,
  getAddressIdByCombination,
} from "@/lib/supabase/queries";

export default function UserFormModal({
  isOpen,
  onClose,
  user = null,
  onSave,
}) {
  const isEdit = !!user;
  const [form, setForm] = useState({
    name: "",
    surname: "",
    second_surname: "",
    email: "",
    user_type: "student",
    phone_number: "",
    id_status: 1,
    id_study_program: "",
    id_country: "",
    id_province: "",
    id_specialization: "",
    country_code: "+506",
  });
  const [programOptions, setProgramOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [specializationOptions, setSpecializationOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        surname: user.surname || "",
        second_surname: user.second_surname || "",
        email: user.email || "",
        user_type: user.user_type || "student",
        phone_number: user.phone_number || "",
        id_status: user.id_status ?? 1,
        id_study_program: user.id_study_program || "",
        id_country:
          user.address?.id_country ??
          (Array.isArray(user.address) ? user.address[0]?.id_country : ""),
        id_province:
          user.address?.id_province ??
          (Array.isArray(user.address) ? user.address[0]?.id_province : ""),
        id_specialization: user.id_specialization || "",
        country_code: user.country_code || "+506",
      });
    } else {
      setForm({
        name: "",
        surname: "",
        second_surname: "",
        email: "",
        user_type: "student",
        phone_number: "",
        id_status: 1,
        id_study_program: "",
        id_country: "",
        id_province: "",
        id_specialization: "",
        country_code: "+506",
      });
      setErrors({});
    }
  }, [user]);
  useEffect(() => {
    Promise.all([
      getProgramOptions(),
      getCountries(),
      getProvinces(),
      getSpecializations(),
    ])
      .then(([programs, countriesRes, provincesRes, specsRes]) => {
        setProgramOptions(
          programs.map((prog) => ({
            value: prog.id_program,
            label: prog.career_name,
          })),
        );
        setCountryOptions(
          countriesRes.map((c) => ({
            value: Number(c.id_country),
            label: c.country,
          })),
        );
        setProvinceOptions(
          provincesRes.map((p) => ({
            value: Number(p.id_province),
            label: p.province,
          })),
        );
        setSpecializationOptions(
          specsRes.map((s) => ({
            value: Number(s.id_specialization),
            label: s.specialization_area,
          })),
        );
      })
      .catch(console.error);
  }, []);
  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.surname.trim()) e.surname = "Surname is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email format";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      let final_id_address = user?.id_address || null;

      if (form.id_country && form.id_province) {
        const foundAddressId = await getAddressIdByCombination(
          form.id_country,
          form.id_province,
        );
        if (foundAddressId) {
          final_id_address = foundAddressId;
        }
      }
      if (onSave) {
        await onSave({ ...form, id_address: final_id_address });
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit User" : "Add New User"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
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
        <Input
          label="Second Surname (optional)"
          id="second_surname"
          value={form.second_surname}
          onChange={(e) => update("second_surname", e.target.value)}
          placeholder="e.g. Vance"
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
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Role"
            id="user_type"
            value={form.user_type}
            onChange={(e) => update("user_type", e.target.value)}
            options={[
              { value: "student", label: "Student" },
              { value: "teacher", label: "Faculty" },
              { value: "admin", label: "Administrator" },
            ]}
          />
          <Select
            label="Status"
            id="id_status"
            value={form.id_status}
            onChange={(e) => update("id_status", Number(e.target.value))}
            options={[
              { value: 1, label: "Active" },
              { value: 2, label: "Inactive" },
            ]}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
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
                label="Phone (optional)"
                id="phone"
                value={form.phone_number}
                onChange={(e) =>
                  update("phone_number", e.target.value.replace(/[^0-9]/g, ""))
                }
                placeholder="5550100"
              />
            </div>
          </div>
          <Select
            label="Program"
            id="id_study_program"
            value={form.id_study_program}
            onChange={(e) =>
              update(
                "id_study_program",
                e.target.value ? Number(e.target.value) : "",
              )
            }
            options={[{ value: "", label: "None" }, ...programOptions]}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Country"
            id="id_country"
            value={form.id_country}
            onChange={(e) =>
              update("id_country", e.target.value ? Number(e.target.value) : "")
            }
            options={[
              { value: "", label: "Select Country" },
              ...countryOptions,
            ]}
          />
          <Select
            label="Province"
            id="id_province"
            value={form.id_province}
            onChange={(e) =>
              update(
                "id_province",
                e.target.value ? Number(e.target.value) : "",
              )
            }
            options={[
              { value: "", label: "Select Province" },
              ...provinceOptions,
            ]}
            disabled={!form.id_country}
          />
        </div>
        {(form.user_type === "teacher" || form.user_type === "Faculty") && (
          <Select
            label="Specialization"
            id="id_specialization"
            value={form.id_specialization}
            onChange={(e) =>
              update(
                "id_specialization",
                e.target.value ? Number(e.target.value) : "",
              )
            }
            options={[
              { value: "", label: "Select Specialization" },
              ...specializationOptions,
            ]}
          />
        )}

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {isEdit ? "Save Changes" : "Create User"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
