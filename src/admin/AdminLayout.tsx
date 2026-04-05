import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
    LayoutDashboard,
    Wrench,
    FolderKanban,
    MessageSquare,
    Settings,
    Search,
    ChevronRight,
    Menu,
    X,
    LogOut,
    BarChart3,
} from 'lucide-react';

// ── Sidebar Navigation Items ──
const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true, badge: 0 },
    { to: '/admin/services', label: 'Services / KBLI', icon: Wrench, badge: 0 },
    { to: '/admin/projects', label: 'Projects', icon: FolderKanban, badge: 0 },
    { to: '/admin/messages', label: 'Messages', icon: MessageSquare, badge: 3 },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3, badge: 0 },
    { to: '/admin/settings', label: 'Settings', icon: Settings, badge: 0 },
];

// ── Breadcrumb Generator ──
function Breadcrumbs() {
    const location = useLocation();
    const segments = location.pathname.split('/').filter(Boolean);

    return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-mono tracking-[0.1em] uppercase">
            {segments.map((seg, i) => (
                <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && <ChevronRight size={10} className="text-white/20" />}
                    <span className={i === segments.length - 1 ? 'text-[#F26522]' : 'text-white/40'}>
                        {seg.replace(/-/g, ' ')}
                    </span>
                </span>
            ))}
        </nav>
    );
}

// ── Main Admin Layout ──
export function AdminLayout() {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div data-admin className="flex h-screen w-full overflow-hidden" style={{ background: '#090909', color: '#FFFFFF' }}>

            {/* ── Mobile overlay ── */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* ══════════════════════════════════════
                LEFT SIDEBAR
            ══════════════════════════════════════ */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-50
                    w-64 flex flex-col border-r border-white/10
                    transition-transform duration-300 lg:translate-x-0
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
                style={{ background: '#0D0D0D' }}
            >
                {/* Logo Block */}
                <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 flex items-center justify-center" style={{ background: '#F26522' }}>
                            <span className="text-[10px] font-black text-white tracking-wider">DT</span>
                        </div>
                        <div>
                            <span className="text-[13px] font-black tracking-[0.06em] uppercase block leading-none">DIGDAYA</span>
                            <span className="text-[8px] font-mono tracking-[0.2em] text-white/30 uppercase block">Admin Console</span>
                        </div>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/40 hover:text-white">
                        <X size={18} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 text-[12px] font-mono tracking-[0.08em] uppercase transition-colors duration-200 border border-transparent ${isActive
                                    ? 'text-[#F26522] bg-[#F26522]/5 border-[#F26522]/20'
                                    : 'text-white/50 hover:text-white hover:bg-white/[0.03]'
                                }`
                            }
                        >
                            <item.icon size={16} strokeWidth={1.5} />
                            <span className="flex-1">{item.label}</span>
                            {item.badge > 0 && (
                                <span className="w-4 h-4 flex items-center justify-center text-[8px] font-mono bg-[#F26522] text-white">{item.badge}</span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom profile */}
                <div className="border-t border-white/10 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center border border-white/20 text-[10px] font-mono text-white/60">
                            AD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-mono text-white/80 truncate">admin@digdaya.id</p>
                            <p className="text-[9px] font-mono text-white/30 uppercase tracking-wider">Super Admin</p>
                        </div>
                        <button className="text-white/30 hover:text-[#F26522] transition-colors" title="Logout">
                            <LogOut size={14} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* ══════════════════════════════════════
                MAIN AREA
            ══════════════════════════════════════ */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* ── Top Header ── */}
                <header className="h-16 flex items-center justify-between px-5 lg:px-8 border-b border-white/10 shrink-0" style={{ background: '#0D0D0D' }}>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/50 hover:text-white">
                            <Menu size={20} />
                        </button>
                        <Breadcrumbs />
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="hidden md:flex items-center gap-2 border border-white/10 px-3 py-1.5">
                            <Search size={13} className="text-white/30" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-transparent text-[11px] font-mono text-white/70 placeholder:text-white/20 outline-none w-40 focus:w-56 transition-all duration-300"
                            />
                        </div>

                        {/* Status indicator */}
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider hidden sm:block">System Online</span>
                        </div>
                    </div>
                </header>

                {/* ── Content Area ── */}
                <main className="flex-1 overflow-y-auto p-5 lg:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
