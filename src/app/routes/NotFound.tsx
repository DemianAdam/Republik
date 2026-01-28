import { Link, useNavigate } from "react-router-dom";
import { Disc, Music2, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black px-4 text-center">
      
      {/* --- Background Effects --- */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-red-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-zinc-800/20 blur-[80px]" />
      <div className="pointer-events-none absolute left-0 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-red-900/20 blur-[60px]" />

      <div className="relative z-10 max-w-md">
        
        {/* --- Icon Graphic --- */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Main Icon Container - Glass Effect */}
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl ring-1 ring-white/5">
              {/* Pulse Animation: Breaths in and out */}
              <Disc className="h-12 w-12 text-zinc-300 animate-pulse opacity-90" />
            </div>
            
            {/* Secondary Floating Icon - Bounce Animation */}
            <div className="absolute -bottom-4 -right-4 flex h-12 w-12 animate-bounce items-center justify-center rounded-2xl border border-white/10 bg-zinc-900 shadow-xl">
              <Music2 className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </div>

        {/* --- Text Content --- */}
        <h1 className="mb-2 text-6xl font-black text-white tracking-tight">404</h1>
        <h2 className="mb-4 text-2xl font-bold text-white">La música se detuvo.</h2>
        
        <p className="mb-8 text-zinc-400 leading-relaxed">
          Parece que has tomado un giro equivocado en el club. 
          Aquí no hay nada que ver, solo silencio y luces apagadas.
        </p>

        {/* --- Actions --- */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="group flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-red-900/20 transition-all hover:bg-red-500 hover:shadow-red-900/40 hover:-translate-y-0.5"
          >
            <Home className="h-4 w-4" />
            Ir al Inicio
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="group flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-zinc-300 transition-all hover:bg-white/10 hover:text-white hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Volver
          </button>
        </div>
      </div>
      
      {/* Footer / Copyright subtle text */}
      <div className="absolute bottom-6 text-xs text-zinc-600 font-medium tracking-wider uppercase">
        Republik Club
      </div>
    </main>
  );
}