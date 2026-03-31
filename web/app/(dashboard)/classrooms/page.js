'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ClassroomFormModal from '@/components/modules/ClassroomFormModal';
import { getClassrooms } from '@/lib/supabase/queries';
import { statusLabel } from '@/lib/utils';

export default function ClassroomsPage() {
  const [rooms, setRooms]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editRoom, setEditRoom]   = useState(null);

  useEffect(() => {
    getClassrooms().then(d => { setRooms(d); setLoading(false); });
  }, []);

  const filtered = rooms.filter(r =>
    r.n_classrom.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: 'n_classrom', header: 'Room', width: '35%',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 font-bold text-xs flex-shrink-0">
            {row.n_classrom.slice(0, 2).toUpperCase()}
          </div>
          <p className="text-sm font-semibold text-slate-800">{row.n_classrom}</p>
        </div>
      ),
    },
    {
      key: 'capacity', header: 'Capacity',
      render: (row) => (
        <div>
          <span className="text-sm font-medium text-slate-700">{row.capacity}</span>
          <span className="text-xs text-slate-400 ml-1">seats</span>
        </div>
      ),
    },
    {
      key: 'occupancy', header: 'Occupancy',
      render: (row) => {
        const occ = Math.floor(Math.random() * 40) + 50;
        return (
          <div className="flex items-center gap-2 w-28">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${occ > 80 ? 'bg-emerald-500' : occ > 60 ? 'bg-amber-500' : 'bg-red-400'}`} style={{ width: `${occ}%` }} />
            </div>
            <span className="text-xs text-slate-500 w-8 text-right">{occ}%</span>
          </div>
        );
      },
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
      key: 'actions', header: '', width: '80px',
      render: (row) => (
        <button
          onClick={(e) => { e.stopPropagation(); setEditRoom(row); setModalOpen(true); }}
          className="text-xs text-primary-600 font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Edit
        </button>
      ),
    },
  ];

  return (
    <>
      <TopNav title="Classroom Directory" subtitle="Facilities" />
      <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search rooms…" value={search} onChange={e => setSearch(e.target.value)} className="sc-input pl-9" />
          </div>
          <Button onClick={() => { setEditRoom(null); setModalOpen(true); }}>
            <Plus size={14} /> Add Classroom
          </Button>
        </div>

        <p className="text-xs text-slate-400 mb-3">{filtered.length} classroom{filtered.length !== 1 ? 's' : ''}</p>

        <Table columns={columns} data={filtered} loading={loading} emptyState="No classrooms found." />

        <ClassroomFormModal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setEditRoom(null); }}
          classroom={editRoom}
          onSave={(r) => {
            if (editRoom) {
              setRooms(prev => prev.map(p => p.id_classrom === editRoom.id_classrom ? { ...p, ...r } : p));
            } else {
              setRooms(prev => [...prev, { ...r, id_classrom: Date.now() }]);
            }
          }}
        />
      </main>
    </>
  );
}
