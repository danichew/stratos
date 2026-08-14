import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Send } from "lucide-react";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { data } = await api.post("/subscribe", { email });
      if (data.status === "already_subscribed") {
        toast.info("Ya estas suscrito a Stratotos System");
      } else {
        toast.success("Suscripcion confirmada. Bienvenido al futuro.");
      }
      setEmail("");
    } catch (err) {
      toast.error("No pudimos completar tu suscripcion. Intenta de nuevo.");
    } finally { setLoading(false); }
  };

  return (
    <section id="newsletter" className="border-y border-strato bg-strato-surface" data-testid="newsletter-section">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="font-mono-strato text-[11px] tracking-[0.3em] uppercase text-[#00E5FF] mb-4">
            / Newsletter Semanal
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white leading-[1.05] tracking-tight">
            El tech que <span className="text-[#00E5FF]">mueve al mundo</span>, cada lunes en tu inbox.
          </h2>
          <p className="mt-6 text-muted-strato text-base max-w-lg leading-relaxed">
            Analisis curados de IA, SAP y los movimientos de las figuras que definen la industria. Sin ruido, sin relleno.
          </p>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4" data-testid="newsletter-form">
          <label className="font-mono-strato text-[10px] tracking-[0.3em] uppercase text-muted-strato">
            Tu correo
          </label>
          <div className="flex border border-strato-hi bg-[#05050A] focus-within:border-[#00E5FF] transition-colors">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@empresa.com"
              className="flex-1 bg-transparent px-4 py-4 text-white placeholder:text-white/30 focus:outline-none"
              data-testid="newsletter-email-input"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
              data-testid="newsletter-submit-btn"
            >
              {loading ? "Enviando..." : "Suscribirme"}
              <Send size={14} />
            </button>
          </div>
          <p className="font-mono-strato text-[10px] tracking-[0.2em] uppercase text-muted-strato">
            Cero spam. Cancela cuando quieras.
          </p>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
