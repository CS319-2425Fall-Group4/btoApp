import axios from "axios";

const API_URL = "http://localhost:5001/api";

export const fetchSchools = async () => {
  const response = await axios.get(`${API_URL}/school`);
  return response.data;
};

export const submitForm = async (formData) => {
  const response = await axios.post(`${API_URL}/visitor`, formData);
  return response.data;
};
