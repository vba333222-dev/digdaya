import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useContent } from './ContentContext';
import type { HomeService } from './siteContent';
import { Plus, X, Pencil, Trash2, Search, ChevronRight, Check } from 'lucide-react';

// ── Status Badge ──
function StatusBadge({ status }: { status: 'active' | 'draft' }) {
    return (
        <span className={`inline-block px-2.5 py-0.5 border text-[9px] font-mono tracking-[0.12em] uppercase ${status === 'active' ? 'border-emerald-500/30 text-emerald-400' : 'border-white/10 text-white/30'
            }`}>
            {status}
        </span>
    );
}

// ── Toast ──
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-[60] flex items-center gap-3 px-5 py-3 border border-emerald-500/30"
            style={{ background: '#161616' }}
        >
            <Check size={14} className="text-emerald-400" />
            <span className="text-[11px] font-mono text-white/80">{message}</span>
            <button onClick={onClose} className="text-white/30 hover:text-white ml-2"><X size={12} /></button>
        </motion.div>
    );
}

// ── Confirm Delete Modal ──
function DeleteModal({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70" onClick={onCancel} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm border border-white/10 p-6"
                style={{ background: '#111111' }}
            >
                <h3 className="text-[14px] font-black uppercase tracking-tight mb-2">Delete Service?</h3>
                <p className="text-[11px] font-mono text-white/40 mb-5">
                    This will permanently remove <span className="text-white/70">"{name}"</span> from the website.
                </p>
                <div className="flex gap-3">
                    <button onClick={onConfirm} className="flex-1 py-2.5 text-[10px] font-mono tracking-[0.12em] uppercase bg-red-600 hover:bg-red-700 text-white transition-colors text-center">Delete</button>
                    <button onClick={onCancel} className="flex-1 py-2.5 text-[10px] font-mono tracking-[0.12em] uppercase border border-white/10 text-white/40 hover:text-white/60 transition-colors text-center">Cancel</button>
                </div>
            </motion.div>
        </>
    );
}

// ── Slide-over Drawer ──
function ServiceDrawer({ service, isNew, onClose, onSave }: {
    service: HomeService; isNew: boolean; onClose: () => void; onSave: (s: HomeService) => void;
}) {
    const [form, setForm] = useState<HomeService>({ ...service });
    const [itemsText, setItemsText] = useState(service.items.join(', '));

    const handleSave = () => {
        onSave({ ...form, items: itemsText.split(',').map(s => s.trim()).filter(Boolean) });
    };

    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60" onClick={onClose} />
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="fixed top-0 right-0 h-full w-full max-w-lg z-50 border-l border-white/10 overflow-y-auto"
                style={{ background: '#111111' }}
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 sticky top-0" style={{ background: '#111111' }}>
                    <div>
                        <p className="text-[9px] font-mono tracking-[0.15em] uppercase text-white/30 mb-1">{isNew ? 'Create' : 'Edit'}</p>
                        <h2 className="text-[16px] font-black uppercase tracking-tight">{isNew ? 'New Service' : form.title.replace('\n', ' ')}</h2>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-colors">
                        <X size={14} />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-[9px] font-mono tracking-[0.15em] uppercase text-white/40 mb-2">Service Number</label>
                        <input type="text" value={form.num} onChange={e => setForm({ ...form, num: e.target.value })} placeholder="01"
                            className="w-full bg-transparent border border-white/10 px-4 py-3 text-[13px] font-mono text-white/80 placeholder:text-white/15 outline-none focus:border-[#F26522] focus:ring-0 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-[9px] font-mono tracking-[0.15em] uppercase text-white/40 mb-2">Title</label>
                        <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="HARDWARE & INFRA"
                            className="w-full bg-transparent border border-white/10 px-4 py-3 text-[13px] font-mono text-white/80 placeholder:text-white/15 outline-none focus:border-[#F26522] focus:ring-0 transition-colors" />
                        <span className="text-[9px] font-mono text-white/20 mt-1 block">Use \n for line break</span>
                    </div>
                    <div>
                        <label className="block text-[9px] font-mono tracking-[0.15em] uppercase text-white/40 mb-2">Description</label>
                        <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description..."
                            className="w-full bg-transparent border border-white/10 px-4 py-3 text-[13px] font-mono text-white/80 placeholder:text-white/15 outline-none focus:border-[#F26522] focus:ring-0 transition-colors resize-none" />
                    </div>
                    <div>
                        <label className="block text-[9px] font-mono tracking-[0.15em] uppercase text-white/40 mb-2">Items (comma-separated)</label>
                        <textarea rows={2} value={itemsText} onChange={e => setItemsText(e.target.value)} placeholder="Semiconductor, Computer Assembly, ..."
                            className="w-full bg-transparent border border-white/10 px-4 py-3 text-[13px] font-mono text-white/80 placeholder:text-white/15 outline-none focus:border-[#F26522] focus:ring-0 transition-colors resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[9px] font-mono tracking-[0.15em] uppercase text-white/40 mb-2">Accent Color</label>
                            <input type="text" value={form.accent} onChange={e => setForm({ ...form, accent: e.target.value })} placeholder="#F26522"
                                className="w-full bg-transparent border border-white/10 px-4 py-3 text-[13px] font-mono text-white/80 placeholder:text-white/15 outline-none focus:border-[#F26522] focus:ring-0 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[9px] font-mono tracking-[0.15em] uppercase text-white/40 mb-2">Cloudinary Image ID</label>
                            <input type="text" value={form.imageId} onChange={e => setForm({ ...form, imageId: e.target.value })} placeholder="r9oezyka89xjs8gnnnoc"
                                className="w-full bg-transparent border border-white/10 px-4 py-3 text-[13px] font-mono text-white/80 placeholder:text-white/15 outline-none focus:border-[#F26522] focus:ring-0 transition-colors" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                        <button onClick={handleSave} className="flex-1 py-3 text-[11px] font-mono tracking-[0.12em] uppercase text-white bg-[#F26522] hover:bg-[#d4550f] transition-colors text-center">
                            {isNew ? 'Create Service' : 'Save Changes'}
                        </button>
                        <button onClick={onClose} className="px-6 py-3 text-[11px] font-mono tracking-[0.12em] uppercase text-white/40 border border-white/10 hover:border-white/30 hover:text-white/60 transition-colors">Cancel</button>
                    </div>
                </div>
            </motion.div>
        </>
    );
}

// ── SERVICES MANAGER ───────────────────────────
export function ServicesManager() {
    const { content, updateHomeServices } = useContent();
    const services = content.homeServices;

    const [selected, setSelected] = useState<{ service: HomeService; isNew: boolean } | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<HomeService | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

    const handleSave = (s: HomeService) => {
        const newNum = s.num || String(services.length + 1).padStart(2, '0');
        const updated = { ...s, num: newNum };
        if (selected?.isNew) {
            updateHomeServices([...services, updated]);
        } else {
            updateHomeServices(services.map(x => x.num === selected?.service.num ? updated : x));
        }
        setSelected(null);
        showToast(selected?.isNew ? 'Service created & published' : 'Service updated & published');
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        updateHomeServices(services.filter(s => s.num !== deleteTarget.num));
        setDeleteTarget(null);
        showToast('Service removed from website');
    };

    const filtered = services.filter(s =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase())
    );

    const emptyService: HomeService = { num: '', title: '', items: [], accent: '#F26522', description: '', imageId: '' };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-[28px] md:text-[36px] font-black uppercase tracking-tight leading-none" style={{ fontFamily: "'Archivo Black', sans-serif" }}>Services</h1>
                    <p className="text-[11px] font-mono tracking-[0.1em] text-white/30 uppercase mt-1.5">
                        {services.length} services · Live on website
                    </p>
                </div>
                <button onClick={() => setSelected({ service: emptyService, isNew: true })} className="flex items-center gap-2 px-5 py-3 bg-[#F26522] hover:bg-[#d4550f] text-[11px] font-mono tracking-[0.12em] uppercase text-white transition-colors shrink-0">
                    <Plus size={14} /> Add Service
                </button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 border border-white/10 px-3 py-2">
                <Search size={13} className="text-white/30" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search services..."
                    className="bg-transparent text-[11px] font-mono text-white/70 placeholder:text-white/20 outline-none w-full" />
            </div>

            {/* Table */}
            <div className="border border-white/10" style={{ background: '#161616' }}>
                <div className="grid grid-cols-[40px_1fr_2fr_100px_60px] gap-4 px-5 py-3 border-b border-white/10">
                    <span className="text-[9px] font-mono tracking-[0.15em] uppercase text-white/20">#</span>
                    <span className="text-[9px] font-mono tracking-[0.15em] uppercase text-white/20">Title</span>
                    <span className="text-[9px] font-mono tracking-[0.15em] uppercase text-white/20">Capabilities</span>
                    <span className="text-[9px] font-mono tracking-[0.15em] uppercase text-white/20">Status</span>
                    <span className="text-[9px] font-mono tracking-[0.15em] uppercase text-white/20 text-right">Edit</span>
                </div>
                {filtered.map((service) => (
                    <div key={service.num} className="grid grid-cols-[40px_1fr_2fr_100px_60px] gap-4 px-5 py-4 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors items-center group">
                        <span className="text-[11px] font-mono text-[#F26522]/60">{service.num}</span>
                        <div className="min-w-0">
                            <span className="text-[12px] font-mono text-white/80 truncate block">{service.title.replace('\n', ' ')}</span>
                            <span className="text-[9px] font-mono text-white/25 truncate block mt-0.5">{service.description.slice(0, 50)}...</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {service.items.slice(0, 3).map(item => (
                                <span key={item} className="text-[8px] font-mono tracking-[0.1em] uppercase border border-white/[0.06] text-white/30 px-1.5 py-0.5">{item}</span>
                            ))}
                            {service.items.length > 3 && <span className="text-[8px] font-mono text-white/20">+{service.items.length - 3}</span>}
                        </div>
                        <StatusBadge status="active" />
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setSelected({ service, isNew: false })} className="p-1.5 text-white/30 hover:text-[#F26522] transition-colors" title="Edit"><Pencil size={12} /></button>
                            <button onClick={() => setDeleteTarget(service)} className="p-1.5 text-white/30 hover:text-red-400 transition-colors" title="Delete"><Trash2 size={12} /></button>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="px-5 py-12 text-center text-[11px] font-mono text-white/20">No services match your search.</div>
                )}
            </div>

            {/* Info */}
            <div className="flex items-center gap-2 px-4 py-3 border border-white/[0.06]" style={{ background: '#0D0D0D' }}>
                <ChevronRight size={11} className="text-[#F26522]/40" />
                <span className="text-[10px] font-mono text-white/25">Changes are saved instantly and reflected on the live website.</span>
            </div>

            <AnimatePresence>
                {selected && <ServiceDrawer service={selected.service} isNew={selected.isNew} onClose={() => setSelected(null)} onSave={handleSave} />}
            </AnimatePresence>
            <AnimatePresence>
                {deleteTarget && <DeleteModal name={deleteTarget.title.replace('\n', ' ')} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
            </AnimatePresence>
            <AnimatePresence>
                {toast && <Toast message={toast} onClose={() => setToast(null)} />}
            </AnimatePresence>
        </div>
    );
}
