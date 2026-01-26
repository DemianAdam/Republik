import { createContext } from "react";
import { GlobalErrorContextType } from "./GlobalErrorProvider";


export const GlobalErrorContext = createContext<GlobalErrorContextType | undefined>(undefined);
