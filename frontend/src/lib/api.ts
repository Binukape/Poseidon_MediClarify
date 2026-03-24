const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

export const api = {
  // --- 1. PATIENT PROFILE ---
  registerPatient: async (patientId: string, name: string, email: string) => {
    return fetch(`${BACKEND_URL}/api/patients/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId, name, email }),
    });
  },

  getVitals: async (patientId: string) => {
    const res = await fetch(`${BACKEND_URL}/api/patients/${patientId}`);
    return res.json();
  },

  updateVitals: async (patientId: string, vitals: { weightKg?: string; heightCm?: string; bloodType?: string; knownAllergies?: string }) => {
    return fetch(`${BACKEND_URL}/api/patients/${patientId}/vitals`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vitals),
    });
  },

  // --- 2. CONSULTATIONS (Audio/AI) ---
  uploadAudio: async (audioBlob: Blob, patientId: string) => {
    const formData = new FormData();
    formData.append("audioFile", audioBlob, "consultation.webm");
    formData.append("patientId", patientId);
    const res = await fetch(`${BACKEND_URL}/api/doctor-records/upload`, {
      method: "POST",
      body: formData,
    });
    return res.text();
  },

  getConsultationHistory: async (patientId: string) => {
    const res = await fetch(`${BACKEND_URL}/api/doctor-records/patient/${patientId}`);
    return res.json();
  },

  // --- 3. MEDICAL VAULT (Documents) ---
  uploadMedicalDoc: async (file: File, patientId: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("patientId", patientId);
    const res = await fetch(`${BACKEND_URL}/api/medical-records/upload`, {
      method: "POST",
      body: formData,
    });
    return res.text();
  },

  getMedicalRecords: async (patientId: string) => {
    const res = await fetch(`${BACKEND_URL}/api/medical-records/patient/${patientId}`);
    return res.json();
  },

  // --- 4. REPORT GENERATOR ---
  generateReport: async (patientId: string) => {
    const res = await fetch(`${BACKEND_URL}/api/reports-generator/generate/${patientId}`);
    return res.text();
  },
};