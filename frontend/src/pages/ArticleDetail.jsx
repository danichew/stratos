import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import NewsCard, { CategoryChip, formatDate } from "@/components/NewsCard";
import { ArrowLeft, Eye } from "lucide-react";

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true); setError(null);
    (async () => {
      try {
        const { data } = await api.get(`/articles/${slug}`);
        setArticle(data.article);
        setRelated(data.related || []);
      } catch (e) {
        setError("Articulo no encontrado");
      } finally { setLoading(false); }
    })();
  }, [slug]);

  if (loading) return <div className="max-w-3xl mx-auto py-24 px-6 text-muted-strato font-mono-strato text-xs uppercase tracking-widest">Cargando...</div>;
  if (error || !article) return (
    <div className="max-w-3xl mx-auto py-24 px-6 text-center">
      <h1 className="font-display font-black text-4xl text-white">Articulo no encontrado</h1>
      <Link to="/" className="btn-primary inline-block mt-8">Volver al inicio</Link>
    </div>
  );

  return (
    <article data-testid="article-detail">
      <div className="relative aspect-[21/9] md:aspect-[21/8] max-h-[560px] w-full overflow-hidden bg-black">
        <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-[#05050A]/40 to-transparent" />
      </div>
      <div className="max-w-3xl mx-auto px-6 lg:px-0 -mt-32 relative z-10 pb-16">
        <Link to={`/noticias/${article.category}`} className="inline-flex items-center gap-2 font-mono-strato text-[10px] tracking-[0.3em] uppercase text-white/70 hover:text-[#00E5FF] mb-6" data-testid="back-to-category">
          <ArrowLeft size={14} /> Volver a {article.category.toUpperCase()}
        </Link>
        <CategoryChip category={article.category} />
        <h1 className="font-display font-black text-white text-4xl md:text-6xl leading-[1.05] tracking-tight mt-6">
          {article.title}
        </h1>
        <p className="text-xl md:text-2xl text-muted-strato mt-6 leading-relaxed">{article.excerpt}</p>
        <div className="flex items-center gap-6 mt-8 pb-8 border-b border-strato font-mono-strato text-[11px] tracking-[0.2em] uppercase text-muted-strato">
          <span className="text-white">{article.author}</span>
          <span>{formatDate(article.created_at)}</span>
          <span className="flex items-center gap-2"><Eye size={12} /> {article.views} vistas</span>
        </div>
        <div className="prose-strato mt-10">
          {article.content.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>

      {related.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 lg:px-10 pb-24 border-t border-strato pt-16">
          <div className="font-mono-strato text-[11px] tracking-[0.3em] uppercase text-[#00E5FF] mb-6">/ Relacionados</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {related.map((r) => <NewsCard key={r.slug} article={r} />)}
          </div>
        </section>
      )}
    </article>
  );
}
