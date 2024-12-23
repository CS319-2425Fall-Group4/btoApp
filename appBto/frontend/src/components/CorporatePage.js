import React from "react";
import { useNavigate } from "react-router-dom";

const CorporatePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "70px" }}>
      <div style={blockStyle}>
        <h1 style ={{marginLeft: "40px", marginRight: "40px", fontSize: "24px"}}>Kurumsal Girişler</h1>
        <div style={buttonContainerStyle}>
          <input placeholder="E-posta" style ={{border: "none", width: "80%", borderRadius: "8px", padding: "5px 10px 10px", marginTop: "10px"}}></input>
          <input placeholder="Şifre" style ={{border: "none", width: "80%", borderRadius: "8px", padding: "5px 10px 10px", marginTop: "10px"}}></input>
          <button onClick={() => navigate("/individual")} style={buttonStyle}>
            Oturum Aç
          </button>
        </div>
        <h1 style = {{fontSize: "12px", textDecorationLine: "underline"}}>Hesabınız yoksa buradan kaydolun!</h1>
      </div>
    </div>
  );
};

const buttonStyle = {
  margin: "20px 0",
  padding: "15px 30px",
  backgroundColor: "black",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "12px",
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

export default CorporatePage;
