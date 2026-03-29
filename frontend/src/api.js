const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function fetchJson(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'API request failed');
  }

  return response.json();
}

// Programs
export const getPrograms = () => fetchJson('/api/program');
export const createProgram = (program) =>
  fetchJson('/api/program', { method: 'POST', body: JSON.stringify(program) });

// Applicants
export const getApplicants = () => fetchJson('/api/applicant');
export const createApplicant = (applicant) =>
  fetchJson('/api/applicant', { method: 'POST', body: JSON.stringify(applicant) });

// Seat Matrix
export const getSeatMatrices = () => fetchJson('/api/seatmatrix');
export const createSeatMatrix = (matrix) =>
  fetchJson('/api/seatmatrix', { method: 'POST', body: JSON.stringify(matrix) });

// Admissions
export const getAdmissions = () => fetchJson('/api/admission');
export const allocateAdmission = (request) =>
  fetchJson('/api/admission/allocate', { method: 'POST', body: JSON.stringify(request) });
export const markFeePaid = (id) =>
  fetchJson(`/api/admission/mark-fee-paid/${id}`, { method: 'POST' });
export const confirmAdmission = (id) =>
  fetchJson(`/api/admission/confirm/${id}`, { method: 'POST' });

// Dashboard
export const getDashboard = () => fetchJson('/api/admission/dashboard');
