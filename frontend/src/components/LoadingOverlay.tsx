import React from "react";

interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = "Loading...",
}) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        fontSize: "1.5rem",
        fontWeight: "bold",
      }}
    >
      <div className="d-flex align-items-center gap-3">
        <div className="spinner-border text-light" role="status" />
        {message}
      </div>
    </div>
  );
};
