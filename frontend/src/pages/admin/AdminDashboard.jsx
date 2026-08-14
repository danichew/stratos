import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Newspaper, GraduationCap, Users, Mail, Eye, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { (async () => {
    const { data } = await api.get("/admin/stats");
    setStats(data);
  })(); }, []);

  const cards = stats ? [
    { icon: Newspaper, k: stats.articles, v: "Noticias publicadas", color: "#00E5FF" },
    { icon: Eye, k: stats.total_views, v: "Vistas totales", color: "#00E5FF" },
    { icon: GraduationCap, k: stats.courses, v: "Cursos activos", color: "#E500FF" },
    { icon: Users, k: stats.subscribers, v: "Suscriptores", color: "#6B8CFF" },
    { icon: Mail, k: stats.new_leads, v: "Leads nuevos", color: "#6B8CFF" },
    { icon: TrendingUp, k: stats.leads, v: "Leads totales", color: "#00E5FF" },
  ] : [];

  return (
    <div data-testid="admin-dashboard">
      <div className="font-mono-strato text-[11px] tracking-[0.3em] uppercase text-[#00E5FF]">/ Dashboard</div>
      <h1 className="font-display font-black text-white text-4xl md:text-5xl mt-3 tracking-tight">Panel de Control</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 mt-12 border border-strato">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="p-8 border-r border-b border-strato bg-[#0A0A11]" data-testid={`stat-card-${i}`}>
              <Icon size={22} style={{ color: c.color }} className="mb-4" />
              <div className="font-display font-black text-white text-4xl">{c.k}</div>
              <div className="font-mono-strato text-[10px] tracking-[0.25em] uppercase text-muted-strato mt-2">{c.v}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
