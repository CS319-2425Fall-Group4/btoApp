import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const tourApplicationService = {
  create: (data) => api.post('/tour-applications', data),
  getByCode: (code) => api.get(`/tour-applications/code/${code}`),
  schedule: () => api.post('/schedules/auto-schedule')
};

export default api;
