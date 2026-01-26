import { useState, ReactNode, useCallback } from "react";
import { ConvexError } from "convex/values";
import { getErrorFromCode } from "./errorMap";
import { GlobalErrorContext } from "./GlobalErrorContext";


// Definition of what the Error State looks like
interface ErrorState {
  isOpen: boolean;
  title: string;
  description: string;
  code: string; // We always want to show the code for support
}

// Definition of what the Context provides to consumers
export interface GlobalErrorContextType {
  handleError: (error: unknown) => void;
  closeError: () => void;
  errorState: ErrorState;
}

export function GlobalErrorProvider({ children }: { children: ReactNode }) {
  const [errorState, setErrorState] = useState<ErrorState>({
    isOpen: false,
    title: "",
    description: "",
    code: "",
  });

  const closeError = useCallback(() => {
    setErrorState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  /**
   * The Central Logic.
   * Receives an error, interprets it, and opens the modal.
   */
  const handleError = useCallback((error: unknown) => {
    let errorCodeString = "";
    // 1. Identify the Error Type
    if (error instanceof ConvexError) {
      // It's a clean error from our backend (e.g., thrown new ConvexError("CODE"))
      // The 'data' property holds our string code.
      errorCodeString = error.data as string; 
    } else if (error instanceof Error) {
      // It's a generic JavaScript error (e.g., "Cannot read property of undefined")
      // We log this to console because it's likely a bug, not a business rule.
      console.error("Global Handler Caught Generic Error:", error);
      errorCodeString = "UNKNOWN_ERROR"; 
    } else {
      // It's something completely unexpected
      errorCodeString = "UNKNOWN_ERROR";
    }

    // 2. Translate Code to User Friendly Text
    const { title, description, code } = getErrorFromCode(errorCodeString);
    
    
    // 3. Update State (Trigger Modal)
    setErrorState({
      isOpen: true,
      title,
      description,
      code,
    });
  }, []);

  return (
    <GlobalErrorContext.Provider value={{ handleError, closeError, errorState }}>
      {children}
    </GlobalErrorContext.Provider>
  );
}

