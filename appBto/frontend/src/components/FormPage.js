import React, { useState, useEffect } from "react";
import { fetchSchools, submitForm } from "../services/api";

const FormPage = () => {
  const [school, setSchools] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    phone_number: "",
    school_id: "",
  });

  useEffect(() => {
    const loadSchools = async () => {
      const data = await fetchSchools();
      setSchools(data);
    };
    loadSchools();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitForm(formData);
    alert("Form submitted!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Campus Visit Form</h2>
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={formData.phone_number}
        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
        required
      />
      <select
        value={formData.school_id}
        onChange={(e) => setFormData({ ...formData, school_id: e.target.value })}
      >
        <option value="">Select a School</option>
        {school.map((school) => (
          <option key={school.id} value={school.id}>
            {school.name}
          </option>
        ))}
      </select>
      <button type="submit">Submit</button>
    </form>
  );
};

export default FormPage;
