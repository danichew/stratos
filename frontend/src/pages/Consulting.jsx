import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Check, Briefcase, Cloud, Cog, TrendingUp } from "lucide-react";

const services = [
  { icon: Cloud, title: "Implementacion S/4HANA", body: "Estrategia greenfield, brownfield o hibrida. Roadmap tecnico y funcional end-to-end." },
  { icon: Cog, title: "Migracion desde ECC", body: "Assessment Simplification Item, conversion y remediacion. Sin sorpresas de ultima hora." },
  { icon: TrendingUp, title: "Optimizacion de procesos", body: "Rediseño de flujos FI/CO/MM/SD con foco en KPIs medibles y automatizacion." },
  { icon: Briefcase, title: "SAP BTP & extensiones", body: "Desarrollo de apps cloud-native, integraciones y side-by-side con RAP/CAP." },
];

const benefits = [
  "Consultores senior con +15 años de experiencia real",
  "Metodologia hibrida SAP Activate + Agile",
  "Tarifas transparentes por sprint o entregable",
  "Cobertura LATAM y Europa con horarios flexibles",
];

export default function Consulting() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/leads", { ...form, interest: "consulting" });
      toast.success("Recibido. Un consultor senior te contactara en menos de 24h.");
      setForm({ name: "", email: "", phone: "", company: "", message: "" });
    } catch { toast.error("No pudimos enviar tu solicitud. Intenta de nuevo."); }
    finally { setLoading(false); }
  };

  return (
    <div data-testid="consulting-page">
      <section className="relative overflow-hidden border-b border-strato" style={{ background: "radial-gradient(800px 400px at 70% 20%, rgba(0,68,255,0.18), transparent 60%)" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-24 md:py-32">
          <div className="font-mono-strato text-[11px] tracking-[0.3em] uppercase text-[#6B8CFF]">/ Servicios / Consultoria SAP</div>
          <h1 className="font-display font-black text-white text-5xl md:text-7xl leading-[1] tracking-tight mt-6 max-w-4xl">
            SAP sin humo, <span className="text-[#6B8CFF]">solo resultados.</span>
          </h1>
          <p className="mt-8 text-muted-strato text-lg md:text-xl max-w-2xl leading-relaxed">
            Nos especializamos en llevar empresas medianas y grandes al ecosistema SAP moderno. Sin promesas rotas ni sobrecostos ocultos.
          </p>
          <a href="#contact" className="btn-primary inline-block mt-10" data-testid="consulting-hero-cta">Agendar diagnostico gratuito</a>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-6 lg:px-10 py-24">
        <div className="font-mono-strato text-[11px] tracking-[0.3em] uppercase text-[#6B8CFF] mb-4">/ Servicios</div>
        <h2 className="font-display font-black text-white text-4xl md:text-5xl tracking-tight max-w-3xl">Cuatro pilares. Un mismo estandar.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 mt-14 border border-strato">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="p-8 border-r border-b border-strato bg-[#0A0A11] hover:bg-[#101018] transition-colors" data-testid={`service-${i}`}>
                <Icon size={26} className="text-[#6B8CFF] mb-6" />
                <h3 className="font-display font-bold text-white text-xl leading-tight">{s.title}</h3>
                <p className="text-sm text-muted-strato mt-4 leading-relaxed">{s.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-strato bg-strato-surface">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-20 grid md:grid-cols-2 gap-14">
          <div>
            <div className="font-mono-strato text-[11px] tracking-[0.3em] uppercase text-[#00E5FF] mb-4">/ Por que Stratotos</div>
            <h2 className="font-display font-black text-white text-4xl md:text-5xl tracking-tight leading-[1.05]">La diferencia esta en el equipo.</h2>
            <ul className="mt-10 space-y-5">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-[#00E5FF] flex items-center justify-center shrink-0 mt-1"><Check size={14} className="text-black" strokeWidth={3} /></div>
                  <span className="text-white text-base md:text-lg">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div id="contact" className="border border-strato-hi bg-[#0A0A11] p-8">
            <div className="font-mono-strato text-[11px] tracking-[0.3em] uppercase text-[#00E5FF] mb-2">/ Contacto</div>
            <h3 className="font-display font-bold text-white text-2xl mb-6">Cuentanos tu proyecto</h3>
            <form onSubmit={submit} className="space-y-4" data-testid="consulting-form">
              {[
                { k: "name", label: "Nombre", type: "text", req: true },
                { k: "email", label: "Correo corporativo", type: "email", req: true },
                { k: "company", label: "Empresa", type: "text", req: false },
                { k: "phone", label: "Telefono", type: "tel", req: false },
              ].map((f) => (
                <div key={f.k}>
                  <label className="font-mono-strato text-[10px] tracking-[0.25em] uppercase text-muted-strato">{f.label}</label>
                  <input
                    type={f.type} required={f.req}
                    value={form[f.k]}
                    onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                    className="w-full mt-2 bg-[#05050A] border border-strato px-4 py-3 text-white focus:border-[#00E5FF] focus:outline-none transition-colors"
                    data-testid={`consulting-input-${f.k}`}
                  />
                </div>
              ))}
              <div>
                <label className="font-mono-strato text-[10px] tracking-[0.25em] uppercase text-muted-strato">Describenos tu reto</label>
                <textarea
                  required rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full mt-2 bg-[#05050A] border border-strato px-4 py-3 text-white focus:border-[#00E5FF] focus:outline-none transition-colors"
                  data-testid="consulting-input-message"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50" data-testid="consulting-submit-btn">
                {loading ? "Enviando..." : "Solicitar diagnostico"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
