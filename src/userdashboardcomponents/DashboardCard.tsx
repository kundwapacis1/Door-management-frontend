// src/components/DashboardCard.tsx
import React from "react";

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children }) => {
  const cardStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    padding: "20px",
    width: "100%",
    maxWidth: "800px",
    margin: "auto",
  };

  const titleStyle: React.CSSProperties = {
    marginBottom: "15px",
    fontSize: "20px",
    fontWeight: "bold",
  };

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>{title}</h2>
      {children}
    </div>
  );
};

export default DashboardCard;
