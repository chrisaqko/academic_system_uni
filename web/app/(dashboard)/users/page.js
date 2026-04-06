"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit2,
  UserX,
  Filter,
  Eye,
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import UserFormModal from "@/components/modules/UserFormModal";
import UserDetailsModal from "@/components/modules/UserDetailsModal";
import { getUsers, upsertUser } from "@/lib/supabase/queries";
import { statusLabel, userTypeLabel } from "@/lib/utils";
import { getStudyProgramById } from "@/lib/supabase/queries";
import { supabase } from "@/lib/supabase/client";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);

  useEffect(() => {
    getUsers().then((d) => {
      setUsers(d);
      setLoading(false);
    });
  }, []);

  const filtered = users.filter((u) => {
    const matchSearch = `${u.name} ${u.surname} ${u.email}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.user_type === roleFilter;
    return matchSearch && matchRole;
  });

  const columns = [
    {
      key: "name",
      header: "User",
      width: "30%",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar
            name={row.name}
            surname={row.surname}
            size="sm"
            online={row.id_status === 1}
          />
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {row.name} {row.surname}
            </p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (row) => (
        <div>
          {row.phone_number ? (
            <p className="text-sm text-slate-700 font-medium">
              {row.country_code} {row.phone_number}
            </p>
          ) : (
            <p className="text-sm text-slate-400 italic">Not provided</p>
          )}
        </div>
      ),
    },
    {
      key: "user_type",
      header: "Role",
      render: (row) => (
        <Badge variant={row.user_type}>{userTypeLabel(row.user_type)}</Badge>
      ),
    },
    {
      key: "id_study_program",
      header: "Program",
      render: (row) => {
        console.log("Datos de la fila:", row);

        const programData = Array.isArray(row.study_program)
          ? row.study_program[0]
          : row.study_program;

        const programName = programData?.career_name || "Not assigned";
        const programId = row.id_study_program || "N/A";

        return (
          <Badge variant={row.id_study_program ? "active" : "default"}>
            {programName} (ID: {programId})
          </Badge>
        );
      },
    },
    {
      key: "id_specialization",
      header: "Specialization",
      render: (row) => {
        console.log("Datos de la fila:", row);

        const specializationData = Array.isArray(row.teaching_specialization)
          ? row.teaching_specialization[0]
          : row.teaching_specialization;

        const specializationName =
          specializationData?.specialization_area || "Not assigned";
        const specializationId = row.id_specialization;

        return (
          <Badge variant={row.id_specialization ? "active" : "default"}>
            {specializationName}
          </Badge>
        );
      },
    },
    {
      key: "id_status",
      header: "Status",
      render: (row) => (
        <Badge variant={row.id_status === 1 ? "active" : "inactive"} dot>
          {statusLabel(row.id_status === 1)}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      width: "100px",
      render: (row) => (
        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setViewUser(row);
            }}
            className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            title="View Details"
          >
            <Eye size={13} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditUser(row);
              setModalOpen(true);
            }}
            className="p-1.5 rounded-md text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            title="Edit"
          >
            <Edit2 size={13} />
          </button>
          <button
            className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Deactivate"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(row);
            }}
          >
            <UserX size={13} />
          </button>
        </div>
      ),
    },
  ];
  const handleToggleStatus = async (user) => {
    const newStatus = user.id_status === 1 ? 2 : 1;

    try {
      const { error } = await supabase
        .from("profile")
        .update({ id_status: newStatus })
        .eq("id_profile", user.id_profile);

      if (error) throw error;
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id_profile === user.id_profile ? { ...u, id_status: newStatus } : u,
        ),
      );
    } catch (error) {
      console.error("Error:", error);
      alert("Error.");
    }
  }; // --- FUNCIONES DE AYUDA (Colócalas fuera de tu componente o arriba del handleSaveUser) ---

  const sanitizeUserData = (formData) => {
    const data = { ...formData };

    // 1. Convertir strings vacíos a null
    const fieldsToNullify = [
      "id_study_program",
      "id_country",
      "id_province",
      "id_specialization",
    ];
    fieldsToNullify.forEach((field) => {
      if (data[field] === "") data[field] = null;
    });

    // 2. Limpiar la especialización si no es profesor
    const isTeacher = ["teacher", "Faculty"].includes(data.user_type);
    if (!isTeacher) data.id_specialization = null;

    return data;
  };

  const resolveAddressId = async (
    idCountry,
    idProvince,
    currentAddressId = null,
  ) => {
    if (!idCountry || !idProvince) return currentAddressId;
    const { data: existingAddr } = await supabase
      .from("address")
      .select("id_address")
      .eq("id_country", idCountry)
      .eq("id_province", idProvince)
      .single();

    if (existingAddr) return existingAddr.id_address;

    const { data: newAddr, error } = await supabase
      .from("address")
      .insert({ id_country: idCountry, id_province: idProvince })
      .select("id_address")
      .single();

    if (error) throw new Error("Error creating new address record");

    return newAddr.id_address;
  };

  // --- TU FUNCIÓN PRINCIPAL ---

  const handleSaveUser = async (formData) => {
    try {
      // 1. Limpiar los datos
      const cleanedData = sanitizeUserData(formData);

      // 2. Resolver la dirección (Sirve tanto para editar como para crear)
      const currentAddressId = editUser?.id_address || null;
      const finalIdAddress = await resolveAddressId(
        cleanedData.id_country,
        cleanedData.id_province,
        currentAddressId,
      );

      // 3. Preparar el payload final (Eliminamos datos "basura" usando desestructuración)
      const {
        id_country,
        id_province,
        study_program,
        address,
        teaching_specialization,
        ...payload
      } = cleanedData;

      payload.id_address = finalIdAddress;

      // 4. Guardar en la base de datos (Editar o Crear)
      if (editUser) {
        const { error } = await upsertUser({
          id_profile: editUser.id_profile,
          ...payload,
        });

        if (error) throw error;
        console.log("Profile updated");
      } else {
        const response = await fetch("/api/admin/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            password: "TempPassword123!",
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Error creating user");

        console.log("User created:", data.user);
      }

      // 5. Refrescar la tabla
      const updatedUsers = await getUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error", error);
      alert(error.message);
      throw error;
    }
  };

  return (
    <>
      <TopNav title="User Management" subtitle="Administration" />
      <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
            <div className="relative flex-1 max-w-xs">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search users…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="sc-input pl-9"
              />
            </div>
            <div className="relative">
              <Filter
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="sc-input pl-8 pr-8 appearance-none bg-white min-w-[120px]"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="teacher">Faculty</option>
                <option value="student">Student</option>
              </select>
            </div>
          </div>
          <Button
            onClick={() => {
              setEditUser(null);
              setModalOpen(true);
            }}
          >
            <Plus size={14} /> Add User
          </Button>
        </div>

        {/* Count */}
        <p className="text-xs text-slate-400 mb-3">
          {filtered.length} user{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* Table */}
        <Table
          columns={columns}
          data={filtered}
          loading={loading}
          emptyState="No users found matching your filters."
        />

        {/* Modal */}
        <UserFormModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditUser(null);
          }}
          user={editUser}
          onSave={handleSaveUser}
        />

        {/* User Details Modal */}
        <UserDetailsModal
          isOpen={!!viewUser}
          onClose={() => setViewUser(null)}
          user={viewUser}
          onEdit={(u) => {
            setViewUser(null);
            setEditUser(u);
            setModalOpen(true);
          }}
        />
      </main>
    </>
  );
}
