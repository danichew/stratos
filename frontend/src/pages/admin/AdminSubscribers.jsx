import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AdminSubscribers() {
  const [items, setItems] = useState([]);
  useEffect(() => { (async () => {
    const { data } = await api.get("/admin/subscribers");
    setItems(data.items);
  })(); }, []);

  return (
    <div data-testid="admin-subscribers">
      <div className="font-mono-strato text-[11px] tracking-[0.3em] uppercase text-[#00E5FF]">/ Newsletter</div>
      <h1 className="font-display font-black text-white text-4xl mt-3 tracking-tight mb-8">Suscriptores ({items.length})</h1>

      <div className="border border-strato bg-[#0A0A11]">
        {items.map((s) => (
          <div key={s.id} className="flex justify-between px-6 py-4 border-b border-strato hover:bg-[#101018] transition-colors" data-testid={`sub-${s.id}`}>
            <div className="text-white">{s.email}</div>
            <div className="font-mono-strato text-[10px] text-muted-strato">{new Date(s.created_at).toLocaleString("es-ES")}</div>
          </div>
        ))}
        {items.length === 0 && <div className="p-8 text-center text-muted-strato">Sin suscriptores.</div>}
      </div>
    </div>
  );
}
