import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px" }}>
      <h1>BİLKENT'E HOŞ GELDİNİZ!</h1>
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
  );
};

const buttonStyle = {
  margin: "10px",
  padding: "10px 20px",
  backgroundColor: "black",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
};

export default HomePage;
