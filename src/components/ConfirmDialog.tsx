import { AlertTriangle, Loader2 } from "lucide-react";
import { VARIANT, Variant, VARIANT_STYLES } from "../types/Variants";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  buttonText: string;
  loadingButtonText: string;
  isLoading?: boolean; // Optional prop to show spinner
  variant?: Variant; // In case you want different colors later
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading = false,
  variant = VARIANT.OK,
  buttonText,
  loadingButtonText
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variantStyle = VARIANT_STYLES[variant];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={isLoading ? undefined : onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md scale-100 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl transition-all">
        <div className="p-6">
          <div className="flex gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${variant === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">
                {title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-white/5 bg-zinc-900/50 px-6 py-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white disabled:opacity-50 transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`
              flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${variantStyle.button}`}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? loadingButtonText : buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}