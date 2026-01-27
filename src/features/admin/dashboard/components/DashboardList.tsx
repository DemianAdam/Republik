import { Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useGetAllPersons } from "../../hooks/persons/useGetAllPersons";
import { useEffect, useState, useMemo } from "react";
import PersonRow from "./PersonRow";
import { useOutletContext } from "react-router-dom";
import { ROLES_ENUM, User } from "features/admin/types/userTypes";
import { useGetAllUsers } from "../../hooks/users/useGetAllUsers";
import { AdminLayoutContext } from "../../../../types/AdminLayoutContext";

export default function DashboardList() {
  const { user } = useOutletContext<AdminLayoutContext>();

  // Data Queries
  const getAllPersonsQuery = useGetAllPersons();
  const getAllUsersQuery = useGetAllUsers();

  const [searchValue, setSearchValue] = useState("");

  // --- FILTER STATE ---
  const [filterMode, setFilterMode] = useState<string>(
    user.role === ROLES_ENUM.RRPP ? 'MINE' : 'ALL'
  );

  // Debounce Search
  useEffect(() => {
    const id = setTimeout(() => {
      // Update Person Search
      getAllPersonsQuery.searchName.set(searchValue);

      // Update Anon Search (Assuming similar API, otherwise remove this line)
      // getAllAnonGuestQuery.searchName?.set(searchValue); 
    }, 300);
    return () => clearTimeout(id);
  }, [searchValue, getAllPersonsQuery.searchName]); // Removed .set from dep array to avoid unstable deps issues

  // --- PERSONS DATA ---
  const isLoadingPersons = getAllPersonsQuery.result._tag !== "Loaded";
  const persons = useMemo(() => {
    if (getAllPersonsQuery.result._tag !== "Loaded") return [];
    return getAllPersonsQuery.result.page;
  }, [getAllPersonsQuery.result]);
  const personsNextPage = getAllPersonsQuery.result._tag === "Loaded" && getAllPersonsQuery.result.loadNext;
  const personsPrevPage = getAllPersonsQuery.result._tag === "Loaded" && getAllPersonsQuery.result.loadPrev;


  const allUsers = getAllUsersQuery?.data?.filter(x => x.role != ROLES_ENUM.DOOR ) || [];



  // --- CLIENT SIDE FILTERING (Persons only) ---
  const filteredPersons = useMemo(() => {
    if (filterMode === 'ALL') return persons;
    if (filterMode === 'MINE') return persons.filter(p => p.userId === user._id);
    return persons.filter(p => p.userId === filterMode);
  }, [persons, filterMode, user._id]);



  return (
    <div className="space-y-4">

      {/* Header: Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder={"Buscar por nombre..."}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-900/50 py-3 pl-10 pr-4 text-white placeholder-zinc-500 backdrop-blur-md focus:border-red-600 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Filter Dropdown (Only show for Persons view) */}

        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="w-full appearance-none rounded-xl border border-white/10 bg-zinc-900/50 py-3 pl-10 pr-8 text-white backdrop-blur-md focus:border-red-600 focus:outline-none cursor-pointer transition-colors"
          >
            <option value="ALL">Todos</option>
            <option value="MINE">Mis Invitados</option>

            {user.role === ROLES_ENUM.ADMIN && allUsers.length > 0 && (
              <optgroup label="Filtrar por RRPP" className="bg-zinc-900 text-white">
                {allUsers.map((u: User) => {
                  if (u._id === user._id) return null;
                  return (
                    <option key={u._id} value={u._id}>
                      {u.name}
                    </option>
                  );
                })}
              </optgroup>
            )}
          </select>

          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>


      </div>

      {/* Pagination Controls */}
      <div className="sticky bottom-0 z-10 mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-zinc-900/80 p-3 backdrop-blur-md">
        <button
          onClick={() => personsPrevPage && personsPrevPage()}
          disabled={!personsPrevPage}
          className={`
            flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium
            transition
            ${personsPrevPage
              ? "bg-zinc-800 text-white hover:bg-zinc-700"
              : "cursor-not-allowed bg-zinc-800/40 text-zinc-500"}
          `}
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </button>

        <button
          onClick={() => personsNextPage && personsNextPage()}
          disabled={!personsNextPage}
          className={`
            flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium
            transition
            ${personsNextPage
              ? "bg-zinc-800 text-white hover:bg-zinc-700"
              : "cursor-not-allowed bg-zinc-800/40 text-zinc-500"}
          `}
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* List Rendering */}
      <div className="space-y-2">
        {!isLoadingPersons ? (
          persons.length > 0 ? (
            filteredPersons.map((person) => (
              <PersonRow key={person._id} person={person} />
            ))
          ) : (
            // Empty State
            <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5 text-zinc-500">
              <p>No se encontraron invitados.</p>
              {filterMode !== 'ALL' && (
                <p className="text-sm opacity-60 mt-1">
                  Prueba cambiando el filtro a "Todos".
                </p>
              )}
            </div>
          )
        ) : (
          // Loading Skeleton
          <div className="space-y-2 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-white/5 bg-zinc-900/40 p-4 h-[74px]">
                <div className="flex flex-col pl-3 gap-2">
                  <div className="h-5 w-32 bg-zinc-800 rounded-md"></div>
                  <div className="h-3 w-20 bg-zinc-800/50 rounded-md"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-9 w-24 bg-zinc-800 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div >
  );
}