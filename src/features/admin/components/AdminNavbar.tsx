import { useAuthActions } from "@convex-dev/auth/react";
import { User as UserIcon, Menu, LogOut, X, Shield, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { ROLE_UI, ROLES_ENUM, User } from "features/admin/types/userTypes";

interface AdminNavbarProps {
  user: User
}
export default function AdminNavbar({ user }: AdminNavbarProps) {
  const { signOut } = useAuthActions();

  // State for the dropdown menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const roleStyle = ROLE_UI[user.role]

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* LEFT: Logo / Brand */}
        <div className="flex items-center gap-2">
          <Link to="/admin" className="flex items-center gap-2 group">
            <img
              src="/logoRepublikTransparente.webp"
              alt="Republik Admin"
              className="h-8 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
            />
            <span className={`hidden sm:block text-xs font-medium tracking-[0.2em] ${roleStyle.style.textColor} uppercase`}>
              {roleStyle.label}
            </span>
          </Link>
        </div>

        {/* RIGHT: User Actions */}
        <div className="flex items-center gap-4">

          {/* Profile Info (Name & Email) */}
          <div className="hidden text-right sm:block">
            {/* 4. Full Name at the top */}
            <p className="text-sm font-medium text-white">
              {user.name}
            </p>
            {/* 5. Email at the bottom */}
            <p className="text-xs text-zinc-500">
              {user.email}
            </p>
          </div>

          <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block" />

          {/* User Menu Container */}
          <div className="relative" ref={menuRef}>

            {/* Trigger Button (Avatar + Hamburger in one interactive element or separate) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`
                flex items-center justify-center gap-3 p-1 pr-3 rounded-full border transition-all
                ${isMenuOpen
                  ? `bg-zinc-800 ${roleStyle.style.borderColor} text-white`
                  : "bg-black/20 border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800"
                }
              `}
            >
              {/* Avatar Circle */}
              <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 border border-white/5 ${roleStyle.style.textColor}`}>
                <UserIcon className="h-4 w-4" />
              </div>

              {/* Hamburger Icon */}
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-white/10 bg-zinc-900 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-200">
                <div className="py-1">

                  {/* Mobile Only: Show Info inside menu if on small screen */}
                  <div className="border-b border-white/5 px-4 py-3 sm:hidden">
                    <p className="text-sm font-medium text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* NEW OPTION: VOLVER AL DASHBOARD */}
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex w-full items-center gap-2 px-4 py-3 text-sm text-zinc-400 hover:bg-white/5 ${ROLE_UI.rrpp.style.hoverText} transition-colors`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>

                  {/* NEW OPTION: Permisos */}
                  {user.role == ROLES_ENUM.ADMIN &&
                    <Link
                      to="/admin/permissions"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex w-full items-center gap-2 px-4 py-3 text-sm text-zinc-400 hover:bg-white/5 hover:text-red-600 transition-colors"
                    >
                      <Shield className="h-4 w-4" />
                      Permisos
                    </Link>
                  }

                  <div className="h-px bg-white/5 my-1" />

                  <button
                    onClick={() => {
                      void signOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-zinc-400 hover:bg-white/5 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header >
  );
}