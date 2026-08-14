import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import NewsCard from "@/components/NewsCard";

const LABELS = {
  ia: { title: "Inteligencia Artificial", tagline: "El futuro se escribe en tensores.", color: "#00E5FF" },
  sap: { title: "SAP", tagline: "El nucleo de las corporaciones globales.", color: "#6B8CFF" },
  figuras: { title: "Figuras Tech", tagline: "Los rostros que redefinen la industria.", color: "#FF7EDB" },
};

export default function NewsList() {
  const { category } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const info = LABELS[category] || { title: "Noticias", tagline: "", color: "#00E5FF" };

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const { data } = await api.get("/articles", { params: { category, limit: 40 } });
        setItems(data.items);
      } finally { setLoading(false); }
    })();
  }, [category]);

  return (
    <div data-testid={`news-list-${category}`}>
      <section className="border-b border-strato" style={{ background: `linear-gradient(135deg, ${info.color}18 0%, transparent 60%)` }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-20">
          <div className="font-mono-strato text-[11px] tracking-[0.3em] uppercase" style={{ color: info.color }}>
            / Categoria
          </div>
          <h1 className="font-display font-black text-white text-5xl md:text-7xl mt-4 tracking-tight leading-none">
            {info.title}
          </h1>
          <p className="mt-4 text-muted-strato text-lg max-w-2xl">{info.tagline}</p>
        </div>
      </section>
      <section className="max-w-[1440px] mx-auto px-6 lg:px-10 py-16">
        {loading ? (
          <div className="text-muted-strato font-mono-strato text-xs tracking-widest uppercase">Cargando...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-strato">Aun no hay noticias en esta categoria.</p>
            <Link to="/" className="btn-ghost inline-block mt-6">Volver al inicio</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {items.map((a) => <NewsCard key={a.slug} article={a} />)}
          </div>
        )}
      </section>
    </div>
  );
}
