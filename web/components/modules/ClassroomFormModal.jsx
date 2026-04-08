"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

const DEFAULT_FORM = { n_classrom: "", capacity: 30, id_status: 1 };

export default function ClassroomFormModal({
  isOpen,
  onClose,
  classroom = null,
  onSave,
  initialMode = "create",
}) {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      if (classroom) {
        setForm({
          n_classrom: classroom.n_classrom ?? "",
          capacity: classroom.capacity ?? 30,
          id_status: classroom.id_status ?? 1,
        });
      } else {
        setForm(DEFAULT_FORM);
      }
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, classroom, initialMode]);

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.n_classrom.trim()) e.n_classrom = "Room name is required";
    if (Number(form.capacity) < 1) e.capacity = "Capacity must be at least 1";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    await onSave?.({ ...form, capacity: Number(form.capacity) });
    setSaving(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === "view"
          ? "Classroom Details"
          : mode === "edit"
            ? "Edit Classroom"
            : "Add New Classroom"
      }
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Room Name / Number"
          id="roomName"
          value={form.n_classrom}
          onChange={(e) => update("n_classrom", e.target.value)}
          error={errors.n_classrom}
          placeholder="e.g. Hall 4B"
          disabled={mode === "view"}
        />
        <Input
          label="Capacity"
          id="capacity"
          type="number"
          min="1"
          value={form.capacity}
          onChange={(e) => update("capacity", e.target.value)}
          error={errors.capacity}
          disabled={mode === "view"}
        />
        <Select
          label="Status"
          id="roomStatus"
          value={form.id_status}
          onChange={(e) => update("id_status", Number(e.target.value))}
          options={[
            { value: 1, label: "Active" },
            { value: 2, label: "Inactive" },
          ]}
          disabled={mode === "view"}
        />
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} type="button">
            {mode === "view" ? "Close" : "Cancel"}
          </Button>
          {mode === "view" ? (
            <Button type="button" onClick={() => setMode("edit")}>
              Edit Info
            </Button>
          ) : (
            <Button type="submit" loading={saving}>
              {mode === "edit" ? "Save Changes" : "Add Classroom"}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}
