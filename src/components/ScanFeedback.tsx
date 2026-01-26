import { useEffect } from "react";
import { CheckCircle2, XCircle, User } from "lucide-react";

export type FeedbackStatus = "idle" | "success" | "error" | "loading";

interface ScanFeedbackProps {
  status: FeedbackStatus;
  message?: string;
  guestName?: string; // Optional: To show who just entered
  onDismiss: () => void;
}

export default function ScanFeedback({ 
  status, 
  message, 
  guestName, 
  onDismiss 
}: ScanFeedbackProps) {
  
  // Auto-dismiss logic (2 seconds)
  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => {
        onDismiss();
      }, 5000); // 2 seconds auto-dismiss
      return () => clearTimeout(timer);
    }
  }, [status, onDismiss]);

  if (status === "idle") return null;

  return (
    // Z-Index must be higher than QrScanner (which is usually 1000)
    <div 
      className={`fixed inset-0 z-[2000] flex flex-col items-center justify-center px-6 text-center animate-in fade-in duration-200 backdrop-blur-sm
        ${status === "success" ? "bg-red-900/95" : ""}
        ${status === "error" ? "bg-red-700/85" : ""}
        ${status === "loading" ? "bg-black/80" : ""}
      `}
      onClick={onDismiss} // Allow manual dismiss by tapping anywhere
    >
      
      {/* SUCCESS STATE */}
      {status === "success" && (
        <div className="space-y-6 animate-in zoom-in-50 duration-300">
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-white/10 ring-4 ring-white/20">
            <CheckCircle2 className="h-20 w-20 text-white" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white uppercase tracking-wider">
              Acceso Permitido
            </h2>
            {guestName && (
              <div className="flex items-center justify-center gap-2 text-red-100 text-xl font-medium mt-4 bg-black/20 py-2 px-6 rounded-full">
                <User className="h-5 w-5" />
                {guestName}
              </div>
            )}
          </div>
          <p className="text-white/50 text-sm mt-8 animate-pulse">
            Toca para continuar
          </p>
        </div>
      )}

      {/* ERROR STATE */}
      {status === "error" && (
        <div className="space-y-6 animate-in shake duration-300">
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-white/10 ring-4 ring-white/20">
            <XCircle className="h-20 w-20 text-white" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white uppercase tracking-wider">
              Acceso Denegado
            </h2>
            <p className="text-white/90 text-xl font-medium max-w-sm mx-auto leading-relaxed border-l-4 border-white/50 pl-4 text-center bg-black/20 p-4 rounded-r-lg">
              {message || "Error desconocido"}
            </p>
          </div>
          <p className="text-white/50 text-sm mt-8 animate-pulse">
            Toca para cerrar
          </p>
        </div>
      )}

      {/* LOADING STATE */}
      {status === "loading" && (
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/20 border-t-red-500" />
          <p className="text-xl font-bold text-white tracking-widest uppercase">Verificando...</p>
        </div>
      )}
    </div>
  );
}