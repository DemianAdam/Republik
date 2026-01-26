import { RefreshCcw, X } from "lucide-react";

interface ScannerOverlayProps {
  onSwitchCamera: () => void;
  onClose: () => void;
  square?: boolean
  instructions: string
}

export default function ScannerOverlay({
  onSwitchCamera,
  onClose,
  square = false,
  instructions
}: ScannerOverlayProps) {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none">

      {/* 1. TOP BAR (Pinned to Top) */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 to-transparent p-6 flex justify-between items-start pointer-events-auto z-50">
        <button
          onClick={onClose}
          className="p-3 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/5 hover:bg-white/20 transition-all active:scale-95 shadow-lg"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mt-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-white tracking-widest uppercase shadow-xl">
          Verificar Identidad
        </div>

        <button
          onClick={onSwitchCamera}
          className="p-3 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/5 hover:bg-white/20 transition-all active:scale-95 shadow-lg"
        >
          <RefreshCcw className="w-5 h-5" />
        </button>
      </div>

      {/* 2. THE SCANNING WINDOW (Dead Center) */}
      {/* We use absolute positioning to ignore the header/footer heights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center z-30">

        {/* The Box */}
        <div className={`relative w-[85%] max-w-sm ${square ? "aspect-square" : "aspect-[3/1]"} rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.85)]`}>
          {/* Corner Markers */}
          <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-red-500 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-red-500 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-red-500 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-red-500 rounded-br-lg" />

          {/* Laser Animation */}
          <div className="absolute inset-x-0 h-0.5 bg-red-500/50 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-[scan_2s_infinite]" />
        </div>

        {/* Instructions (Below the box) */}
        <p className="mt-8 text-white/90 text-sm font-medium text-center px-8 drop-shadow-md">
          {instructions}
        </p>
      </div>

      {/* 3. BOTTOM GRADIENT (Visual only) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/90 to-transparent pointer-events-none z-10" />

      <style>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}