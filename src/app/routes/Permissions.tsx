import { useState } from "react";
import { CreateUser } from "features/admin/types/userTypes";
import { useCreateUser } from "features/admin/hooks/users/useCreateUser";
import { Plus } from "lucide-react";
import UserFormModal from "features/admin/permissions/components/UserFormModal";
import { useGetAllUsers } from "features/admin/hooks/users/useGetAllUsersPaginated";
import UserCard from "features/admin/permissions/components/UserCard";

export default function Permissions() {
  const queryGetAllUsers = useGetAllUsers();
  const { createUserHandler } = useCreateUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenCreate = () => setIsModalOpen(true);

  const handleSubmit = async (user: CreateUser) => {
    setIsLoading(true)
    try {
      await createUserHandler(user);
    }
    finally {
      setIsModalOpen(false);
      setIsLoading(false)
    }
  };

  return (
    <>
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Permisos</h1>
            <p className="mt-1 text-sm text-zinc-400">Administra quién tiene acceso al panel de Natura.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20"
            >
              <Plus className="h-4 w-4" />
              Nuevo Usuario
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {queryGetAllUsers.result._tag === "Loaded" && queryGetAllUsers.result.page.map((user) =>
            <UserCard
              key={user._id}
              user={user}
            />
          )}
        </div>
      </main>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isUpdating={false}
        isLoading={isLoading}
      />
    </>
  );
}

