import { useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, Crown, Share2, Download, Hash } from "lucide-react";
import { toBlob } from "html-to-image";
import { useValidateQr } from "features/public/hooks/persons/useValidateQr";

export default function TicketPage() {
  const { uuid } = useParams();

  const guestQuery = useValidateQr(uuid);
  const ticketRef = useRef<HTMLDivElement>(null);

  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!uuid) {
    return <Navigate to="/404" replace />;
  }

  if (guestQuery.isPending) return <LoadingState />;
  //TODO: manage error
  if (guestQuery.isError) return <div>Error</div>;

  const guest = guestQuery.data;
  const isUsed = guest.isInside;
  const isVip = guest.isVip;

  // --- ACTIONS ---
  const generateTicketImage = async () => {
    if (!ticketRef.current) return null;
    return await toBlob(ticketRef.current, { cacheBust: true, quality: 0.95 });
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const blob = await generateTicketImage();
      if (!blob) return;
      const link = document.createElement('a');
      link.download = `Ticket-${guest.fullname.replace(/\s+/g, '-')}.png`;
      link.href = URL.createObjectURL(blob);
      link.click();
    } catch (err) {
      console.error("Download failed", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);
      const blob = await generateTicketImage();
      if (blob && navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], "ticket.png", { type: blob.type })] })) {
        const file = new File([blob], "ticket.png", { type: blob.type });
        await navigator.share({ title: 'Mi Entrada - Republik', text: 'Aquí está mi entrada para Republik Night Club.', files: [file] });
      } else if (navigator.share) {
        await navigator.share({ title: 'Mi Entrada - Republik', url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Enlace copiado al portapapeles");
      }
    } catch (err) {
      console.warn("Share failed or canceled", err);
    } finally {
      setIsSharing(false);
    }
  };

  // --- THEME ---
  const getTheme = () => {
    if (isUsed) return {
      container: "bg-zinc-900 border-zinc-800",
      glowBg: "hidden",
      badge: "bg-zinc-800 text-zinc-500 border-zinc-700",
      statusText: "TICKET UTILIZADO",
      icon: null,
      qrColor: "#52525b"
    };

    if (isVip) return {
      container: "bg-black border-amber-500/50",
      glowBg: "bg-amber-500/30",
      badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      statusText: "VIP ACCESS",
      icon: <Crown className="h-4 w-4 animate-bounce-slow" />,
      qrColor: "#fbbf24"
    };

    return {
      container: "bg-black border-red-600/50",
      glowBg: "bg-red-600/30",
      badge: "bg-red-600/10 text-red-400 border-red-600/20",
      statusText: "ACCESO VÁLIDO",
      icon: <CheckCircle2 className="h-4 w-4 animate-pulse" />,
      qrColor: "#10b981"
    };
  };

  const theme = getTheme();

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">

      <style>{`
        @keyframes stamp {
          0% { opacity: 0; transform: scale(3) rotate(-15deg); }
          50% { opacity: 1; transform: scale(1) rotate(-20deg); }
          70% { transform: scale(1.05) rotate(-20deg); }
          100% { transform: scale(1) rotate(-20deg); }
        }
        .animate-stamp-in {
          animation: stamp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.1, 0, 0.3, 0.4) infinite;
        }
      `}</style>

      {/* --- BACKGROUND LAYERS --- */}
      {/* 1. Leaves Image (Permanent, handles Grayscale logic) */}
      <img
        src="/istockphoto-1466057420-2048x2048.png"
        alt=""
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out z-0
            ${isUsed ? 'grayscale opacity-10' : 'opacity-40'}
        `}
      />
      
      {/* 2. Gradient Overlay (Darkens the image for text readability) */}
      <div className={`absolute inset-0 bg-gradient-to-b z-0 transition-colors duration-1000
          ${isUsed 
            ? 'from-zinc-950 via-zinc-900 to-black' 
            : 'from-red-950/60 via-black/60 to-black/90'
          }
      `} />


      {/* --- REF TARGET --- */}
      <div ref={ticketRef} className="relative z-10 w-full max-w-[340px] perspective-1000 p-8">

        {/* 1. Breathing Glow Layer */}
        <div className={`
            absolute -top-2 -left-2 -right-2 -bottom-2 rounded-[3rem] blur-3xl 
            transition-all duration-1000
            ${theme.glowBg} 
            ${!isUsed && 'animate-pulse-slow'} 
        `} />

        {/* 2. Main Card Container */}
        <div className={`
            relative w-full rounded-[2.5rem] border-2 overflow-hidden 
            flex flex-col items-center text-center
            transition-all duration-700 ease-out shadow-2xl
            ${theme.container}
        `}>

          {/* 3. Content Wrapper */}
          <div className={`w-full transition-all duration-700 ${isUsed ? 'grayscale opacity-40 blur-[0.5px]' : ''}`}>

            {/* Header */}
            <div className="w-full py-6 flex flex-col items-center gap-2 border-b border-dashed border-white/10">
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black tracking-[0.2em] uppercase backdrop-blur-md ${theme.badge}`}>
                {theme.icon}
                {theme.statusText}
              </div>
            </div>

            {/* Body */}
            <div className="w-full p-8 flex flex-col items-center space-y-8 bg-gradient-to-b from-transparent to-black/40">
              <div className="space-y-1 relative">
                <h1 className="text-2xl font-black uppercase tracking-tight text-white leading-none">
                  {guest.fullname}
                </h1>
                <div className="flex items-center justify-center gap-2 text-zinc-500 font-mono text-xs font-medium tracking-wide">
                  <Hash className="h-3 w-3" />
                  <span>DNI {guest.dni}</span>
                </div>
              </div>

              <div className="relative p-4 bg-white rounded-3xl shadow-xl">
                <QRCodeSVG
                  value={guest.qrCode}
                  size={180}
                  level="Q"
                  fgColor="#000"
                  className="w-full h-full"
                />
              </div>

              {/* TICKET ID - Shortened Format */}
              <div className="space-y-1">
                <p className="text-[9px] text-zinc-600 font-mono uppercase tracking-[0.1em]">ID de Ticket</p>
                <p className="text-[12px] text-zinc-400 font-mono font-bold uppercase tracking-widest">
                  #{guest.qrCode.slice(0, 8)}
                </p>
              </div>
            </div>

            {/* Footer Decorators */}
            <div className="absolute top-[85px] -left-3 w-6 h-6 bg-zinc-950 rounded-full" />
            <div className="absolute top-[85px] -right-3 w-6 h-6 bg-zinc-950 rounded-full" />
          </div>

          {/* 4. Stamp Overlay */}
          {isUsed && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none animate-stamp-in">
              <div className="w-full flex items-center justify-center overflow-visible">
                <div className="
                            border-[6px] border-red-600/90 rounded-xl 
                            px-5 py-2                            
                            text-red-600/90 font-black text-3xl          
                            uppercase tracking-widest text-center 
                            whitespace-nowrap                            
                            mix-blend-hard-light shadow-xl backdrop-blur-[1px]
                        ">
                  INGRESADO
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* --- UNIFIED ACTION BUTTONS --- */}
      <div className="mt-8 flex items-center justify-center gap-6 z-20">
        
        {/* DOWNLOAD BUTTON */}
        <button 
            onClick={handleDownload} 
            disabled={isDownloading} 
            className="group relative p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:scale-110 hover:border-white/30 hover:shadow-lg active:scale-95"
            title="Descargar Ticket"
        >
            {isDownloading ? (
                <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <Download className="h-6 w-6 text-zinc-300 group-hover:text-white transition-colors" />
            )}
        </button>

        {/* SHARE BUTTON */}
        <button 
            onClick={handleShare} 
            disabled={isSharing} 
            className="group relative p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:scale-110 hover:border-white/30 hover:shadow-lg active:scale-95"
            title="Compartir"
        >
            {isSharing ? (
                <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <Share2 className="h-6 w-6 text-zinc-300 group-hover:text-white transition-colors" />
            )}
        </button>

      </div>

    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}