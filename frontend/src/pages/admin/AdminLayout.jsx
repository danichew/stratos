import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LayoutGrid, Newspaper, GraduationCap, Users, Mail, LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";

const items = [
  { to: "/admin", end: true, label: "Dashboard", icon: LayoutGrid, testid: "admin-nav-dashboard" },
  { to: "/admin/articles", label: "Noticias", icon: Newspaper, testid: "admin-nav-articles" },
  { to: "/admin/courses", label: "Cursos", icon: GraduationCap, testid: "admin-nav-courses" },
  { to: "/admin/leads", label: "Leads", icon: Mail, testid: "admin-nav-leads" },
  { to: "/admin/subscribers", label: "Suscriptores", icon: Users, testid: "admin-nav-subscribers" },
];

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const nav = useNavigate();

  if (loading) return <div className="p-10 text-muted-strato">Cargando...</div>;
  if (!user) { nav("/login", { replace: true }); return null; }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr]" data-testid="admin-layout">
      <aside className="border-r border-strato bg-[#0A0A11] p-6 md:sticky md:top-0 md:h-screen">
        <div className="mb-10"><Logo /></div>
        <nav className="flex flex-col gap-1">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <NavLink key={it.to} to={it.to} end={it.end} data-testid={it.testid}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 font-mono-strato text-[11px] tracking-[0.2em] uppercase transition-colors ${
                    isActive ? "bg-[#00E5FF] text-black" : "text-white/70 hover:text-white hover:bg-[#12121A]"
                  }`
                }
              >
                <Icon size={14} /> {it.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="mt-10 pt-6 border-t border-strato">
          <div className="font-mono-strato text-[10px] tracking-[0.25em] uppercase text-muted-strato mb-2">Sesion</div>
          <div className="text-white text-sm truncate">{user.email}</div>
          <button onClick={() => { logout(); nav("/"); }} className="mt-4 flex items-center gap-2 text-red-400 hover:text-red-300 font-mono-strato text-[10px] tracking-[0.25em] uppercase" data-testid="admin-logout">
            <LogOut size={12} /> Cerrar sesion
          </button>
        </div>
      </aside>
      <main className="p-8 md:p-12 bg-[#05050A] min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
