import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AdminLeads() {
  const [items, setItems] = useState([]);
  useEffect(() => { (async () => {
    const { data } = await api.get("/admin/leads");
    setItems(data.items);
  })(); }, []);

  return (
    <div data-testid="admin-leads">
      <div className="font-mono-strato text-[11px] tracking-[0.3em] uppercase text-[#6B8CFF]">/ Leads</div>
      <h1 className="font-display font-black text-white text-4xl mt-3 tracking-tight mb-8">Solicitudes recibidas</h1>

      <div className="border border-strato bg-[#0A0A11]">
        <div className="hidden md:grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_2fr] px-6 py-3 border-b border-strato font-mono-strato text-[10px] tracking-[0.25em] uppercase text-muted-strato">
          <div>Nombre</div><div>Correo</div><div>Telefono</div><div>Empresa</div><div>Interes</div><div>Mensaje</div>
        </div>
        {items.map((l) => (
          <div key={l.id} className="grid grid-cols-1 md:grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_2fr] gap-2 md:gap-4 px-6 py-4 border-b border-strato hover:bg-[#101018] transition-colors" data-testid={`lead-${l.id}`}>
            <div className="text-white">{l.name}</div>
            <div className="text-white/80 text-sm">{l.email}</div>
            <div className="text-muted-strato text-sm">{l.phone || "-"}</div>
            <div className="text-muted-strato text-sm">{l.company || "-"}</div>
            <div><span className={`font-mono-strato text-[10px] tracking-widest uppercase ${l.interest === "consulting" ? "text-[#6B8CFF]" : "text-[#E500FF]"}`}>{l.interest}</span></div>
            <div className="text-muted-strato text-sm line-clamp-2">{l.message}</div>
          </div>
        ))}
        {items.length === 0 && <div className="p-8 text-center text-muted-strato">Aun no hay leads.</div>}
      </div>
    </div>
  );
}
