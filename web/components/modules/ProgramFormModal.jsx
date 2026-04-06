'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

export default function ProgramFormModal({ isOpen, onClose, program = null, onSave }) {
  const isEdit = !!program;
  const [form, setForm] = useState({
    career_name: program?.career_name || '',
    id_status: program?.id_status ?? 1,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.career_name.trim()) e.career_name = 'Program name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    
    // Pass back payload
    const payload = { ...form };
    if (isEdit) {
      payload.id_program = program.id_program;
    }
    
    try {
      await onSave(payload);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Program' : 'Add New Program'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="Program Name" 
          id="careerName" 
          value={form.career_name} 
          onChange={(e) => update('career_name', e.target.value)} 
          error={errors.career_name} 
          placeholder="e.g. Computer Science" 
        />
        <Select
          label="Status"
          id="programStatus"
          value={form.id_status}
          onChange={(e) => update('id_status', Number(e.target.value))}
          options={[
            { value: 1, label: 'Active' },
            { value: 2, label: 'Inactive' },
          ]}
        />
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button type="submit" loading={saving}>{isEdit ? 'Save Changes' : 'Create Program'}</Button>
        </div>
      </form>
    </Modal>
  );
}
