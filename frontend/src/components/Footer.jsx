import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export const Footer = () => {
  return (
    <footer className="border-t border-strato mt-24 bg-[#05050A]" data-testid="main-footer">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <Logo />
          <p className="mt-6 text-sm text-muted-strato leading-relaxed">
            La plataforma latinoamericana de noticias tech, consultoria SAP y formacion especializada.
          </p>
        </div>
        <div>
          <div className="font-mono-strato text-[10px] tracking-[0.3em] uppercase text-[#00E5FF] mb-4">Noticias</div>
          <ul className="space-y-3 text-sm">
            <li><Link to="/noticias/ia" className="text-white/80 hover:text-[#00E5FF]">Inteligencia Artificial</Link></li>
            <li><Link to="/noticias/sap" className="text-white/80 hover:text-[#00E5FF]">SAP</Link></li>
            <li><Link to="/noticias/figuras" className="text-white/80 hover:text-[#00E5FF]">Figuras Tech</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-mono-strato text-[10px] tracking-[0.3em] uppercase text-[#00E5FF] mb-4">Servicios</div>
          <ul className="space-y-3 text-sm">
            <li><Link to="/consultoria" className="text-white/80 hover:text-[#00E5FF]">Consultoria SAP</Link></li>
            <li><Link to="/academia" className="text-white/80 hover:text-[#00E5FF]">Academia</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-mono-strato text-[10px] tracking-[0.3em] uppercase text-[#00E5FF] mb-4">Empresa</div>
          <ul className="space-y-3 text-sm">
            <li><a href="mailto:hola@stratotos.com" className="text-white/80 hover:text-[#00E5FF]">hola@stratotos.com</a></li>
            <li><Link to="/login" className="text-white/60 hover:text-[#00E5FF]" data-testid="footer-admin-link">Acceso Admin</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-strato">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-mono-strato text-[10px] tracking-[0.25em] uppercase text-muted-strato">
            &copy; 2026 Stratotos System &mdash; Todos los derechos reservados
          </div>
          <div className="font-mono-strato text-[10px] tracking-[0.25em] uppercase text-muted-strato">
            Powered by curiosity
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
