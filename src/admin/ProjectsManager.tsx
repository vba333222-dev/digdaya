import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useContent } from './ContentContext';
import type { Project } from './siteContent';
import { Plus, X, ExternalLink, Search, Filter, Pencil, Trash2, Check } from 'lucide-react';

// ── Badges ──
function CategoryBadge({ category }: { category: string }) {
    return (
        <span className="inline-block px-2.5 py-0.5 border border-white/10 text-[9px] font-mono tracking-[0.12em] uppercase text-white/50">
            {category}
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

const emptyProject: Project = {
    id: '', title: '', category: 'Platform', tags: [], year: String(new Date().getFullYear()), desc: '',
    accent: '#1a1a2e', accentText: '#4f6bff', featured: false,
};

// ── Project Modal ──
function ProjectModal({ project, isNew, onClose, onSave }: {
    project: Project; isNew: boolean; onClose: () => void; onSave: (p: Project) => void;
}) {
    const [form, setForm] = useState<Project>({ ...project });
    const [tagsText, setTagsText] = useState(project.tags.join(', '));

    const handleSave = () => {
        onSave({
            ...form,
            id: form.id || String(Date.now()).slice(-4),
            tags: tagsText.split(',').map(s => s.trim()).filter(Boolean),
        });
    };

    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-xl border border-white/10 max-h-[85vh] overflow-y-auto"
                style={{ background: '#111111' }}
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 sticky top-0" style={{ background: '#111111' }}>
                    <div>
                        <p className="text-[9px] font-mono tracking-[0.15em] uppercase text-white/30 mb-1">{isNew ? 'Create Project' : 'Edit Project'}</p>
                        <h2 className="text-[16px] font-black uppercase tracking-tight">{isNew ? 'New Project' : form.title}</h2>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-colors">
                        <X size={14} />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-[9px] font-mono tracking-[0.15em] uppercase text-white/40 mb-2">Project Title</label>
                        <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Nexus B2B Portal"
                            className="w-full bg-transparent border border-white/10 px-4 py-3 text-[13px] font-mono text-white/80 placeholder:text-white/15 outline-none focus:border-[#F26522] focus:ring-0 transition-colors" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[9px] font-mono tracking-[0.15em] uppercase text-white/40 mb-2">Category</label>
                            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                                className="w-full bg-transparent border border-white/10 px-4 py-3 text-[13px] font-mono text-white/80 outline-none focus:border-[#F26522] focus:ring-0 transition-colors">
                                <option value="Platform" className="bg-[#111]">Platform</option>
                                <option value="System" className="bg-[#111]">System</option>
                                <option value="Interface" className="bg-[#111]">Interface</option>
                                <option value="Identity" className="bg-[#111]">Identity</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[9px] font-mono tracking-[0.15em] uppercase text-white/40 mb-2">Year</label>
                            <input type="text" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })}
                                className="w-full bg-transparent border border-white/10 px-4 py-3 text-[13px] font-mono text-white/80 outline-none focus:border-[#F26522] focus:ring-0 transition-colors" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[9px] font-mono tracking-[0.15em] uppercase text-white/40 mb-2">Tags (comma-separated)</label>
                        <input type="text" value={tagsText} onChange={e => setTagsText(e.target.value)} placeholder="e.g. React, Node.js, Cloud"
                            className="w-full bg-transparent border border-white/10 px-4 py-3 text-[13px] font-mono text-white/80 placeholder:text-white/15 outline-none focus:border-[#F26522] focus:ring-0 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-[9px] font-mono tracking-[0.15em] uppercase text-white/40 mb-2">Description</label>
                        <textarea rows={3} value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="Project summary..."
                            className="w-full bg-transparent border border-white/10 px-4 py-3 text-[13px] font-mono text-white/80 placeholder:text-white/15 outline-none focus:border-[#F26522] focus:ring-0 transition-colors resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[9px] font-mono tracking-[0.15em] uppercase text-white/40 mb-2">Accent Color</label>
                            <input type="text" value={form.accent} onChange={e => setForm({ ...form, accent: e.target.value })} placeholder="#1a1a2e"
                                className="w-full bg-transparent border border-white/10 px-4 py-3 text-[13px] font-mono text-white/80 placeholder:text-white/15 outline-none focus:border-[#F26522] focus:ring-0 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[9px] font-mono tracking-[0.15em] uppercase text-white/40 mb-2">Accent Text</label>
                            <input type="text" value={form.accentText} onChange={e => setForm({ ...form, accentText: e.target.value })} placeholder="#4f6bff"
                                className="w-full bg-transparent border border-white/10 px-4 py-3 text-[13px] font-mono text-white/80 placeholder:text-white/15 outline-none focus:border-[#F26522] focus:ring-0 transition-colors" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 border border-white/10 p-4">
                        <button onClick={() => setForm({ ...form, featured: !form.featured })}
                            className={`w-10 h-5 border transition-colors relative ${form.featured ? 'bg-[#F26522] border-[#F26522]' : 'bg-transparent border-white/20'}`}>
                            <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white transition-all ${form.featured ? 'left-[calc(100%-18px)]' : 'left-0.5'}`} />
                        </button>
                        <span className="text-[11px] font-mono text-white/60">Featured project</span>
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                        <button onClick={handleSave} className="flex-1 py-3 text-[11px] font-mono tracking-[0.12em] uppercase text-white bg-[#F26522] hover:bg-[#d4550f] transition-colors text-center">
                            {isNew ? 'Create & Publish' : 'Save & Publish'}
                        </button>
                        <button onClick={onClose} className="px-6 py-3 text-[11px] font-mono tracking-[0.12em] uppercase text-white/40 border border-white/10 hover:border-white/30 hover:text-white/60 transition-colors">Cancel</button>
                    </div>
                </div>
            </motion.div>
        </>
    );
}

// ── PROJECTS MANAGER ───────────────────────────
export function ProjectsManager() {
    const { content, updateProjects } = useContent();
    const projects = content.projects;

    const [selected, setSelected] = useState<{ project: Project; isNew: boolean } | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

    const handleSave = (p: Project) => {
        if (selected?.isNew) {
            updateProjects([...projects, p]);
        } else {
            updateProjects(projects.map(x => x.id === selected?.project.id ? p : x));
        }
        setSelected(null);
        showToast(selected?.isNew ? 'Project published to website' : 'Project updated on website');
    };

    const handleDelete = (id: string) => {
        updateProjects(projects.filter(p => p.id !== id));
        showToast('Project removed from website');
    };

    const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];

    const filtered = projects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase());
        const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
        return matchesSearch && matchesCat;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-[28px] md:text-[36px] font-black uppercase tracking-tight leading-none" style={{ fontFamily: "'Archivo Black', sans-serif" }}>Projects</h1>
                    <p className="text-[11px] font-mono tracking-[0.1em] text-white/30 uppercase mt-1.5">
                        {projects.length} total · {projects.filter(p => p.featured).length} featured · Live on website
                    </p>
                </div>
                <button onClick={() => setSelected({ project: emptyProject, isNew: true })} className="flex items-center gap-2 px-5 py-3 bg-[#F26522] hover:bg-[#d4550f] text-[11px] font-mono tracking-[0.12em] uppercase text-white transition-colors shrink-0">
                    <Plus size={14} /> Add Project
                </button>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 border border-white/10 px-3 py-2 flex-1">
                    <Search size={13} className="text-white/30" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..."
                        className="bg-transparent text-[11px] font-mono text-white/70 placeholder:text-white/20 outline-none w-full" />
                </div>
                <div className="flex items-center gap-1">
                    <Filter size={13} className="text-white/20 mr-1" />
                    {categories.map(s => (
                        <button key={s} onClick={() => setCategoryFilter(s)}
                            className={`px-3 py-2 text-[9px] font-mono tracking-[0.1em] uppercase border transition-colors ${categoryFilter === s ? 'border-[#F26522]/40 text-[#F26522]' : 'border-transparent text-white/30 hover:text-white/60'
                                }`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((project) => (
                    <div key={project.id} className="border border-white/10 group hover:border-white/20 transition-colors" style={{ background: '#161616' }}>
                        <div className="aspect-[16/10] w-full border-b border-white/10 relative overflow-hidden" style={{ background: project.accent }}>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[4rem] font-black leading-none" style={{ fontFamily: "'Archivo Black', sans-serif", color: `${project.accentText}20` }}>{project.id}</span>
                            </div>
                            {project.featured && (
                                <div className="absolute top-2 right-2 px-2 py-0.5 text-[8px] font-mono tracking-[0.15em] uppercase border" style={{ borderColor: '#F26522', color: '#F26522' }}>Featured</div>
                            )}
                            <div className="absolute inset-0 bg-[#F26522]/0 group-hover:bg-[#F26522]/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <ExternalLink size={18} className="text-[#F26522]/60" />
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            <div>
                                <h3 className="text-[13px] font-mono text-white/90 leading-tight group-hover:text-white transition-colors">{project.title}</h3>
                                <p className="text-[10px] font-mono text-white/30 mt-1">{project.year}</p>
                            </div>
                            <p className="text-[10px] font-mono text-white/20 leading-relaxed line-clamp-2">{project.desc}</p>
                            <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
                                <CategoryBadge category={project.category} />
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setSelected({ project, isNew: false })} className="p-1.5 text-white/30 hover:text-[#F26522] transition-colors" title="Edit"><Pencil size={12} /></button>
                                    <button onClick={() => handleDelete(project.id)} className="p-1.5 text-white/30 hover:text-red-400 transition-colors" title="Delete"><Trash2 size={12} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-full border border-white/10 p-12 text-center" style={{ background: '#161616' }}>
                        <p className="text-[11px] font-mono text-white/20">No projects match your criteria.</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selected && <ProjectModal project={selected.project} isNew={selected.isNew} onClose={() => setSelected(null)} onSave={handleSave} />}
            </AnimatePresence>
            <AnimatePresence>
                {toast && <Toast message={toast} onClose={() => setToast(null)} />}
            </AnimatePresence>
        </div>
    );
}
