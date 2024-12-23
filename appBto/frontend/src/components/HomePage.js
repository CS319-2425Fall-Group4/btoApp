import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "70px" }}>
      <div style={blockStyle}>
        <h1 style ={{marginLeft: "70px", marginRight: "70px"}}>BİLKENT'E HOŞ</h1>
        <h1>GELDİNİZ!</h1>
        <div style={buttonContainerStyle}>
          <button onClick={() => navigate("/corporate")} style={buttonStyle}>
            Kurumsal
          </button>
          <button onClick={() => navigate("/individual")} style={buttonStyle}>
            Bireysel
          </button>
          <button onClick={() => navigate("/employee")} style={buttonStyle}>
            Çalışan
          </button>
        </div>
      </div>
    </div>
  );
};

const buttonStyle = {
  margin: "20px 0", // Adjusted margin to create vertical spacing
  padding: "15px 50px",
  backgroundColor: "black",
  color: "white",
  border: "none",
  borderRadius: "15px",
  cursor: "pointer",
  fontSize: "16px",
};

const blockStyle = {
  border: "none",
  borderRadius: "10px",
  boxShadow: "0 4px 6px rgba(0, 0.1, 0.1, 0.1)",
  padding: "20px",
  textAlign: "center",
};

const buttonContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

export default HomePage;
