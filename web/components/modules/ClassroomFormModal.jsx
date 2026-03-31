'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

export default function ClassroomFormModal({ isOpen, onClose, classroom = null, onSave }) {
  const isEdit = !!classroom;
  const [form, setForm] = useState({
    n_classrom: classroom?.n_classrom || '',
    capacity:   classroom?.capacity ?? 30,
    id_status:  classroom?.id_status ?? 1,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.n_classrom.trim()) e.n_classrom = 'Room name is required';
    if (form.capacity < 1) e.capacity = 'Capacity must be at least 1';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    onSave?.({ ...form, capacity: Number(form.capacity) });
    setSaving(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Classroom' : 'Add New Classroom'} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Room Name / Number" id="roomName" value={form.n_classrom} onChange={e => update('n_classrom', e.target.value)} error={errors.n_classrom} placeholder="e.g. Hall 4B" />
        <Input label="Capacity" id="capacity" type="number" min="1" value={form.capacity} onChange={e => update('capacity', e.target.value)} error={errors.capacity} />
        <Select
          label="Status"
          id="roomStatus"
          value={form.id_status}
          onChange={e => update('id_status', Number(e.target.value))}
          options={[
            { value: 1, label: 'Active' },
            { value: 2, label: 'Inactive' },
          ]}
        />
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button type="submit" loading={saving}>{isEdit ? 'Save Changes' : 'Add Classroom'}</Button>
        </div>
      </form>
    </Modal>
  );
}
