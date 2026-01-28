import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ROLES_ENUM } from "features/admin/types/userTypes";
import StatsCards from "features/admin/statistics/components/StatsCards"; // Adjust path as needed
import { BarChart3, Filter } from "lucide-react";
import { AdminLayoutContext } from "../../types/AdminLayoutContext";
import { useGetStatistics } from "features/admin/hooks/users/useGetStatistics";
import { LoadingState } from "components/LoadingState";
import { useGetAllUsers } from "features/admin/hooks/users/useGetAllUsers";
import { useGetPersonsCounters } from "features/admin/hooks/persons/useGetPersonsCounters";
import { Id } from "convex/_generated/dataModel";


export default function Statistics() {
  const { user } = useOutletContext<AdminLayoutContext>();
  const statisticsQuery = useGetStatistics();
  const countersQuery = useGetPersonsCounters();
  const usersQuery = useGetAllUsers();
  const [selectedFilter, setSelectedFilter] = useState<"all" | Id<"users">>("all");

  const isAdmin = user.role === ROLES_ENUM.ADMIN;
  const currentStats = (() => {
    if (!statisticsQuery.data) return null;

    if (user.role === ROLES_ENUM.ADMIN) {
      if (selectedFilter === "all") {
        if (countersQuery.isPending) return null;
        return {
          statistics: {
            totalPersons: countersQuery.data?.total ?? 0,
            insidePersons: countersQuery.data?.inside ?? 0,
            outsidePersons: countersQuery.data?.outside ?? 0
          }
        };
      }

      return statisticsQuery.data.info.find(
        i => i.user._id === selectedFilter
      ) ?? null;
    }

    return statisticsQuery.data.info.find(
      i => i.user._id === user._id
    ) ?? null;
  })();


  if (statisticsQuery.isError) {
    //TODO: handle better
    return <div>Error</div>;
  }


  if (statisticsQuery.isPending || !currentStats) {
    return <LoadingState />
  }



  //const currentStats = statisticsQuery.data.unique ? statisticsQuery.data.info : statisticsQuery.data.info[0]
  const allUsers = usersQuery?.data?.filter(x => x.role != ROLES_ENUM.DOOR) || [];



  return (
    <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Estadísticas</h1>
            {/* Optional Tag to show role visibility */}
            {!isAdmin && (
              <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-400 border border-white/5">
                Vista Personal
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-400">
            {isAdmin
              ? "Monitorización global y rendimiento por equipo."
              : "Tus métricas de rendimiento para esta noche."
            }
          </p>
        </div>

        {/* Admin Filters */}
        {isAdmin && (
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                <Filter className="h-4 w-4" />
              </div>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value as "all" | Id<"users">)}
                className="h-10 w-full appearance-none rounded-xl border border-white/10 bg-black/20 pl-10 pr-10 text-sm text-zinc-300 outline-none transition-all focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 sm:w-64 hover:bg-white/5"
              >
                <option value="all" className="bg-zinc-900 text-white">Vista Global</option>
                <optgroup label="RRPPs">
                  {allUsers.map((u) => (
                    <option key={u._id} value={u._id} className="bg-zinc-900 text-zinc-300">
                      {u.name}
                    </option>
                  ))}
                </optgroup>
              </select>

              {/* Custom Chevron Icon for select */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500">
                <BarChart3 className="h-4 w-4 opacity-50" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards Component */}
      <StatsCards
        total={currentStats.statistics.totalPersons}
        inside={currentStats.statistics.insidePersons}
        outside={currentStats.statistics.outsidePersons}
      />

      {/* Placeholder for future Charts */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800/50">
          <BarChart3 className="h-6 w-6 text-zinc-500" />
        </div>
        <h3 className="text-lg font-medium text-white">Gráficos Detallados</h3>
        <p className="mt-1 text-sm text-zinc-500 max-w-sm mx-auto">
          Próximamente: Visualización de ingresos por hora y comparativas de rendimiento.
        </p>
      </div>
    </main>
  );
}