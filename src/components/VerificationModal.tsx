
import { CreateQrPerson } from "features/admin/types/personTypes";
import { Check, X, User } from "lucide-react";

interface VerificationModalProps {
  isOpen: boolean;
  data: CreateQrPerson; 
  onConfirm: () => void;
  onCancel: () => void;
}

export default function VerificationModal({ isOpen, data, onConfirm, onCancel }: VerificationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="bg-red-600/10 border-b border-red-600/20 p-4 flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-red-600/20 flex items-center justify-center text-red-600 mb-2">
            <User className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white">¿Eres tú?</h3>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-1 text-center">
            <p className="text-zinc-500 text-sm uppercase tracking-wider font-medium">Invitado Detectado</p>
            <p className="text-2xl font-bold text-white" translate="no">{data.fullname}</p>
            {/* Show extra data if available, e.g., DNI */}
            <p className="text-zinc-400 text-sm">DNI: {data.dni}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-px bg-white/5 border-t border-white/10">
          <button
            onClick={onCancel}
            className="p-4 text-zinc-400 hover:bg-white/5 hover:text-white transition-colors font-medium text-sm flex items-center justify-center gap-2"
          >
            <X className="h-4 w-4" />
            Reintentar
          </button>
          <button
            onClick={onConfirm}
            className="p-4 text-red-400 hover:bg-red-600/10 transition-colors font-bold text-sm flex items-center justify-center gap-2"
          >
            <Check className="h-4 w-4" />
            Sí, soy yo
          </button>
        </div>
      </div>
    </div >
  );
}