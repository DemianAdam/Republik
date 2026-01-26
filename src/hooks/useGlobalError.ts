import { useContext } from "react";
import { GlobalErrorContext } from "../types/GlobalErrorContext";


// Custom Hook for easy usage

export function useGlobalError() {
  const context = useContext(GlobalErrorContext);
  if (context === undefined) {
    throw new Error("useGlobalError must be used within a GlobalErrorProvider");
  }
  return context;
}
