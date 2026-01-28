import { useState } from "react";
import { IdCard, ChevronLeft, ScanLine } from "lucide-react";
import QrScanner from "../../components/QrScanner";
import { getGuestDataFromQr } from "../../helpers";
import VerificationModal from "components/VerificationModal";
import { useCreateQrPerson } from "features/public/hooks/persons/useCreateQrPerson";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { CreateQrPerson } from "features/admin/types/personTypes";
import { ConvexError } from "convex/values";
import { ERROR_CODES } from "convex/helpers/errors";
import { useGetQrByDni } from "features/public/hooks/persons/useGetQrByDni";
import { BarcodeFormat } from "@zxing/library";
import { useGetUserByUserName } from "features/public/hooks/users/useGetUserByUserName";
import { LoadingState } from "components/LoadingState";
import { asset } from "../../utils/assets";

export default function SelfCheckIn() {
  const { userName } = useParams();

  const userQuery = useGetUserByUserName(userName);

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [person, setPerson] = useState<CreateQrPerson | null>(null);
  //const [vipCode, setVipCode] = useState<string | undefined>(undefined);
  const [dniQrData, setDniQrData] = useState<string | undefined>(undefined);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const navigate = useNavigate();


  const { createQrPersonHandler } = useCreateQrPerson();
  const { getQrByDni } = useGetQrByDni();

  if (userQuery.isPending) {
    return <LoadingState />
  }

  if (userName && userQuery.isError) {
    return <Navigate to="/NotFound" />;
  }

  const user = userQuery.data;

  console.log(user)

  const handleScanData = (data: string) => {
    const person = getGuestDataFromQr(data);
    setDniQrData(data)
    setPerson(person);
    setIsVerificationModalOpen(true);
    setIsScannerOpen(false);
  };

  const handleReset = () => {
    setDniQrData(undefined);
    setPerson(null);
  };

  const handleConfirm = async () => {

    try {
      const result = await createQrPersonHandler({ qrData: dniQrData!, /*vipCode: vipCode,*/ userId: user?._id })
      navigate(`/ticket/${result.qrCode}`);
    } catch (error) {
      //TODO: handle error?
      if (!(error instanceof ConvexError)) {
        handleReset();
        return;
      }
      if (error.data && person && error.data === ERROR_CODES.PERSON_ALREADY_CREATED) {
        const qr = await getQrByDni(person.dni);
        if (qr) {
          navigate(`/ticket/${qr}`);
          return;
        }
      }
      handleReset();
    }
  }

  const handleRetry = () => {
    handleReset();
    setIsScannerOpen(true)
  }


  // --- VIEW 1: HERO / START (Default State) ---
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-zinc-950 px-6 text-center py-12 overflow-hidden">

      {/* 1. Background Image (Layer 0) */}
      <img
        src={asset("istockphoto-1466057420-2048x2048.png")}
        aria-hidden="true"
        role="presentation"
        loading="eager"
        fetchpriority="high"
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-40"
      />

      {/* 2. Gradient Overlay (Layer 0) */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-red-950/80 via-black/60 to-black/90" />

      {/* --- FIX: MOVED BUTTON HERE (Layer 20) --- */}
      {/* Moved outside the centered div so it sticks to the top-left of the screen */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Volver a la página principal</span>
        <span className="sm:hidden">Volver</span>
      </Link>

      {/* 3. CONTENT WRAPPER (Layer 10) */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-md">

        {/* Removed the Link from here */}

        {/* Icon Graphic */}
        <div className="relative mb-8 animate-pulse">
          <div className="absolute inset-0 bg-red-600/20 blur-3xl rounded-full" />
          <div className="relative flex h-32 w-32 items-center justify-center rounded-[2rem] bg-zinc-900 bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 shadow-2xl">
            <ScanLine className="h-16 w-16 text-red-400" />
          </div>
        </div>

        {/* Title - Added drop-shadow to separate from leaves */}
        <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">
          Self Check-In
        </h1>

        {/* Subtitle - Lightened from zinc-400 to zinc-200 for better contrast */}
        <p className="text-lg text-zinc-200 max-w-xs mx-auto mb-12 leading-relaxed drop-shadow-sm">
          Escanea el código de barras de tu DNI para ingresar automáticamente.
        </p>

        {/* Primary Action Area */}
        <div className="w-full max-w-xs space-y-6">

          <p className="text-red-400/90 text-sm font-medium animate-in fade-in slide-in-from-bottom-2 drop-shadow-sm">
            Tener DNI en mano.
          </p>

          <button
            onClick={() => setIsScannerOpen(true)}
            className="relative w-full overflow-hidden rounded-2xl bg-white text-black py-4 font-bold text-lg shadow-[0_0_30px_rgba(255,0,0,0.4)] transition-all hover:scale-[1.02] hover:shadow-[0_0_45px_rgba(255,0,0,0.6)] active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <IdCard className="h-6 w-6 text-red-800" />
              Escanea tu DNI
            </span>
          </button>

          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-red-600/20 text-xs text-zinc-300 font-medium uppercase tracking-widest backdrop-blur-md">
            <div className="h-1.5 w-1.5 rounded-full bg-red-600 shadow-[0_0_10px_#10b981]" />
            SECURE SYSTEM
          </div>
        </div>
      </div>
      {/*<div className="flex flex-col gap-2 mt-3 text-left">
        <label
          htmlFor="vipCode"
          className="text-xs font-semibold tracking-widest text-zinc-400 uppercase"
        >
          ¿Tenes un codigo VIP?
        </label>

        <input
          id="vipCode"
          type="text"
          value={vipCode ?? ""}
          onChange={(e) => setVipCode(e.target.value)}
          placeholder="Ingresar código VIP"
          className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/60 focus:border-red-600 transition"
        />
      </div>*/}

      {/* --- VIEW 2: SCANNER (Conditional) --- */}
      {isScannerOpen && (
        <QrScanner
          onScanSuccess={handleScanData}
          onClose={() => setIsScannerOpen(false)}
          closeOnScanSuccess={false}
          format={BarcodeFormat.PDF_417}
          instructions="Alinea el codigo de barras de tu DNI dentro del marco."
        />
      )}
      {person &&
        <VerificationModal
          isOpen={isVerificationModalOpen}
          data={person}
          onConfirm={handleConfirm}
          onCancel={handleRetry}
        />
      }

    </div>
  );
}