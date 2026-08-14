import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { Logo } from "./Logo";

const links = [
  { to: "/", label: "Portada", testid: "nav-home" },
  { to: "/noticias/ia", label: "IA", testid: "nav-ia" },
  { to: "/noticias/sap", label: "SAP", testid: "nav-sap" },
  { to: "/noticias/figuras", label: "Figuras Tech", testid: "nav-figuras" },
  { to: "/consultoria", label: "Consultoria SAP", testid: "nav-consulting" },
  { to: "/academia", label: "Academia", testid: "nav-academy" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-strato backdrop-blur-xl" style={{ background: "rgba(5,5,10,0.75)" }} data-testid="main-navbar">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 lg:px-10 h-16">
        <Logo />
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              data-testid={l.testid}
              className={({ isActive }) =>
                `font-mono-strato text-[11px] tracking-[0.2em] uppercase transition-colors ${
                  isActive ? "text-[#00E5FF]" : "text-white/80 hover:text-[#00E5FF]"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/#newsletter"
            data-testid="nav-subscribe-btn"
            className="hidden md:inline-flex btn-primary text-xs tracking-widest uppercase"
          >
            Suscribirse
          </Link>
          <button className="lg:hidden text-white p-2" onClick={() => setOpen(!open)} data-testid="nav-mobile-toggle" aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-strato bg-[#05050A]" data-testid="nav-mobile-menu">
          <div className="px-6 py-4 flex flex-col gap-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `font-mono-strato text-xs tracking-[0.2em] uppercase ${
                    isActive ? "text-[#00E5FF]" : "text-white/80"
                  }`
                }
                data-testid={`${l.testid}-mobile`}
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
