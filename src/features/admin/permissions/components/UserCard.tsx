import { Edit, Mail, Shield, Trash2 } from 'lucide-react';
import { CreateUser, ROLE_UI, UpdateUser, User } from '../../types/userTypes';
import { getInitials } from '../../../../helpers';
import ConfirmDialog from 'components/ConfirmDialog';
import { useState } from 'react';
import { useUpdateUser } from 'features/admin/hooks/users/useUpdateUser';
import { useDeleteUser } from 'features/admin/hooks/users/useDeleteUser';
import UserFormModal from './UserFormModal';
import { VARIANT, Variant } from '../../../../types/Variants';

interface UserCardProps {
    user: User
}

export default function UserCard({ user }: UserCardProps) {
    const { updateUserHandler } = useUpdateUser();
    const { deleteUserHandler } = useDeleteUser();
    const [isLoading, setIsLoading] = useState(false);
    const [variant, setVariant] = useState<Variant>(VARIANT.OK)

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const roleInfo = ROLE_UI[user.role];

    const handleOpenUpdate = () => {
        //TODO: handle variant in UserFormModal
        //setVariant(VARIANT.OK)
        setIsUpdateModalOpen(true)
    }
    const handleOpenDelete = () => {
        setVariant(VARIANT.DANGER);
        setIsDeleteModalOpen(true)
    }

    const handleConfirmDelete = async () => {
        setIsLoading(true)
        try {
            await deleteUserHandler({ userId: user._id });
        }
        finally {
            setIsDeleteModalOpen(false)
            setIsLoading(false)
        }
    }

    const handleUpdate = async (createUser: CreateUser) => {
        setIsLoading(true)
        const updateUser: UpdateUser = {
            password: createUser.password,
            email: createUser.email,
            name: createUser.name,
            role: createUser.role,
            userId: user._id
        }
        try {
            await updateUserHandler(updateUser);
        }
        finally {
            setIsUpdateModalOpen(false);
            setIsLoading(false)
        }
    }
    return (
        <div
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 p-6 transition-all hover:border-red-500/30 hover:bg-zinc-900">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="relative z-10 flex items-start justify-between">
                <div className="flex gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 border border-white/5 text-lg font-bold text-white shadow-inner">
                        {getInitials(user.name)}
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">{user.name}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${roleInfo.style.badgeColor} ${roleInfo.style.textColor} `}>
                    <Shield className="h-3 w-3" />
                    {roleInfo.label}
                </span>

                <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                        onClick={handleOpenUpdate}
                        className="rounded p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white">
                        <Edit className="h-4 w-4" />
                    </button>

                    {/* 4. UPDATE TRASH BUTTON */}
                    <button
                        onClick={handleOpenDelete}
                        className="rounded p-1.5 text-zinc-400 hover:bg-red-500/10 hover:text-red-400"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <UserFormModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                onSubmit={handleUpdate}
                user={user}
                isUpdating={true}
                isLoading={isLoading}
            />
            <ConfirmDialog
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="¿Eliminar usuario?"
                description="Esta acción eliminará el acceso de este usuario al panel de administración. ¿Estás seguro?"
                variant={variant}
                isLoading={isLoading}
                buttonText={'Eliminar'}
                loadingButtonText={'Eliminando...'} />
        </div>
    )
}
