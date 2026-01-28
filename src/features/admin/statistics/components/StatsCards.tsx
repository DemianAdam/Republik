import { Users, CheckCircle2, Clock } from "lucide-react";

interface StatsCardsProps {
  total: number;
  inside: number;
  outside: number;
  loading?: boolean;
}

export default function StatsCards({ 
  total, 
  inside, 
  outside, 
  loading = false 
}: StatsCardsProps) {
  
  const stats = [
    {
      label: "Total Invitados",
      value: total,
      icon: Users,
      color: "text-red-600",
      bg: "bg-red-600/10",
      border: "group-hover:border-red-600/30",
    },
    {
      label: "Ingresados",
      value: inside,
      icon: CheckCircle2,
      color: "text-red-400",
      bg: "bg-red-400/10",
      border: "group-hover:border-red-400/30",
    },
    {
      label: "Pendientes",
      value: outside,
      icon: Clock,
      color: "text-zinc-400",
      bg: "bg-zinc-400/10",
      border: "group-hover:border-zinc-400/30",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

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