import { X, User, Star, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { CreatePerson, emptyCreatePerson, Person } from "../../types/personTypes";
//TODO: handle variants
interface GuestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePerson) => void;
  person?: Person;
  isUpdating: boolean;
  isLoading?: boolean;
}

export default function GuestFormModal({
  isOpen,
  onClose,
  onSubmit,
  person,
  isUpdating,
  isLoading = false
}: GuestFormModalProps) {
  const [createPerson, setCreatePerson] = useState<CreatePerson>(emptyCreatePerson);
  useEffect(() => {

    setCreatePerson(person ? {
      fullname: person.fullname,
      isVip: person.isVip,
      dni: person.dni
    } : emptyCreatePerson);

  }, [person, isOpen]); // isOpen helps reset when reopening

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(createPerson);
    onClose();
  };

  return (
    // CHANGE: Increased z-index to 1000 to ensure it sits above everything
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl animate-in fade-in zoom-in duration-200">

        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">
            {isUpdating ? "Editar Invitado" : "Nuevo Invitado"}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                required
                value={createPerson.fullname}
                onChange={(e) => setCreatePerson({ ...createPerson, fullname: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-4 text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Ej. Sofia Martinez"
              />
            </div>
          </div>

          {/* <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">DNI / Identificación</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input 
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-4 text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Ej. 38.123.456"
              />
            </div>
          </div> */}

          <div
            onClick={() => setCreatePerson({ ...createPerson, isVip: !createPerson.isVip })}
            className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${createPerson.isVip ? 'border-amber-500/50 bg-amber-500/10' : 'border-white/10 bg-black/20 hover:border-white/20'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-full p-2 ${createPerson.isVip ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                <Star className="h-4 w-4 fill-current" />
              </div>
              <div className="flex flex-col">
                <span className={`font-medium ${createPerson.isVip ? 'text-amber-500' : 'text-zinc-300'}`}>Acceso VIP</span>
                <span className="text-xs text-zinc-500">Marcar como invitado especial</span>
              </div>
            </div>
            <div className={`h-6 w-10 rounded-full p-1 transition-colors ${createPerson.isVip ? 'bg-amber-500' : 'bg-zinc-700'}`}>
              <div className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${createPerson.isVip ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 py-3.5 font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-500 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isUpdating ? "Guardar Cambios" : "Agregar Invitado"}
          </button>
        </form>
      </div>
    </div>
  );
}