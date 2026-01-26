import { X, AlertTriangle, Copy } from "lucide-react";
import { useState } from "react";
import { useGlobalError } from "hooks/useGlobalError";

export default function GlobalErrorModal() {
  const { errorState, closeError } = useGlobalError();
  const [copied, setCopied] = useState(false);

  // If not open, render nothing
  if (!errorState.isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(errorState.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="relative flex flex-col items-center gap-4 bg-zinc-900/50 p-6 pt-8 text-center">
          <button
            onClick={closeError}
            className="absolute right-4 top-4 rounded-full p-2 text-zinc-500 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="rounded-full bg-red-500/10 p-3 ring-1 ring-red-500/20">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">
              {errorState.title}
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {errorState.description}
            </p>
          </div>
        </div>

        {/* Footer: Error Code & Action */}
        <div className="border-t border-white/5 bg-zinc-950/50 p-6">

          {/* Technical Code Box */}
          <div className="mb-6 rounded-lg border border-white/5 bg-black/20 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-600 font-bold">
                Código de Error
              </span>
              {copied && <span className="text-[10px] text-emerald-500">Copiado</span>}
            </div>
            <div className="flex items-center justify-between gap-2">
              <code className="font-mono text-xs text-red-400 break-all">
                {errorState.code}
              </code>
              <button
                onClick={handleCopyCode}
                className="text-zinc-500 hover:text-white transition-colors"
                title="Copiar código"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <button
            onClick={closeError}
            className="w-full rounded-xl bg-white text-black py-3 text-sm font-semibold hover:bg-zinc-200 transition-colors active:scale-95"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}