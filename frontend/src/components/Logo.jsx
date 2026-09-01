import { Link } from "react-router-dom";

/**
 * Stratos brand logo.
 * The source is a photo-JPG with white background, so we render it inside a
 * soft rounded white chip (brand plaque) that reads cleanly on the dark theme
 * while preserving the multi-color ribbon and dark-navy wordmark exactly as-is.
 *
 * variant:
 *   - "chip"    : navbar / admin sidebar (compact)
 *   - "wordmark": chip + inline "Innovacion en Sistemas" tagline (used sparingly)
 *   - "footer"  : larger chip
 */
export const Logo = ({ variant = "chip", to = "/" }) => {
  const sizes = {
    chip:     { box: "h-12 md:h-14", img: "h-16 md:h-20", pad: "px-3" },
    wordmark: { box: "h-14",         img: "h-20",         pad: "px-3" },
    footer:   { box: "h-20",         img: "h-28",         pad: "px-4" },
  };
  const s = sizes[variant];

  return (
    <Link to={to} data-testid="brand-logo" className="inline-flex items-center gap-4 group">
      <div
        className={`bg-white ${s.box} ${s.pad} overflow-hidden flex items-center rounded-sm shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_10px_28px_-12px_rgba(0,229,255,0.45)] transition-transform duration-200 group-hover:-translate-y-[1px]`}
        data-testid="brand-chip"
      >
        <img
          src="/brand/stratos-logo.jpg"
          alt="Stratos - Innovacion en Sistemas"
          className={`${s.img} w-auto object-contain select-none`}
          draggable={false}
        />
      </div>
      {variant === "wordmark" && (
        <div className="hidden md:flex flex-col leading-none">
          <span className="font-mono-strato text-[10px] tracking-[0.35em] uppercase text-[#00E5FF]">/ Innovacion</span>
          <span className="font-mono-strato text-[10px] tracking-[0.35em] uppercase text-muted-strato mt-1.5">en Sistemas</span>
        </div>
      )}
    </Link>
  );
};

export default Logo;
