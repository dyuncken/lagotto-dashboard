import React from "react";

export function Input({ type = "text", value, onChange, placeholder }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        padding: "10px",
        fontSize: "1rem",
        width: "100%",
        marginBottom: "16px",
        borderRadius: "8px",
        border: "1px solid #ccc"
      }}
    />
  );
}
