import { Link } from "react-router-dom";

const CATEGORY_LABEL = { ia: "IA", sap: "SAP", figuras: "FIGURAS TECH" };

export const CategoryChip = ({ category }) => (
  <span
    data-testid={`chip-${category}`}
    className={`chip-${category} border px-2 py-0.5 font-mono-strato text-[10px] tracking-[0.2em] uppercase`}
  >
    {CATEGORY_LABEL[category] || category}
  </span>
);

export const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return ""; }
};

export const NewsCard = ({ article, size = "md" }) => {
  const isLarge = size === "lg";
  const isSmall = size === "sm";
  return (
    <article
      data-testid={`news-card-${article.slug}`}
      className={`group flex ${isLarge ? "flex-col" : "flex-col"} gap-4`}
    >
      <Link to={`/articulo/${article.slug}`} className="img-hover block relative aspect-[16/10] bg-[#0F0F14] border border-strato">
        <img
          src={article.cover_image}
          alt={article.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-3 left-3">
          <CategoryChip category={article.category} />
        </div>
      </Link>
      <div className="flex flex-col gap-2">
        <Link to={`/articulo/${article.slug}`}>
          <h3 className={`font-display font-bold text-white leading-tight tracking-tight group-hover:text-[#00E5FF] transition-colors ${
            isLarge ? "text-3xl md:text-4xl" : isSmall ? "text-base" : "text-xl"
          }`}>
            {article.title}
          </h3>
        </Link>
        {!isSmall && (
          <p className="text-sm text-muted-strato leading-relaxed line-clamp-2">{article.excerpt}</p>
        )}
        <div className="flex items-center gap-3 font-mono-strato text-[10px] tracking-[0.15em] uppercase text-muted-strato mt-1">
          <span>{article.author}</span>
          <span className="w-1 h-1 bg-muted-strato rounded-full" />
          <span>{formatDate(article.created_at)}</span>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
