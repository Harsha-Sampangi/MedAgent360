import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
});

// ── Module A: Lab Report ──────────────────────────────────────────────────────

export const analyzeLabReport = async (file, language = 'English') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);
    const response = await api.post('/analyze-lab', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// ── Module B: Prescription ────────────────────────────────────────────────────

export const parsePrescription = async (file, language = 'English') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);
    const response = await api.post('/parse-prescription', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// ── Module C: Follow-up ──────────────────────────────────────────────────────

export const enrollPatient = async (phone, name, language = 'English', doctorPhone = '') => {
    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('name', name);
    formData.append('language', language);
    formData.append('doctor_phone', doctorPhone);
    const response = await api.post('/checkin/enroll', formData);
    return response.data;
};

export const sendCheckin = async (phone, name = 'Patient', language = 'English') => {
    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('name', name);
    formData.append('language', language);
    const response = await api.post('/checkin/send', formData);
    return response.data;
};

export const getRecoveryTimeline = async (phone, days = 14) => {
    const response = await api.get(`/checkin/recovery/${encodeURIComponent(phone)}?days=${days}`);
    return response.data;
};

export const getCheckinAlerts = async () => {
    const response = await api.get('/checkin/alerts');
    return response.data;
};

// ── Dashboard / Alerts / Recovery ─────────────────────────────────────────────

export const getDashboardStats = async () => {
    const response = await api.get('/api/dashboard');
    return response.data;
};

export const getAlerts = async () => {
    const response = await api.get('/api/alerts');
    return response.data;
};

export const getRecoveryData = async () => {
    const response = await api.get('/api/recovery');
    return response.data;
};

// ── Health check ──────────────────────────────────────────────────────────────

export const getHealth = async () => {
    const response = await api.get('/health');
    return response.data;
};

export default api;
