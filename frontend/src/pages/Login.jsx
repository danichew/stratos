import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/Logo";
import { Lock } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await login(email, password);
      toast.success("Bienvenido, admin.");
      nav("/admin");
    } catch (err) {
      const detail = err?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Credenciales invalidas");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12" data-testid="login-page">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-10"><Logo /></div>
        <div className="border border-strato-hi bg-[#0A0A11] p-10">
          <div className="flex items-center gap-3 mb-8">
            <Lock size={20} className="text-[#00E5FF]" />
            <h1 className="font-display font-bold text-white text-2xl">Acceso Administrativo</h1>
          </div>
          <form onSubmit={submit} className="space-y-5" data-testid="login-form">
            <div>
              <label className="font-mono-strato text-[10px] tracking-[0.3em] uppercase text-muted-strato">Correo</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 bg-[#05050A] border border-strato px-4 py-3 text-white focus:border-[#00E5FF] focus:outline-none transition-colors"
                data-testid="login-email"
              />
            </div>
            <div>
              <label className="font-mono-strato text-[10px] tracking-[0.3em] uppercase text-muted-strato">Contraseña</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 bg-[#05050A] border border-strato px-4 py-3 text-white focus:border-[#00E5FF] focus:outline-none transition-colors"
                data-testid="login-password"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50" data-testid="login-submit">
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
          <Link to="/" className="block text-center mt-6 font-mono-strato text-[10px] tracking-[0.25em] uppercase text-muted-strato hover:text-[#00E5FF]">
            &larr; Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  );
}
