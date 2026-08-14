import { Link } from "react-router-dom";

export const Logo = ({ compact = false }) => {
  return (
    <Link to="/" data-testid="brand-logo" className="flex items-center gap-3 group">
      <div className="relative">
        <div className="w-10 h-10 bg-[#00E5FF] flex items-center justify-center transition-colors group-hover:bg-white">
          <span className="font-display font-black text-black text-xl leading-none">S</span>
        </div>
        <div className="absolute inset-0 border border-[#00E5FF] translate-x-[3px] translate-y-[3px] -z-10" aria-hidden="true" />
      </div>
      {!compact && (
        <div className="leading-none">
          <div className="font-display font-black text-white text-xl tracking-tight">
            STRATOTOS
          </div>
          <div className="font-mono-strato text-[10px] tracking-[0.3em] text-[#00E5FF] mt-1">
            / SYSTEM
          </div>
        </div>
      )}
    </Link>
  );
};

export default Logo;
