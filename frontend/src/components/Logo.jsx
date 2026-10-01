import { Link } from "react-router-dom";

/**
 * Stratos brand logo.
 * High-resolution transparent PNG wordmark (white "TRATOS" + cyan "S" accent),
 * rendered directly on the dark theme background — no background chip needed.
 *
 * variant:
 *   - "chip"    : navbar / admin sidebar (compact)
 *   - "wordmark": same as chip (kept for compatibility)
 *   - "footer"  : larger chip
 */
export const Logo = ({ variant = "chip", to = "/" }) => {
  const sizes = {
    chip:     { img: "h-11 md:h-14" },
    wordmark: { img: "h-14" },
    footer:   { img: "h-20" },
  };
  const s = sizes[variant];

  return (
    <Link to={to} data-testid="brand-logo" className="inline-flex items-center gap-4 group">
      <img
        src="/brand/stratos-logo-final.png"
        alt="Stratos - Innovacion en Sistemas"
        className={`${s.img} w-auto object-contain select-none transition-transform duration-200 group-hover:-translate-y-[1px]`}
        draggable={false}
        data-testid="brand-chip"
      />
    </Link>
  );
};

export default Logo;
