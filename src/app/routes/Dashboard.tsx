import DashboardList from "features/admin/dashboard/components/DashboardList";
import DashboardStats from "features/admin/dashboard/components/DashboardStats";
import { useCreatePerson } from "features/admin/hooks/persons/useCreatePerson";
import GuestFormModal from "features/admin/permissions/components/GuestFormModal";
import { CreatePerson } from "features/admin/types/personTypes";
import { useState, useCallback } from "react";
import RoleGuard from "features/admin/components/RoleGuard";
import { PERMISSIONS, ROLES_ENUM } from "features/admin/types/userTypes";
import { RotateCcw, ScanQrCode } from "lucide-react";
import ConfirmDialog from "components/ConfirmDialog";
import { useDeleteAllPersons } from "features/admin/hooks/persons/useDeleteAllPersons";
import PermissionGuard from "features/admin/components/PermissionGuard";
import { AdminLayoutContext } from "../../types/AdminLayoutContext";
import { useOutletContext } from "react-router-dom";
import QrScanner from "components/QrScanner";
// Import the new component
import ScanFeedback, { FeedbackStatus } from "components/ScanFeedback";
import { ConvexError } from "convex/values";
import { ErrorCode } from "convex/helpers/errors";
import { getErrorFromCode } from "../../types/errorMap";
import { useValidatePerson } from "features/admin/hooks/persons/useValidatePerson";
import { BarcodeFormat } from "@zxing/library";

export default function Dashboard() {
  const { user } = useOutletContext<AdminLayoutContext>();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { validatePersonHandler } = useValidatePerson();

  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // --- NEW: Feedback State ---
  const [feedback, setFeedback] = useState<{
    status: FeedbackStatus;
    message?: string;
    guestName?: string;
  }>({ status: "idle" });

  const { createPersonHandler } = useCreatePerson();
  const { deleteAllPersonsListHandler } = useDeleteAllPersons();

  // --- MOCKED API HOOK (Replace with your real useMutation) ---
  // const checkInGuest = useMutation(api.guests.checkIn); 

  const handleOpenCreate = () => setIsFormModalOpen(true);
  const handleOpenReset = () => setIsConfirmModalOpen(true);
  const handleOpenScanner = () => setIsScannerOpen(true);

  // Helper to map DB errors to user friendly text
  const getFriendlyErrorMessage = (error: ConvexError<ErrorCode>) => {
    const userError = getErrorFromCode(error.data);
    return userError.description;
  };

  const handleReset = async () => {
    setIsConfirmLoading(true);
    try {
      await deleteAllPersonsListHandler();
    } finally {
      setIsConfirmLoading(false);
      setIsConfirmModalOpen(false);
    }
  };

  const handleSubmit = async (person: CreatePerson) => {
    setIsLoading(true);
    try {
      await createPersonHandler(person);
    } finally {
      setIsFormModalOpen(false);
      setIsLoading(false);
    }
  };


  const handleScanData = useCallback(async (data: string) => {
    if (feedback.status !== "idle") return;
    try {

      setFeedback({ status: "loading" });

      const guest = await validatePersonHandler(data);

      // 5. SUCCESS
      setFeedback({
        status: "success",
        guestName: `${guest.fullname}`
      });

    } catch (error) {
      if (error instanceof ConvexError) {
        setFeedback({
          status: "error",
          message: getFriendlyErrorMessage(error)
        });
        return;
      }

      setFeedback({
        status: "error",
        message: "Qr invalido"
      })
    }
  }, [feedback.status, validatePersonHandler]);

  const handleDismissFeedback = () => {
    setFeedback({ status: "idle" });
  };

  return (
    <>
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {/* ... Header and Stats Code (Unchanged) ... */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Lista de Invitados</h1>
            <p className="mt-1 text-sm text-zinc-400">Gestiona el acceso para el evento actual.</p>
          </div>
          


          <div className="flex justify-center flex-row gap-3 sm:flex-row sm:items-center">

          <PermissionGuard requiredPermission={PERMISSIONS.SETINSIDE_PERSON} orCondition={user.role === "admin"}>
            <button onClick={handleOpenScanner} className="flex items-center justify-center rounded-lg border border-white/10 p-2.5 text-zinc-400 transition-colors hover:bg-emerald-500/10 hover:text-emerald-500" title="Resetear">
              <ScanQrCode className = "h-5 w-5" />
            </button>
          </PermissionGuard>

          <RoleGuard requiredRole={ROLES_ENUM.RRPP}>
            <div className="flex gap-3 sm:w-auto">
              <button onClick={handleOpenReset} className="flex items-center justify-center rounded-lg border border-white/10 p-2.5 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-500" title="Resetear">
                <RotateCcw className="h-5 w-5" />
              </button>
              <button onClick={handleOpenCreate} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-emerald-900/20 transition-colors hover:bg-emerald-500">
                + Nuevo Invitado
              </button>
            </div>
          </RoleGuard>
          </div>


        </div>

        <DashboardStats />
        <DashboardList />
      </main>

      {/* Modals */}
      <GuestFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmit}
        isUpdating={false}
        isLoading={isLoading}
      />

      <ConfirmDialog
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleReset}
        title="¿Eliminar lista?"
        description="Esta accion eliminara la lista de invitados. ¿Estás seguro?"
        buttonText="Aceptar"
        loadingButtonText="Eliminando..."
        variant="danger"
        isLoading={isConfirmLoading}
      />

      {/* --- SCANNER SECTION --- */}
      {isScannerOpen && (
        <>
          <QrScanner
            onScanSuccess={handleScanData}
            onClose={() => setIsScannerOpen(false)}
            closeOnScanSuccess={false}
            format={BarcodeFormat.QR_CODE}
            square={true}
            instructions="Alinea el codigo QR de la entrada para verificarla."
          />

          {/* THE FEEDBACK OVERLAY */}
          {/* This sits ON TOP of the QrScanner */}
          <ScanFeedback
            status={feedback.status}
            message={feedback.message}
            guestName={feedback.guestName}
            onDismiss={handleDismissFeedback}
          />
        </>
      )}
    </>
  );
}