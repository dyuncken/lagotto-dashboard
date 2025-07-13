import React from "react";

export function Card({ children }) {
  return (
    <div style={{ border: "1px solid #ccc", borderRadius: "12px", margin: "12px 0", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }) {
  return (
    <div style={{ padding: "16px", fontWeight: "500", fontSize: "1rem" }}>
      {children}
    </div>
  );
}
