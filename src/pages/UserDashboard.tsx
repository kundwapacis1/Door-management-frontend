import React from "react";
import { Link } from "react-router-dom";
import Header from "../component/Header";

const Dashboard: React.FC = () => {
  const sidebarStyle: React.CSSProperties = {
    width: "250px",
    background: "#154576", // Primary color from contact section
    color: "#fff",
    height: "100vh",
    padding: "20px",
    position: "fixed",
    top: 0,
    left: 0,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    boxShadow: "2px 0 6px rgba(0,0,0,0.1)"
  };

  const sidebarLinkStyle: React.CSSProperties = {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    padding: "10px",
    borderRadius: "5px",
    transition: "background 0.2s",
  };

 
  const mainContentStyle: React.CSSProperties = {
    marginLeft: "270px",
    padding: "20px",
    backgroundColor: "#f9fafb", // Light background like contact section
    minHeight: "100vh",
    color: "#1f2937"
  };

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    padding: "20px",
    width: "300px",
    height: "150px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "18px",
    textDecoration: "none",
    color: "black",
    marginTop: "100px",
    marginLeft: "200px"
  };

  const dashboardStyle: React.CSSProperties = {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  };

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Dashboard</h2>
        <Link to="/" style={sidebarLinkStyle}>
          Home
        </Link>
        <Link to="/door-control" style={sidebarLinkStyle}>
          Door Control
        </Link>
        <Link to="/view-logs" style={sidebarLinkStyle}>
          View Logs
        </Link>
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>
        <div style={dashboardStyle}>
          <Link to="/door-control" style={cardStyle}>
            Door Control
          </Link>
          <Link to="/view-logs" style={cardStyle}>
            View Logs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
