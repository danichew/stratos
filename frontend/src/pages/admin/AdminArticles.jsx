import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Plus, Trash2, Pencil, X } from "lucide-react";

const EMPTY = { title: "", excerpt: "", content: "", category: "ia", cover_image: "", author: "Redaccion Stratotos", featured: false, published: true };

export default function AdminArticles() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await api.get("/admin/articles");
    setItems(data.items);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowForm(true); };
  const openEdit = (a) => {
    setEditing(a);
    setForm({ title: a.title, excerpt: a.excerpt, content: a.content, category: a.category, cover_image: a.cover_image, author: a.author, featured: !!a.featured, published: a.published !== false });
    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editing) {
        await api.put(`/admin/articles/${editing.id}`, form);
        toast.success("Noticia actualizada");
      } else {
        await api.post("/admin/articles", form);
        toast.success("Noticia creada");
      }
      setShowForm(false); load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Error al guardar");
    } finally { setLoading(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("Eliminar noticia?")) return;
    await api.delete(`/admin/articles/${id}`);
    toast.success("Noticia eliminada"); load();
  };

  return (
    <div data-testid="admin-articles">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="font-mono-strato text-[11px] tracking-[0.3em] uppercase text-[#00E5FF]">/ Contenido</div>
          <h1 className="font-display font-black text-white text-4xl mt-3 tracking-tight">Noticias</h1>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2" data-testid="admin-new-article">
          <Plus size={16} /> Nueva
        </button>
      </div>

      <div className="border border-strato bg-[#0A0A11]">
        <div className="grid grid-cols-[1fr_100px_120px_100px_100px] px-6 py-3 border-b border-strato font-mono-strato text-[10px] tracking-[0.25em] uppercase text-muted-strato">
          <div>Titulo</div><div>Categoria</div><div>Fecha</div><div>Estado</div><div>Acciones</div>
        </div>
        {items.map((a) => (
          <div key={a.id} className="grid grid-cols-[1fr_100px_120px_100px_100px] px-6 py-4 border-b border-strato items-center hover:bg-[#101018] transition-colors" data-testid={`admin-article-row-${a.id}`}>
            <div className="text-white truncate pr-4">{a.title}</div>
            <div className="font-mono-strato text-[10px] tracking-widest uppercase text-muted-strato">{a.category}</div>
            <div className="font-mono-strato text-[10px] text-muted-strato">{new Date(a.created_at).toLocaleDateString("es-ES")}</div>
            <div className="font-mono-strato text-[10px] uppercase tracking-widest">
              {a.featured ? <span className="text-[#00E5FF]">Destacada</span> : <span className="text-muted-strato">Normal</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(a)} className="p-2 text-white/70 hover:text-[#00E5FF]" data-testid={`edit-${a.id}`}><Pencil size={14} /></button>
              <button onClick={() => remove(a.id)} className="p-2 text-white/70 hover:text-red-400" data-testid={`delete-${a.id}`}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="p-8 text-center text-muted-strato">Sin noticias aun.</div>}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setShowForm(false)} data-testid="article-form-modal">
          <div className="bg-[#0A0A11] border border-strato-hi max-w-2xl w-full p-8 my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-white text-2xl">{editing ? "Editar" : "Nueva"} noticia</h2>
              <button onClick={() => setShowForm(false)} className="text-white/60 hover:text-white"><X /></button>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <Field label="Titulo"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} data-testid="form-title" /></Field>
              <Field label="Extracto"><textarea required rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className={inputCls} data-testid="form-excerpt" /></Field>
              <Field label="Contenido (usa doble salto de linea para parrafos)"><textarea required rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className={inputCls} data-testid="form-content" /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Categoria">
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls} data-testid="form-category">
                    <option value="ia">IA</option>
                    <option value="sap">SAP</option>
                    <option value="figuras">Figuras Tech</option>
                  </select>
                </Field>
                <Field label="Autor"><input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className={inputCls} data-testid="form-author" /></Field>
              </div>
              <Field label="URL imagen de portada"><input required type="url" value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} className={inputCls} placeholder="https://..." data-testid="form-cover" /></Field>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-white text-sm">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} data-testid="form-featured" /> Destacada
                </label>
                <label className="flex items-center gap-2 text-white text-sm">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} data-testid="form-published" /> Publicada
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost flex-1">Cancelar</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-50" data-testid="form-submit">
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full mt-2 bg-[#05050A] border border-strato px-4 py-2.5 text-white focus:border-[#00E5FF] focus:outline-none transition-colors";
const Field = ({ label, children }) => (
  <div>
    <label className="font-mono-strato text-[10px] tracking-[0.25em] uppercase text-muted-strato">{label}</label>
    {children}
  </div>
);
