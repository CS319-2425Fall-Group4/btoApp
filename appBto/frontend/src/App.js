import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import CorporatePage from "./components/CorporatePage";
import IndividualPage from "./components/IndividualPage";
import EmployeePage from "./components/EmployeePage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/corporate" element={<CorporatePage />} />
        <Route path="/individual" element={<IndividualPage />} />
        <Route path="/employee" element={<EmployeePage />} />
      </Routes>
    </Router>
  );
};

export default App;
