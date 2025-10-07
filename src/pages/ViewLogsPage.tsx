// src/pages/ViewLogsPage.tsx
import React from "react";
import DashboardCard from "../userdashboardcomponents/DashboardCard";
import { Link } from "react-router-dom";
import Header from "../component/Header";

interface Log {
  time: string;
  date: string;
  action: string;
}

const logs: Log[] = [
  { time: "08:30", date: "2025-10-07", action: "Open" },
  { time: "09:15", date: "2025-10-07", action: "Close" },
];

const ViewLogsPage: React.FC = () => {

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
    <div style={pageStyle}>
      <DashboardCard title="View Logs">
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Time</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Door Action</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i}>
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

export default ViewLogsPage;
