import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { GraduationCap, Clock, Award, Users } from "lucide-react";

export default function Academy() {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/courses");
      setCourses(data.items);
    })();
  }, []);

  const filtered = filter === "all" ? courses : courses.filter(c => c.category === filter);

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await api.post("/leads", { ...form, interest: "academy", message: `Inscripcion: ${selected?.title || "General"}. ${form.message}` });
      toast.success("Inscripcion registrada. Te enviaremos los detalles al correo.");
      setForm({ name: "", email: "", phone: "", message: "" });
      setSelected(null);
    } catch { toast.error("No pudimos registrar tu inscripcion."); }
    finally { setLoading(false); }
  };

  return (
    <div data-testid="academy-page">
      <section className="border-b border-strato" style={{ background: "radial-gradient(700px 400px at 20% 30%, rgba(229,0,255,0.18), transparent 60%)" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-24 md:py-32">
          <div className="font-mono-strato text-[11px] tracking-[0.3em] uppercase text-[#E500FF]">/ Academia Stratotos</div>
          <h1 className="font-display font-black text-white text-5xl md:text-7xl leading-[1] tracking-tight mt-6 max-w-4xl">
            Aprende con quien <span className="text-[#E500FF]">implementa de verdad.</span>
          </h1>
          <p className="mt-8 text-muted-strato text-lg md:text-xl max-w-2xl leading-relaxed">
            Cursos intensivos de SAP e IA impartidos por consultores en proyecto. Laboratorios reales, certificacion de participacion y comunidad activa.
          </p>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: GraduationCap, k: "12+", v: "Cursos activos" },
              { icon: Users, k: "3.400", v: "Egresados" },
              { icon: Award, k: "94%", v: "Satisfaccion" },
              { icon: Clock, k: "Live", v: "Sesiones semanales" },
            ].map(({ icon: I, k, v }, i) => (
              <div key={i} className="border-l border-strato pl-4">
                <I size={20} className="text-[#E500FF] mb-3" />
                <div className="font-display font-black text-white text-2xl md:text-3xl">{k}</div>
                <div className="font-mono-strato text-[10px] tracking-[0.25em] uppercase text-muted-strato mt-1">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-6 lg:px-10 py-16">
        <div className="flex gap-3 mb-10 flex-wrap">
          {[{ k: "all", l: "Todos" }, { k: "sap", l: "SAP" }, { k: "ia", l: "IA" }].map((f) => (
            <button
              key={f.k}
              onClick={() => setFilter(f.k)}
              data-testid={`academy-filter-${f.k}`}
              className={`px-5 py-2 font-mono-strato text-[11px] tracking-[0.25em] uppercase border transition-colors ${
                filter === f.k ? "bg-[#E500FF] border-[#E500FF] text-white" : "border-strato-hi text-white/70 hover:border-[#E500FF] hover:text-[#E500FF]"
              }`}
            >{f.l}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <div key={c.id} className="border border-strato bg-[#0A0A11] flex flex-col group hover:border-[#E500FF]/60 transition-colors" data-testid={`academy-course-${c.id}`}>
              <div className="img-hover aspect-[16/10] bg-[#0F0F14]">
                <img src={c.cover_image} alt={c.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono-strato text-[10px] tracking-[0.25em] uppercase text-[#E500FF]">{c.level}</span>
                  <span className="w-1 h-1 bg-muted-strato rounded-full" />
                  <span className="font-mono-strato text-[10px] tracking-[0.25em] uppercase text-muted-strato">{c.duration}</span>
                </div>
                <h3 className="font-display font-bold text-white text-xl leading-snug">{c.title}</h3>
                <p className="text-sm text-muted-strato mt-3 flex-1">{c.description}</p>
                <div className="mt-6 pt-4 border-t border-strato flex items-center justify-between">
                  <span className="font-display font-black text-white text-2xl">${c.price.toFixed(0)}<span className="text-xs text-muted-strato font-normal ml-1">USD</span></span>
                  <button onClick={() => setSelected(c)} className="btn-primary text-xs" data-testid={`academy-enroll-${c.id}`}>Inscribirme</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelected(null)} data-testid="enroll-modal">
          <div className="bg-[#0A0A11] border border-strato-hi max-w-lg w-full p-8" onClick={(e) => e.stopPropagation()}>
            <div className="font-mono-strato text-[10px] tracking-[0.3em] uppercase text-[#E500FF] mb-3">/ Inscripcion</div>
            <h3 className="font-display font-bold text-white text-2xl mb-2">{selected.title}</h3>
            <p className="text-sm text-muted-strato mb-6">{selected.duration} &middot; ${selected.price.toFixed(0)} USD</p>
            <form onSubmit={submit} className="space-y-3">
              {[
                { k: "name", l: "Nombre completo", t: "text", r: true },
                { k: "email", l: "Correo", t: "email", r: true },
                { k: "phone", l: "Telefono (opcional)", t: "tel", r: false },
              ].map((f) => (
                <input key={f.k} type={f.t} placeholder={f.l} required={f.r} value={form[f.k]} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                  className="w-full bg-[#05050A] border border-strato px-4 py-3 text-white placeholder:text-white/40 focus:border-[#E500FF] focus:outline-none transition-colors"
                  data-testid={`enroll-input-${f.k}`}
                />
              ))}
              <textarea placeholder="Notas o preguntas (opcional)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3}
                className="w-full bg-[#05050A] border border-strato px-4 py-3 text-white placeholder:text-white/40 focus:border-[#E500FF] focus:outline-none transition-colors"
                data-testid="enroll-input-message"
              />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setSelected(null)} className="btn-ghost flex-1" data-testid="enroll-cancel">Cancelar</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-50" data-testid="enroll-submit">
                  {loading ? "Enviando..." : "Confirmar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
