import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Plus, Trash2, Pencil, X } from "lucide-react";

const EMPTY = { title: "", description: "", level: "Basico", duration: "", price: 0, cover_image: "", category: "sap", instructor: "Instructor Stratotos", published: true };

export default function AdminCourses() {
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await api.get("/admin/courses");
    setItems(data.items);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setShow(true); };
  const openEdit = (c) => { setEditing(c); setForm({ ...c }); setShow(true); };

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editing) await api.put(`/admin/courses/${editing.id}`, payload);
      else await api.post("/admin/courses", payload);
      toast.success("Curso guardado"); setShow(false); load();
    } catch { toast.error("Error al guardar"); } finally { setLoading(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("Eliminar curso?")) return;
    await api.delete(`/admin/courses/${id}`); toast.success("Eliminado"); load();
  };

  return (
    <div data-testid="admin-courses">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="font-mono-strato text-[11px] tracking-[0.3em] uppercase text-[#E500FF]">/ Academia</div>
          <h1 className="font-display font-black text-white text-4xl mt-3 tracking-tight">Cursos</h1>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2" data-testid="admin-new-course">
          <Plus size={16} /> Nuevo curso
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((c) => (
          <div key={c.id} className="border border-strato bg-[#0A0A11] p-6" data-testid={`admin-course-${c.id}`}>
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1">
                <div className="font-mono-strato text-[10px] tracking-[0.25em] uppercase text-[#E500FF]">{c.category}</div>
                <h3 className="font-display font-bold text-white text-lg mt-2 leading-tight">{c.title}</h3>
                <div className="font-mono-strato text-[10px] tracking-widest uppercase text-muted-strato mt-2">
                  {c.level} &middot; {c.duration} &middot; ${c.price} USD
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => openEdit(c)} className="btn-ghost text-xs flex-1 flex items-center justify-center gap-2" data-testid={`edit-course-${c.id}`}><Pencil size={12} /> Editar</button>
              <button onClick={() => remove(c.id)} className="btn-ghost text-xs px-4 hover:!border-red-500 hover:!text-red-400" data-testid={`del-course-${c.id}`}><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>

      {show && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setShow(false)}>
          <div className="bg-[#0A0A11] border border-strato-hi max-w-xl w-full p-8 my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display font-bold text-white text-2xl">{editing ? "Editar" : "Nuevo"} curso</h2>
              <button onClick={() => setShow(false)}><X className="text-white/60" /></button>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <F label="Titulo"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={cls} /></F>
              <F label="Descripcion"><textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={cls} /></F>
              <div className="grid grid-cols-3 gap-4">
                <F label="Nivel">
                  <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className={cls}>
                    <option>Basico</option><option>Intermedio</option><option>Avanzado</option>
                  </select>
                </F>
                <F label="Duracion"><input required value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className={cls} placeholder="24 horas" /></F>
                <F label="Precio USD"><input required type="number" step="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={cls} /></F>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <F label="Categoria">
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={cls}>
                    <option value="sap">SAP</option><option value="ia">IA</option><option value="otros">Otros</option>
                  </select>
                </F>
                <F label="Instructor"><input value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} className={cls} /></F>
              </div>
              <F label="URL portada"><input required type="url" value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} className={cls} /></F>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShow(false)} className="btn-ghost flex-1">Cancelar</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-50">{loading ? "Guardando..." : "Guardar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const cls = "w-full mt-2 bg-[#05050A] border border-strato px-4 py-2.5 text-white focus:border-[#00E5FF] focus:outline-none transition-colors";
const F = ({ label, children }) => (<div><label className="font-mono-strato text-[10px] tracking-[0.25em] uppercase text-muted-strato">{label}</label>{children}</div>);
