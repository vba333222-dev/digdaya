import { useContent } from './ContentContext';
import { Link } from 'react-router-dom';
import { Wrench, FolderKanban, MessageSquare, ArrowUpRight, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';

// ── DASHBOARD OVERVIEW ─────────────────────────
export function DashboardOverview() {
    const { content } = useContent();
    const { homeServices, projects, messages, settings } = content;

    const unreadMessages = messages.filter(m => m.status === 'unread').length;
    const featuredProjects = projects.filter(p => p.featured).length;

    const metrics = [
        { label: 'Services', value: String(homeServices.length), sub: 'Live on homepage', color: '#F26522', icon: Wrench, link: '/admin/services' },
        { label: 'Projects', value: String(projects.length), sub: `${featuredProjects} featured`, color: '#4f8fff', icon: FolderKanban, link: '/admin/projects' },
        { label: 'Messages', value: String(messages.length), sub: `${unreadMessages} unread`, color: unreadMessages > 0 ? '#ef4444' : '#22c55e', icon: MessageSquare, link: '/admin/messages' },
        { label: 'Site Status', value: settings.maintenance ? 'Maintenance' : 'Online', sub: settings.siteName, color: settings.maintenance ? '#eab308' : '#22c55e', icon: Activity, link: '/admin/settings' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-[28px] md:text-[36px] font-black uppercase tracking-tight leading-none" style={{ fontFamily: "'Archivo Black', sans-serif" }}>Dashboard</h1>
                <p className="text-[11px] font-mono tracking-[0.1em] text-white/30 uppercase mt-1.5">
                    {settings.siteName} · Content Management
                </p>
            </div>

            {/* ── Metric Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map(m => (
                    <Link key={m.label} to={m.link} className="border border-white/10 p-5 hover:border-white/20 transition-colors group" style={{ background: '#161616' }}>
                        <div className="flex items-center justify-between mb-3">
                            <m.icon size={16} className="text-white/20" />
                            <ArrowUpRight size={12} className="text-white/10 group-hover:text-white/40 transition-colors" />
                        </div>
                        <p className="text-[28px] font-black tracking-tight leading-none mb-1" style={{ color: m.color }}>{m.value}</p>
                        <span className="text-[9px] font-mono tracking-[0.15em] uppercase text-white/30 block">{m.label}</span>
                        <span className="text-[9px] font-mono text-white/15 block mt-0.5">{m.sub}</span>
                    </Link>
                ))}
            </div>

            {/* ── Quick Actions ── */}
            <div className="border border-white/10 p-5" style={{ background: '#161616' }}>
                <h3 className="text-[10px] font-mono tracking-[0.15em] uppercase text-white/40 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: 'Add Service', link: '/admin/services', color: '#F26522' },
                        { label: 'Add Project', link: '/admin/projects', color: '#4f8fff' },
                        { label: 'View Messages', link: '/admin/messages', color: unreadMessages > 0 ? '#ef4444' : '#22c55e' },
                        { label: 'Site Settings', link: '/admin/settings', color: '#8A8A8A' },
                    ].map(a => (
                        <Link key={a.label} to={a.link}
                            className="flex items-center gap-2 px-4 py-3 border border-white/[0.06] text-[10px] font-mono tracking-[0.1em] uppercase text-white/40 hover:text-white hover:border-white/20 transition-colors">
                            <div className="w-1.5 h-1.5" style={{ background: a.color }} />
                            {a.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* ── Recent Messages ── */}
            <div className="border border-white/10" style={{ background: '#161616' }}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                    <h3 className="text-[10px] font-mono tracking-[0.15em] uppercase text-white/40">Recent Messages</h3>
                    <Link to="/admin/messages" className="text-[9px] font-mono text-[#F26522]/50 hover:text-[#F26522] transition-colors uppercase tracking-wider">View All →</Link>
                </div>
                <div className="divide-y divide-white/[0.04]">
                    {messages.slice(0, 4).map(msg => (
                        <div key={msg.id} className="flex items-start gap-4 px-5 py-4">
                            <div className="mt-0.5">
                                {msg.status === 'unread' ? <AlertTriangle size={13} className="text-amber-400" /> : <CheckCircle2 size={13} className="text-white/15" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-[11px] font-mono text-white/70 truncate">{msg.senderName}</span>
                                    <span className="text-[9px] font-mono text-white/20">— {msg.companyName}</span>
                                </div>
                                <p className="text-[10px] font-mono text-white/35 truncate">{msg.subject}</p>
                            </div>
                            <span className="text-[9px] font-mono text-white/15 shrink-0">
                                {new Date(msg.receivedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                    ))}
                    {messages.length === 0 && (
                        <div className="px-5 py-8 text-center text-[11px] font-mono text-white/20">No messages yet.</div>
                    )}
                </div>
            </div>

            {/* ── Content Summary ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-white/10 p-5" style={{ background: '#161616' }}>
                    <h3 className="text-[10px] font-mono tracking-[0.15em] uppercase text-white/40 mb-4">Homepage Services</h3>
                    <div className="space-y-2">
                        {homeServices.map(s => (
                            <div key={s.num} className="flex items-center gap-3 py-1.5">
                                <span className="text-[10px] font-mono text-[#F26522]/50 w-6">{s.num}</span>
                                <span className="text-[11px] font-mono text-white/60 flex-1 truncate">{s.title.replace('\n', ' ')}</span>
                                <span className="text-[9px] font-mono text-white/20">{s.items.length} items</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="border border-white/10 p-5" style={{ background: '#161616' }}>
                    <h3 className="text-[10px] font-mono tracking-[0.15em] uppercase text-white/40 mb-4">Active Projects</h3>
                    <div className="space-y-2">
                        {projects.slice(0, 5).map(p => (
                            <div key={p.id} className="flex items-center gap-3 py-1.5">
                                <div className="w-2 h-2" style={{ background: p.accentText }} />
                                <span className="text-[11px] font-mono text-white/60 flex-1 truncate">{p.title}</span>
                                <span className="text-[9px] font-mono text-white/20">{p.category}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
