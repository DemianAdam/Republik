import { Users, CheckCircle2, Clock } from "lucide-react";
import { useGetPersonsCounters } from "../../hooks/persons/useGetPersonsCounters";

export default function DashboardStats() {
  const getPersonsCounter = useGetPersonsCounters();

  const stats = [
    {
      label: "Total Invitados",
      value: getPersonsCounter?.total ?? 0,
      icon: Users,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "group-hover:border-emerald-500/30",
    },
    {
      label: "Confirmados",
      value: getPersonsCounter?.inside ?? 0,
      icon: CheckCircle2,
      color: "text-green-400",
      bg: "bg-green-400/10",
      border: "group-hover:border-green-400/30",
    },
    {
      label: "Pendientes",
      value: getPersonsCounter?.outside ?? 0,
      icon: Clock,
      color: "text-zinc-400",
      bg: "bg-zinc-400/10",
      border: "group-hover:border-zinc-400/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all ${stat.border}`}
        >
          {/* Decorative Glow */}
          <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-current opacity-5 blur-2xl transition-opacity group-hover:opacity-10 ${stat.color}`} />

          <div className="flex items-center gap-4">
            <div className={`rounded-xl ${stat.bg} p-3 ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}