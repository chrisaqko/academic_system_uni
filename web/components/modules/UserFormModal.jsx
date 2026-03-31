'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

export default function UserFormModal({ isOpen, onClose, user = null, onSave }) {
  const isEdit = !!user;
  const [form, setForm] = useState({
    name:           user?.name || '',
    surname:        user?.surname || '',
    second_surname: user?.second_surname || '',
    email:          user?.email || '',
    user_type:      user?.user_type || 'student',
    phone_number:   user?.phone_number || '',
    id_status:      user?.id_status ?? 1,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.surname.trim()) e.surname = 'Surname is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    onSave?.(form);
    setSaving(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit User' : 'Add New User'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="First Name" id="name" value={form.name} onChange={e => update('name', e.target.value)} error={errors.name} placeholder="e.g. Alex" />
          <Input label="Surname" id="surname" value={form.surname} onChange={e => update('surname', e.target.value)} error={errors.surname} placeholder="e.g. Rivers" />
        </div>
        <Input label="Second Surname (optional)" id="second_surname" value={form.second_surname} onChange={e => update('second_surname', e.target.value)} placeholder="e.g. Vance" />
        <Input label="Email" id="email" type="email" value={form.email} onChange={e => update('email', e.target.value)} error={errors.email} placeholder="user@scholastic.edu" />
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Role"
            id="user_type"
            value={form.user_type}
            onChange={e => update('user_type', e.target.value)}
            options={[
              { value: 'student', label: 'Student' },
              { value: 'teacher', label: 'Faculty' },
              { value: 'admin',   label: 'Administrator' },
            ]}
          />
          <Select
            label="Status"
            id="id_status"
            value={form.id_status}
            onChange={e => update('id_status', Number(e.target.value))}
            options={[
              { value: 1, label: 'Active' },
              { value: 2, label: 'Inactive' },
            ]}
          />
        </div>
        <Input label="Phone (optional)" id="phone" value={form.phone_number} onChange={e => update('phone_number', e.target.value)} placeholder="+1 555-0100" />

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button type="submit" loading={saving}>{isEdit ? 'Save Changes' : 'Create User'}</Button>
        </div>
      </form>
    </Modal>
  );
}
