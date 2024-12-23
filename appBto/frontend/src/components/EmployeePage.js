import React from "react";
import Calendar from './Calendar';

const EmployeePage = () => {
  const userRole = 'GUIDE'; // Replace with dynamic role from user context or state

  return (
    <div>
      <h1>Ana sayfa</h1>
      <Calendar role="GUIDE"/>
    </div>
  );
};

export default EmployeePage;
