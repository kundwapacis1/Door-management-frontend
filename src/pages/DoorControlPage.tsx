// src/pages/DoorControlPage.tsx
import React, { useState } from "react";
import DashboardCard from "../userdashboardcomponents/DashboardCard";
import { BigButton } from "../component/ButtonComp";
import Header from "../component/Header";
import  { Link } from "react-router-dom";

interface DoorLog {
  time: string;
  date: string;
  action: string;
}

const DoorControlPage: React.FC = () => {
  const [logs, setLogs] = useState<DoorLog[]>([]);

  const handleDoorAction = (action: string) => {
    const now = new Date();
    setLogs((prev) => [
      ...prev,
      { time: now.toLocaleTimeString(), date: now.toLocaleDateString(), action },
    ]);
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thTdStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    padding: "8px",
  };

  const thStyle: React.CSSProperties = {
    ...thTdStyle,
    backgroundColor: "#f0f0f0",
    textAlign: "left",
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  };

   const sidebarStyle: React.CSSProperties = {
      width: "250px",
      background: "#2c3e50",
      color: "#fff",
      height: "100vh",
      padding: "20px",
      position: "fixed",
      top: 0,
      left: 0,
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    };
  
    const sidebarLinkStyle: React.CSSProperties = {
      color: "#fff",
      textDecoration: "none",
      fontWeight: "bold",
      padding: "10px",
      borderRadius: "5px",
      transition: "background 0.2s",
    };
  
   

  const pageStyle: React.CSSProperties = {
    padding: "20px",
    backgroundColor: "#f4f4f4",
    minHeight: "100vh",
  };

  return (
    <div> {/* Header */}
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
    <div style={pageStyle}>
      <DashboardCard title="Door Control">
        <div style={buttonContainerStyle}>
          <BigButton onClick={() => handleDoorAction("Open")}>Open</BigButton>
          <BigButton onClick={() => handleDoorAction("Close")}>Close</BigButton>
        </div>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Time</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td style={thTdStyle}>{log.time}</td>
                <td style={thTdStyle}>{log.date}</td>
                <td style={thTdStyle}>{log.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DashboardCard>
    </div>
    </div>
  );
};

export default DoorControlPage;
