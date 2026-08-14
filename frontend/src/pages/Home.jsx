import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import NewsCard, { CategoryChip, formatDate } from "@/components/NewsCard";
import Newsletter from "@/components/Newsletter";
import { ArrowRight, Zap, GraduationCap, Briefcase } from "lucide-react";

const TICKER = [
  "IA Generativa alcanza 4B usuarios activos",
  "SAP libera Joule para todos los modulos",
  "Elon Musk anuncia Neuralink v3",
  "Anthropic supera a OpenAI en codigo",
  "Bezos invierte 2B en cuantica",
  "SAP S/4HANA Cloud 2026 llega en Q2",
];

const Ticker = () => (
  <div className="border-y border-strato bg-[#05050A] overflow-hidden" data-testid="live-ticker">
    <div className="flex items-center h-11">
      <div className="bg-[#00E5FF] text-black font-mono-strato text-[10px] tracking-[0.25em] uppercase px-4 py-1 font-bold shrink-0">
        Live / Ahora
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="ticker-track flex whitespace-nowrap">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="mx-8 font-mono-strato text-xs tracking-wider text-white/70">
              <span className="text-[#00E5FF] mr-2">◆</span>{t}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [f, l, c] = await Promise.all([
          api.get("/articles", { params: { featured: true, limit: 4 } }),
          api.get("/articles", { params: { limit: 9 } }),
          api.get("/courses"),
        ]);
        setFeatured(f.data.items);
        setLatest(l.data.items);
        setCourses(c.data.items.slice(0, 3));
      } catch (e) { console.error(e); }
    })();
  }, []);

  const hero = featured[0];
  const supporting = featured.slice(1, 4);
  const feedItems = latest.filter(a => hero ? a.slug !== hero.slug : true).slice(0, 8);

  return (
    <div data-testid="home-page">
      <Ticker />

      {/* HERO BENTO */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-10 pt-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {hero && (
            <Link to={`/articulo/${hero.slug}`} className="md:col-span-8 relative img-hover block aspect-[16/10] md:aspect-auto md:min-h-[520px] group border border-strato" data-testid="hero-article">
              <img src={hero.cover_image} alt={hero.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-[#05050A]/60 to-transparent" />
              <div className="absolute top-6 left-6 flex items-center gap-3">
                <CategoryChip category={hero.category} />
                <span className="font-mono-strato text-[10px] tracking-[0.3em] uppercase text-white/60">Portada</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                <h1 className="font-display font-black text-white text-3xl md:text-5xl leading-[1.05] tracking-tight max-w-3xl group-hover:text-[#00E5FF] transition-colors">
                  {hero.title}
                </h1>
                <p className="mt-4 text-white/80 max-w-2xl text-base md:text-lg leading-relaxed">{hero.excerpt}</p>
                <div className="mt-6 flex items-center gap-3 font-mono-strato text-[11px] tracking-[0.2em] uppercase text-white/70">
                  <span>{hero.author}</span><span>&mdash;</span><span>{formatDate(hero.created_at)}</span>
                </div>
              </div>
            </Link>
          )}
          <div className="md:col-span-4 flex flex-col gap-6">
            {supporting.map((a) => (
              <Link key={a.slug} to={`/articulo/${a.slug}`} className="group flex gap-4 border border-strato p-4 hover:border-[#00E5FF]/60 transition-colors bg-[#0A0A11]" data-testid={`hero-support-${a.slug}`}>
                <div className="w-28 h-24 shrink-0 overflow-hidden bg-[#0F0F14]">
                  <img src={a.cover_image} alt={a.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-between min-w-0">
                  <div>
                    <CategoryChip category={a.category} />
                    <h3 className="font-display font-bold text-white text-sm mt-2 leading-snug group-hover:text-[#00E5FF] transition-colors line-clamp-3">
                      {a.title}
                    </h3>
                  </div>
                  <span className="font-mono-strato text-[10px] tracking-[0.2em] uppercase text-muted-strato">
                    {formatDate(a.created_at)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS FEED */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-10 pb-24">
        <div className="flex items-end justify-between mb-10 border-b border-strato pb-4">
          <div>
            <div className="font-mono-strato text-[11px] tracking-[0.3em] uppercase text-[#00E5FF]">/ Ultimas</div>
            <h2 className="font-display font-black text-white text-3xl md:text-4xl tracking-tight mt-2">Radar Tech</h2>
          </div>
          <Link to="/noticias/ia" className="hidden md:inline-flex items-center gap-2 font-mono-strato text-xs tracking-widest uppercase text-white/70 hover:text-[#00E5FF] transition-colors" data-testid="view-all-news">
            Ver todo <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {feedItems.map((a) => <NewsCard key={a.slug} article={a} />)}
        </div>
      </section>

      {/* SAP CONSULTING */}
      <section className="relative border-y border-strato" style={{ background: "linear-gradient(135deg, rgba(0,68,255,0.12) 0%, rgba(5,5,10,1) 60%)" }} data-testid="sap-section">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-24 grid md:grid-cols-2 gap-14 items-center">
          <div>
            <div className="font-mono-strato text-[11px] tracking-[0.3em] uppercase text-[#6B8CFF] mb-4">/ Servicios / SAP</div>
            <h2 className="font-display font-black text-white text-4xl md:text-5xl leading-[1.05] tracking-tight">
              Consultoria SAP <span className="text-[#6B8CFF]">de alto impacto</span>
            </h2>
            <p className="mt-6 text-muted-strato text-base md:text-lg leading-relaxed max-w-lg">
              Implementaciones S/4HANA, migraciones a la nube, roll-outs internacionales y optimizacion de procesos. Un equipo con mas de 15 años reales de proyecto.
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-3">
              {["S/4HANA Cloud", "Migraciones ECC", "BTP & CAP", "FI / CO / MM / SD"].map((s) => (
                <li key={s} className="border border-strato px-4 py-3 font-mono-strato text-xs tracking-widest uppercase text-white/80 bg-[#0A0A14]">
                  <span className="text-[#6B8CFF] mr-2">◆</span>{s}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex gap-4">
              <Link to="/consultoria" className="btn-primary" data-testid="cta-consulting">Agendar diagnostico</Link>
              <Link to="/consultoria" className="btn-ghost">Ver casos</Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] border border-strato-hi img-hover">
              <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?crop=entropy&cs=srgb&fm=jpg&q=85&w=900" alt="SAP Consulting" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#0044FF] text-white p-6 max-w-[240px]">
              <Briefcase size={20} className="mb-3" />
              <div className="font-display font-bold text-2xl leading-tight">+120 proyectos entregados</div>
              <div className="font-mono-strato text-[10px] tracking-[0.25em] uppercase mt-2 opacity-80">LATAM &amp; Europa</div>
            </div>
          </div>
        </div>
      </section>

      {/* ACADEMY */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-10 py-24" data-testid="academy-section">
        <div className="flex items-end justify-between mb-10 border-b border-strato pb-4">
          <div>
            <div className="font-mono-strato text-[11px] tracking-[0.3em] uppercase text-[#E500FF]">/ Academia</div>
            <h2 className="font-display font-black text-white text-3xl md:text-4xl tracking-tight mt-2">Formacion tecnica que sirve</h2>
          </div>
          <Link to="/academia" className="hidden md:inline-flex items-center gap-2 font-mono-strato text-xs tracking-widest uppercase text-white/70 hover:text-[#E500FF] transition-colors" data-testid="view-all-courses">
            Todos los cursos <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((c) => (
            <Link to="/academia" key={c.id} className="group border border-strato bg-[#0A0A11] hover:border-[#E500FF]/60 transition-colors flex flex-col" data-testid={`course-card-${c.id}`}>
              <div className="img-hover aspect-[16/10] bg-[#0F0F14]">
                <img src={c.cover_image} alt={c.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono-strato text-[10px] tracking-[0.25em] uppercase text-[#E500FF]">{c.level}</span>
                  <span className="w-1 h-1 bg-muted-strato rounded-full" />
                  <span className="font-mono-strato text-[10px] tracking-[0.25em] uppercase text-muted-strato">{c.duration}</span>
                </div>
                <h3 className="font-display font-bold text-white text-lg leading-snug group-hover:text-[#E500FF] transition-colors">{c.title}</h3>
                <p className="text-sm text-muted-strato mt-3 flex-1 line-clamp-3">{c.description}</p>
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-strato">
                  <span className="font-display font-black text-white text-2xl">${c.price.toFixed(0)}<span className="text-xs text-muted-strato font-normal ml-1">USD</span></span>
                  <GraduationCap size={22} className="text-[#E500FF]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Newsletter />

      {/* VALUE BAR */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-10 py-20 grid grid-cols-2 md:grid-cols-4 gap-8" data-testid="stats-bar">
        {[
          { icon: Zap, k: "500+", v: "Noticias/mes" },
          { icon: Briefcase, k: "120+", v: "Proyectos SAP" },
          { icon: GraduationCap, k: "3.400+", v: "Alumnos" },
          { icon: ArrowRight, k: "24 paises", v: "Presencia" },
        ].map(({ icon: Icon, k, v }, i) => (
          <div key={i} className="border-l border-strato pl-6">
            <Icon className="text-[#00E5FF] mb-4" size={22} />
            <div className="font-display font-black text-white text-3xl md:text-4xl">{k}</div>
            <div className="font-mono-strato text-[10px] tracking-[0.25em] uppercase text-muted-strato mt-2">{v}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
