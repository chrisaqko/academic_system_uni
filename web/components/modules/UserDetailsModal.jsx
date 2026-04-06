"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase/client";
import { statusLabel, userTypeLabel } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

export default function UserDetailsModal({ isOpen, onClose, user, onEdit }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      const fetchExtraDetails = async () => {
        setLoading(true);
        // Assuming we have to query address, teaching_specialization, etc if they exist.
        // We will do a full fetch of the joined data to easily display the labels.
        try {
          const { data, error } = await supabase
            .from("profile")
            .select(`
              *,
              study_program ( career_name ),
              teaching_specialization ( specialization_area ),
              address (
                id_country,
                id_province,
                country ( country ),
                province ( province )
              )
            `)
            .eq("id_profile", user.id_profile)
            .single();

          if (error) throw error;
          setDetails(data);
        } catch (error) {
          console.error("Failed to load user extra details:", error);
          setDetails(user); // fallback to basic user payload
        } finally {
          setLoading(false);
        }
      };

      fetchExtraDetails();
    } else {
      setDetails(null);
    }
  }, [user, isOpen]);

  // Early return if not open
  if (!isOpen) return null;

  const displayData = details || user || {};

  // Formatter helpers
  const programData = Array.isArray(displayData.study_program) ? displayData.study_program[0] : displayData.study_program;
  const programName = programData?.career_name || "Not assigned";
  
  const specializationData = Array.isArray(displayData.teaching_specialization) ? displayData.teaching_specialization[0] : displayData.teaching_specialization;
  const specName = specializationData?.specialization_area || "Not assigned";

  const addressData = Array.isArray(displayData.address) ? displayData.address[0] : displayData.address;
  const countryName = Array.isArray(addressData?.country) ? addressData.country[0]?.country : addressData?.country?.country || "Unknown Country";
  const provinceName = Array.isArray(addressData?.province) ? addressData.province[0]?.province : addressData?.province?.province || "Unknown Province";

  const dataFields = [
    { label: "Role", value: <Badge variant={displayData.user_type}>{userTypeLabel(displayData.user_type)}</Badge> },
    { label: "Status", value: <Badge variant={displayData.id_status === 1 ? "active" : "inactive"} dot>{statusLabel(displayData.id_status === 1)}</Badge> },
    { label: "Profile ID", value: <span className="font-mono text-xs overflow-hidden text-ellipsis">{displayData.id_profile}</span> },
    { label: "Study Program", value: programName },
    { label: "Phone Number", value: displayData.phone_number ? `${displayData.country_code || ""} ${displayData.phone_number}` : "N/A" },
    { label: "Address", value: displayData.id_address ? `${provinceName}, ${countryName}` : "N/A" },
    { label: "Specialization", value: displayData.user_type === "teacher" || displayData.user_type === "Faculty" ? specName : "N/A (Not a teacher)" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="md">
      {loading ? (
        <div className="flex justify-center p-8 text-slate-400">Loading details...</div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-800">
                {displayData.name} {displayData.surname} {displayData.second_surname}
              </h3>
              <p className="text-sm text-slate-500 mt-1">{displayData.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-6">
            {dataFields.map((field, idx) => (
              <div key={idx} className={field.label === "Profile ID" ? "col-span-2" : "col-span-1"}>
                <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  {field.label}
                </span>
                <div className="text-sm text-slate-800 wrap-break-word">
                  {field.value}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" onClick={onClose} type="button">Close</Button>
            {onEdit && (
              <Button onClick={() => onEdit(displayData)} type="button">Edit</Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
