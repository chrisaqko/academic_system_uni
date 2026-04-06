"use client";

import { useEffect, useState } from "react";
import { Plus, BookMarked } from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { getStudyPrograms, upsertStudyProgram } from "@/lib/supabase/queries";
import { statusLabel } from "@/lib/utils";
import ProgramFormModal from "@/components/modules/ProgramFormModal";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const fetchPrograms = async () => {
    const d = await getStudyPrograms();
    setPrograms(d);
  };

  // Run on mount
  useEffect(() => {
    getStudyPrograms().then((d) => {
      setPrograms(d);
      setLoading(false);
    });
  }, []);

  const handleSave = async (payload) => {
    await upsertStudyProgram(payload);
    // Re-fetch without triggering the full-page loading skeleton
    await fetchPrograms();
  };

  const openNew = () => {
    setSelectedProgram(null);
    setIsModalOpen(true);
  };

  const openEdit = (prog) => {
    setSelectedProgram(prog);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <>
        <TopNav title="Study Programs" subtitle="Academic Management" />
        <main className="flex-1 p-6">
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-slate-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <TopNav title="Study Programs" subtitle="Academic Management" />
      <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs text-slate-400">
            {programs.length} programs registered
          </p>
          <Button onClick={openNew}>
            <Plus size={14} /> Add Program
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map((prog) => (
            <div
              key={prog.id_program}
              onClick={() => openEdit(prog)}
              className="bg-white border border-slate-200 rounded-xl shadow-soft p-5 hover:shadow-card hover:border-slate-300 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                    <BookMarked size={18} className="text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      {prog.career_name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Program ID: PRG-{String(prog.id_program).padStart(3, "0")}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={prog.id_status === 1 ? "active" : "inactive"}
                  dot
                >
                  {statusLabel(prog.id_status === 1)}
                </Badge>
              </div>
              <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500">
                    {prog._courseCount} courses linked
                  </span>
                </div>
                <span className="text-xs text-primary-600 font-medium hover:underline ml-auto">
                  View courses →
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      {isModalOpen && (
        <ProgramFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          program={selectedProgram}
          onSave={handleSave}
        />
      )}
    </>
  );
}
