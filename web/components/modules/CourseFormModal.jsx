'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

export default function CourseFormModal({ isOpen, onClose, course = null, onSave }) {
  const isEdit = !!course;
  const [form, setForm] = useState({
    name:      course?.name || '',
    credits:   course?.credits ?? 3,
    quota:     course?.quota ?? 30,
    id_status: course?.id_status ?? 1,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Course name is required';
    if (form.credits < 0 || form.credits > 12) e.credits = 'Credits must be 0-12';
    if (form.quota < 1) e.quota = 'Quota must be at least 1';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    onSave?.({ ...form, credits: Number(form.credits), quota: Number(form.quota) });
    setSaving(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Course' : 'Add New Course'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Course Name" id="courseName" value={form.name} onChange={e => update('name', e.target.value)} error={errors.name} placeholder="e.g. Advanced Architecture" />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Credits" id="credits" type="number" min="0" max="12" value={form.credits} onChange={e => update('credits', e.target.value)} error={errors.credits} />
          <Input label="Quota (max students)" id="quota" type="number" min="1" value={form.quota} onChange={e => update('quota', e.target.value)} error={errors.quota} />
        </div>
        <Select
          label="Status"
          id="courseStatus"
          value={form.id_status}
          onChange={e => update('id_status', Number(e.target.value))}
          options={[
            { value: 1, label: 'Active' },
            { value: 2, label: 'Inactive' },
          ]}
        />
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button type="submit" loading={saving}>{isEdit ? 'Save Changes' : 'Create Course'}</Button>
        </div>
      </form>
    </Modal>
  );
}
