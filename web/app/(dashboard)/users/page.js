'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, MoreHorizontal, Edit2, UserX, Filter } from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import UserFormModal from '@/components/modules/UserFormModal';
import { getUsers } from '@/lib/supabase/queries';
import { statusLabel, userTypeLabel } from '@/lib/utils';

export default function UsersPage() {
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser]   = useState(null);

  useEffect(() => {
    getUsers().then(d => { setUsers(d); setLoading(false); });
  }, []);

  const filtered = users.filter(u => {
    const matchSearch = `${u.name} ${u.surname} ${u.email}`.toLowerCase().includes(search.toLowerCase());
    const matchRole   = roleFilter === 'all' || u.user_type === roleFilter;
    return matchSearch && matchRole;
  });

  const columns = [
    {
      key: 'name', header: 'User', width: '30%',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} surname={row.surname} size="sm" online={row.id_status === 1} />
          <div>
            <p className="text-sm font-semibold text-slate-800">{row.name} {row.surname}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'user_type', header: 'Role',
      render: (row) => <Badge variant={row.user_type}>{userTypeLabel(row.user_type)}</Badge>,
    },
    {
      key: 'id_status', header: 'Status',
      render: (row) => (
        <Badge variant={row.id_status === 1 ? 'active' : 'inactive'} dot>
          {statusLabel(row.id_status === 1)}
        </Badge>
      ),
    },
    {
      key: 'actions', header: '', width: '100px',
      render: (row) => (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); setEditUser(row); setModalOpen(true); }}
            className="p-1.5 rounded-md text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            title="Edit"
          >
            <Edit2 size={13} />
          </button>
          <button
            className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Deactivate"
          >
            <UserX size={13} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <TopNav title="User Management" subtitle="Administration" />
      <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search users…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="sc-input pl-9"
              />
            </div>
            <div className="relative">
              <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="sc-input pl-8 pr-8 appearance-none bg-white min-w-[120px]"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="teacher">Faculty</option>
                <option value="student">Student</option>
              </select>
            </div>
          </div>
          <Button onClick={() => { setEditUser(null); setModalOpen(true); }}>
            <Plus size={14} /> Add User
          </Button>
        </div>

        {/* Count */}
        <p className="text-xs text-slate-400 mb-3">{filtered.length} user{filtered.length !== 1 ? 's' : ''} found</p>

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
          onClose={() => { setModalOpen(false); setEditUser(null); }}
          user={editUser}
          onSave={(u) => {
            if (editUser) {
              setUsers(prev => prev.map(p => p.id_user === editUser.id_user ? { ...p, ...u } : p));
            } else {
              setUsers(prev => [...prev, { ...u, id_user: Date.now() }]);
            }
          }}
        />
      </main>
    </>
  );
}
