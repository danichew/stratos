import { Link } from "react-router-dom";

/**
 * Stratos brand logo.
 * Transparent PNG wordmark (white text + cyan accent), rendered directly on
 * the dark theme background — no background chip needed.
 *
 * variant:
 *   - "chip"    : navbar / admin sidebar (compact)
 *   - "wordmark": chip + inline "Innovacion en Sistemas" tagline (used sparingly)
 *   - "footer"  : larger chip
 */
export const Logo = ({ variant = "chip", to = "/" }) => {
  const sizes = {
    chip:     { img: "h-10 md:h-12" },
    wordmark: { img: "h-12" },
    footer:   { img: "h-16" },
  };
  const s = sizes[variant];

  return (
    <Link to={to} data-testid="brand-logo" className="inline-flex items-center gap-4 group">
      <img
        src="/brand/stratos-logo-white.png"
        alt="Stratos - Innovacion en Sistemas"
        className={`${s.img} w-auto object-contain select-none transition-transform duration-200 group-hover:-translate-y-[1px]`}
        draggable={false}
        data-testid="brand-chip"
      />
    </Link>
  );
};

export default Logo;

