import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});


// Add interceptors for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error);
    }
    if (error.response?.status === 401) {
      console.log('Unauthorized, logging out...');
      // Handle logout logic
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);


// School API
export const schoolAPI = {
  getAll: (page = 1, limit = 10) => api.get('/school', { params: { page, limit } }),
  create: (data) => api.post('/school', data),
  updateInfo: (id, data) => api.put(`/school/${id}/info`, data),
  updatePriority: (id, data) => api.put(`/school/${id}/priority`, data),
  getAnalytics: (id) => api.get(`/school/${id}/analytics`),
  manageFeedback: (id, data) => api.post(`/school/${id}/feedback`, data),
};

// Visitor API
export const visitorAPI = {
  create: (data) => api.post('/visitors', data),
  getAll: () => api.get('/visitors'),
  getById: (id) => api.get(`/visitors/${id}`),
};

// Student API
export const studentAPI = {
  create: (data) => api.post('/students', data),
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  update: (id, data) => api.put(`/students/${id}`, data),
};
export const tourApplicationAPI = {
  create: (data) => api.post('/tour-applications', data),
  getByCode: (code) => api.get(`/tour-applications/code/${code}`),
  schedule: () => api.post('/schedules/auto-schedule'),
  update: (code, data) => api.put(`/tour-applications/code/${code}`, data),
  cancel: (code, reason) => api.post(`/tour-applications/code/${code}/cancel`, { reason }),
  list: (filters) => api.get('/tour-applications', { params: filters }),
};


// Schedule API
export const scheduleAPI = {
  autoSchedule: () => api.post('/schedules/auto-schedule'),
  approve: (id, approved) => api.put(`/schedules/${id}/approve`, { approved }),
  reschedule: (id, data) => api.put(`/schedules/${id}/reschedule`, data),
  complete: (id) => api.put(`/schedules/${id}/complete`),
};

// Calendar API
export const calendarAPI = {
  getSchedules: (filters) => api.get('/calendar', { params: filters }),
};


export default api;
