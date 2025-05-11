import React from "react";
import { FortuneResult } from "../types";

interface Props {
  onDraw: () => void;
  fortune: FortuneResult | null;
  userEmail: string | null;
}

export const ShrineFortune: React.FC<Props> = ({ onDraw, fortune , userEmail}) => {
  const displayName = userEmail
    ? userEmail.split("@")[0].replace(/^./, (c) => c.toUpperCase())
    : "";

  return (
    <div className="container text-center my-5">
      <img
        src="/shrine.png"
        alt="Shrine"
        style={{ maxWidth: "300px", marginBottom: "20px" }}
      />
      <h2 className="mb-4">
        {displayName
          ? `${displayName}, ready to see your fortune?`
          : "Ready to see your fortune?"}
      </h2>
      <button className="btn btn-danger btn-lg" onClick={onDraw}>
        Draw a Fortune
      </button>

      {fortune && (
        <div className="alert alert-success mt-4">
          <strong>{fortune.result}</strong> — {fortune.message}
          <br />
        </div>
      )}
    </div>
  );
};
