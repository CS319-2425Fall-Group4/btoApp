import React from "react";
import Calendar from './Calendar';

const EmployeePage = () => {
  const userRole = 'GUIDE'; // Replace with dynamic role from user context or state

  return (
    <div>
      <h1>Employee Dashboard</h1>
      <Calendar role={userRole} />
    </div>
  );
};

export default EmployeePage;
