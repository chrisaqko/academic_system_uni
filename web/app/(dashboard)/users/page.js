"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Filter, Edit2, UserX, Eye, Users } from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Table from "@/components/ui/Table";
import GridView from "@/components/ui/GridView";
import ViewToggle from "@/components/ui/ViewToggle";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import UserFormModal from "@/components/modules/UserFormModal";
import UserDetailsModal from "@/components/modules/UserDetailsModal";
import { getUsers, upsertUser } from "@/lib/supabase/queries";
import { statusLabel, userTypeLabel } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [viewMode, setViewMode] = useState("list");
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

  // ── Table columns ──────────────────────────────────────────────────────────
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
        const programData = Array.isArray(row.study_program)
          ? row.study_program[0]
          : row.study_program;
        const programName = programData?.career_name || "Not assigned";
        return (
          <Badge variant={row.id_study_program ? "active" : "default"}>
            {programName}
          </Badge>
        );
      },
    },
    {
      key: "id_specialization",
      header: "Specialization",
      render: (row) => {
        const specializationData = Array.isArray(row.teaching_specialization)
          ? row.teaching_specialization[0]
          : row.teaching_specialization;
        const specializationName =
          specializationData?.specialization_area || "Not assigned";
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
      header: "Actions",
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

  // ── Grid card renderer ────────────────────────────────────────────────────
  const renderCard = (row) => {
    const programData = Array.isArray(row.study_program)
      ? row.study_program[0]
      : row.study_program;
    const programName = programData?.career_name || null;

    return (
      <div className="group relative bg-white border border-slate-200 rounded-xl shadow-soft p-5 hover:shadow-card hover:border-slate-300 transition-all duration-200">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <Avatar
            name={row.name}
            surname={row.surname}
            size="md"
            online={row.id_status === 1}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {row.name} {row.surname}
            </p>
            <p className="text-xs text-slate-400 truncate">{row.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant={row.user_type}>
                {userTypeLabel(row.user_type)}
              </Badge>
              <Badge variant={row.id_status === 1 ? "active" : "inactive"} dot>
                {statusLabel(row.id_status === 1)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Footer details */}
        {programName && (
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500 truncate">
              <span className="font-medium text-slate-600">Program: </span>
              {programName}
            </p>
          </div>
        )}

        {/* Hover action buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setViewUser(row);
            }}
            className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 shadow-sm transition-colors"
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
            className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-400 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 shadow-sm transition-colors"
            title="Edit"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(row);
            }}
            className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 shadow-sm transition-colors"
            title="Deactivate"
          >
            <UserX size={13} />
          </button>
        </div>
      </div>
    );
  };

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
  };

  const sanitizeUserData = (formData) => {
    const data = { ...formData };
    const fieldsToNullify = [
      "id_study_program",
      "id_country",
      "id_province",
      "id_specialization",
    ];
    fieldsToNullify.forEach((field) => {
      if (data[field] === "") data[field] = null;
    });
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

  const handleSaveUser = async (formData) => {
    try {
      const cleanedData = sanitizeUserData(formData);
      const currentAddressId = editUser?.id_address || null;
      const finalIdAddress = await resolveAddressId(
        cleanedData.id_country,
        cleanedData.id_province,
        currentAddressId,
      );
      const {
        id_country,
        id_province,
        study_program,
        address,
        teaching_specialization,
        ...payload
      } = cleanedData;
      payload.id_address = finalIdAddress;
      if (editUser) {
        const { error } = await upsertUser({
          id_profile: editUser.id_profile,
          ...payload,
        });
        if (error) throw error;
      } else {
        const generatedPassword = Math.random().toString(36).slice(-8) + "A1!z";
        const response = await fetch("/api/admin/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, password: generatedPassword }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Error creating user");
        
        alert(`User created successfully.\nTemporary password: ${generatedPassword}\n\nPlease ensure this password is provided to the user, as it cannot be retrieved later.`);
      }
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
                id="users-search"
                name="users-search"
                type="text"
                autoComplete="off"
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
                id="users-role-filter"
                name="users-role-filter"
                autoComplete="off"
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
            <ViewToggle value={viewMode} onChange={setViewMode} />
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

        <p className="text-xs text-slate-400 mb-3">
          {filtered.length} user{filtered.length !== 1 ? "s" : ""} found
        </p>

        {viewMode === "list" ? (
          <Table
            columns={columns}
            data={filtered}
            loading={loading}
            emptyState="No users found matching your filters."
          />
        ) : (
          <GridView
            data={filtered}
            renderCard={renderCard}
            loading={loading}
            emptyState="No users found matching your filters."
          />
        )}
      </main>

      <UserFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditUser(null);
        }}
        user={editUser}
        onSave={handleSaveUser}
      />

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
    </>
  );
}
