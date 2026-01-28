import { CreateUser, emptyCreateUser, ROLE_UI, ROLES, ROLES_ENUM, User as UserType, UserRole } from "features/admin/types/userTypes";
import { X, User, Mail, Lock, Shield, Eye, EyeOff, ChevronDown, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";


//TODO: handle variants
interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUser) => void;
  user?: UserType;
  isUpdating: boolean;
  isLoading?: boolean;
}

export default function UserFormModal({
  isOpen,
  onClose,
  onSubmit,
  user,
  isUpdating,
  isLoading = false
}: UserFormModalProps) {
  const [createUser, setCreateUser] = useState<CreateUser>(emptyCreateUser);
  const [showPassword, setShowPassword] = useState(false);

  const roleStyle = ROLE_UI[createUser.role]
  // Load initial data if updating
  useEffect(() => {

    setCreateUser(user ? {
      email: user.email,
      role: user.role,
      name: user.name,
      password: "",
      userName: ""
    } : emptyCreateUser);

  }, [user, isOpen]); // isOpen helps reset when reopening

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(createUser);
    onClose();
  };

  // Helper to get color style based on selected role

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">
            {isUpdating ? "Editar Usuario" : "Nuevo Usuario"}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Nombre y Apellido</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                required
                name="name"
                value={createUser.name}
                onChange={(e) => setCreateUser({ ...createUser, name: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-4 text-white placeholder-zinc-600 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 transition-all"
                placeholder="Ej. Sofia Martinez"
              />
            </div>
          </div>

          {
            createUser.role === ROLES_ENUM.RRPP && <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Link QR</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  required
                  name="userName"
                  value={createUser.userName}
                  onChange={(e) => setCreateUser({ ...createUser, userName: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-4 text-white placeholder-zinc-600 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 transition-all"
                  placeholder="Ej. MatiQR"
                />
              </div>
            </div>
          }
          {/* Role Selection (Colored Dropdown) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Permisos</label>
            <div className="relative">
              <Shield className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 z-10 ${createUser.role === ROLES_ENUM.ADMIN ? "text-red-600" : "text-zinc-500"}`} />


              <select
                value={createUser.role}
                onChange={(e) => setCreateUser({ ...createUser, role: e.target.value as UserRole })}
                className={`w-full appearance-none rounded-xl border py-3 pl-10 pr-10 font-medium focus:outline-none transition-all cursor-pointer ${roleStyle.style.selectColor}`}
              >
                {
                  ROLES.map(role => {
                    const value = ROLE_UI[role]
                    return <option key={role} value={role} className={`bg-zinc-900 ${value.style.textColor}`}>{value.label}</option>
                  })
                }
              </select>



              {/* Custom Chevron to match theme */}
              <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                required
                type="email"
                value={createUser.email}
                onChange={(e) => setCreateUser({ ...createUser, email: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-4 text-white placeholder-zinc-600 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 transition-all"
                placeholder="sofia@Republik.com"
              />
            </div>
          </div>



          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-zinc-400">Contraseña</label>
              {isUpdating && <span className="text-xs text-zinc-500">(Dejar vacío para mantener)</span>}
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                required={!isUpdating} // Only required when creating
                type={showPassword ? "text" : "password"}
                value={createUser.password}
                onChange={(e) => setCreateUser({ ...createUser, password: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-10 text-white placeholder-zinc-600 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 transition-all"
                placeholder={isUpdating ? "••••••••" : "Asignar contraseña temporal"}
              />

              {/* Show/Hide Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 rounded-xl bg-red-600 py-3.5 font-semibold text-white shadow-lg shadow-red-900/20 transition-all hover:bg-red-600 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isUpdating ? "Guardar Cambios" : "Crear Usuario"}
          </button>

        </form>
      </div>
    </div>
  );
}