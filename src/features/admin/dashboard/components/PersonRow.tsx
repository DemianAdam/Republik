import ConfirmDialog from "components/ConfirmDialog";
import { useDeletePerson } from "features/admin/hooks/persons/useDeletePerson";
import { useUpdatePerson } from "features/admin/hooks/persons/useUpdatePerson";
import GuestFormModal from "features/admin/permissions/components/GuestFormModal";
import { CreatePerson, Person, UpdatePerson, UpdatePersonInside } from "features/admin/types/personTypes"
import { Check, Pencil, QrCode, Trash2, Undo2 } from "lucide-react"
import { useState } from "react";
import { VARIANT, Variant } from "../../../../types/Variants";
import { useUpdatePersonInside } from "features/admin/hooks/persons/useUpdatePersonInside";
import { Link, useOutletContext } from "react-router-dom";
import { AdminLayoutContext } from "../../../../types/AdminLayoutContext";
import { PERMISSIONS, ROLES_ENUM } from "features/admin/types/userTypes";
import PermissionGuard from "features/admin/components/PermissionGuard";
import RoleGuard from "features/admin/components/RoleGuard";


interface PersonRowProps {
    person: Person
}

export default function PersonRow({ person }: PersonRowProps) {
    // 1. Get current user
    const { user } = useOutletContext<AdminLayoutContext>();

    const { updatePersonHandler } = useUpdatePerson();
    const { deletePersonHandler } = useDeletePerson();
    const { updatePersonInsideHandler } = useUpdatePersonInside();
    const [isLoading, setIsLoading] = useState(false);
    const [variant, setVariant] = useState<Variant>(VARIANT.OK)


    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // --- PERMISSION LOGIC ---
    const isAdmin = user.role === ROLES_ENUM.ADMIN;
    const isOwner = user._id === person.userId;

    const isInside = person.isInside;

    const toggleStatus = async (updatePersonInside: UpdatePersonInside) => {
        await updatePersonInsideHandler(updatePersonInside);
    };

    const handleOpenDelete = () => {
        setVariant(VARIANT.DANGER);
        setIsDeleteModalOpen(true);
    }

    const handleEdit = async (createPerson: CreatePerson) => {
        setIsLoading(true)
        const updatePerson: UpdatePerson = {
            fullname: createPerson.fullname,
            isVip: createPerson.isVip,
            personId: person._id,
            dni: createPerson.dni
        }
        try {
            await updatePersonHandler(updatePerson);
        }
        finally {
            setIsUpdateModalOpen(false);
            setIsLoading(false)
        }
    };

    const handleConfirmDelete = async () => {
        setIsLoading(true)
        try {
            await deletePersonHandler({ personId: person._id });
        }
        finally {
            setIsDeleteModalOpen(false)
            setIsLoading(false)
        }
    };

    return (
        <div
            className={`
                group relative flex items-center justify-between overflow-hidden rounded-xl border p-4 transition-all
                ${isInside
                    ? 'border-red-500/30 bg-red-500/5'
                    : 'border-white/5 bg-zinc-900/40 hover:border-white/10'
                }
              `}>

            <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${isInside ? 'bg-red-500 shadow-[0_0_10px_#10b981]' : 'bg-transparent'}`} />

            <div className="flex flex-col pl-3">
                <div className="flex items-center gap-2">
                    <h3 className={`font-semibold text-lg ${isInside ? 'text-red-100' : 'text-white'}`}>
                        {person.fullname}
                    </h3>
                    {person.isVip && (
                        <span className="flex items-center justify-center rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-500 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                            VIP
                        </span>
                    )}
                </div>
                <p className="text-sm font-mono text-zinc-500 tracking-wide hidden">
                    {person.userId}
                </p>
            </div>

            <div className="flex items-center gap-2">
                {/* 1. MODIFY ACTIONS (Edit/Delete) */}

                <div className="flex items-center mr-2 transition-opacity duration-200">
                    <RoleGuard
                        requiredRole={ROLES_ENUM.RRPP}
                    >
                        <Link
                            to={`/ticket/${person.qrCode}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            title="Ticket QR"
                        >
                            <QrCode className="h-4 w-4" />
                        </Link>
                    </RoleGuard>
                    <PermissionGuard
                        requiredPermission={PERMISSIONS.UPDATE_PERSON}
                        andCondition={isOwner}
                        orCondition={isAdmin}
                    >
                        <button
                            onClick={() => setIsUpdateModalOpen(true)}
                            className="p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            title="Editar"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                    </PermissionGuard>
                    <PermissionGuard
                        requiredPermission={PERMISSIONS.DELETE_PERSON}
                        andCondition={isOwner}
                        orCondition={isAdmin}
                    >
                        <button
                            onClick={handleOpenDelete}
                            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </PermissionGuard>
                </div>

                <PermissionGuard
                    requiredPermission={PERMISSIONS.SETINSIDE_PERSON}
                    fallbackComponent={<RRPPBadge isInside={isInside} />}>
                    <button
                        onClick={() => toggleStatus({ personId: person._id, isInside: !person.isInside })}
                        className={`flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all active:scale-95 ${isInside ? 'bg-zinc-800/50 text-zinc-500 hover:text-white hover:bg-zinc-700' : 'bg-red-600 text-white shadow-lg shadow-red-900/20 hover:bg-red-500'}`}>
                        {isInside ? <Undo2 className="h-5 w-5" /> : (
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4" />
                                <span className="hidden sm:inline">Ingresar</span>
                            </div>
                        )}
                    </button>
                </PermissionGuard>

                {/* 2. INGRESAR ACTION vs STATUS BADGE */}

            </div>

            <GuestFormModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                onSubmit={handleEdit}
                person={person}
                isUpdating={true}
                isLoading={isLoading}
            />
            <ConfirmDialog
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="¿Eliminar Invitado?"
                description="Esta acción eliminará al invitado. ¿Estás seguro?"
                variant={variant}
                isLoading={isLoading}
                buttonText={'Eliminar'}
                loadingButtonText={'Eliminando...'} />
        </div>
    )
}

interface RRPPBadgeProps {
    isInside: boolean
}

function RRPPBadge({ isInside }: RRPPBadgeProps) {
    return (
        <div className={`
                        flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium border
                        ${isInside
                ? 'bg-red-500/10 text-red-500 border-red-500/20'
                : 'bg-zinc-800/50 text-zinc-500 border-zinc-700/50'
            }
                    `}>
            {isInside ? "Adentro" : "Afuera"}
        </div>
    )
}

