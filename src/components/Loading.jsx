import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loading() {
  return (
    <div className="flex justify-center my-4">
      <CircularProgress size={60} />
    </div>
  );
}
