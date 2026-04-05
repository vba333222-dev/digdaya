import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useContent } from './ContentContext';
import type { Message } from './siteContent';
import { Mail, MailOpen, Reply, Archive, Search, Filter, ArrowLeft, Clock, Building2, AlertTriangle } from 'lucide-react';

// ── Priority Badge ──
function PriorityDot({ priority }: { priority: Message['priority'] }) {
    const colors: Record<string, string> = { high: 'bg-red-500', medium: 'bg-amber-500', low: 'bg-white/20' };
    return <div className={`w-1.5 h-1.5 shrink-0 ${colors[priority]}`} title={priority} />;
}

function StatusLabel({ status }: { status: Message['status'] }) {
    const styles: Record<Message['status'], string> = {
        unread: 'border-sky-500/30 text-sky-400',
        read: 'border-white/10 text-white/30',
        replied: 'border-emerald-500/30 text-emerald-400',
        archived: 'border-white/5 text-white/15',
    };
    return (
        <span className={`inline-block px-2 py-0.5 border text-[8px] font-mono tracking-[0.12em] uppercase ${styles[status]}`}>
            {status}
        </span>
    );
}

// ── Message Detail View ──
function MessageDetail({ message, onClose, onUpdateStatus }: {
    message: Message;
    onClose: () => void;
    onUpdateStatus: (id: string, status: Message['status']) => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-0"
        >
            <div className="flex items-center justify-between mb-5">
                <button onClick={onClose} className="flex items-center gap-2 text-[10px] font-mono tracking-[0.1em] uppercase text-white/40 hover:text-white transition-colors">
                    <ArrowLeft size={14} /> Back to Inbox
                </button>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onUpdateStatus(message.id, 'replied')}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 text-[9px] font-mono tracking-[0.1em] uppercase text-white/40 hover:text-[#F26522] hover:border-[#F26522]/30 transition-colors"
                    >
                        <Reply size={12} /> Reply
                    </button>
                    <button
                        onClick={() => onUpdateStatus(message.id, 'archived')}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 text-[9px] font-mono tracking-[0.1em] uppercase text-white/40 hover:text-white/60 transition-colors"
                    >
                        <Archive size={12} /> Archive
                    </button>
                </div>
            </div>

            <div className="border border-white/10" style={{ background: '#161616' }}>
                <div className="px-6 py-5 border-b border-white/10">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <h2 className="text-[16px] font-black uppercase tracking-tight leading-tight mb-2">{message.subject}</h2>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-[11px] font-mono text-white/70">{message.senderName}</span>
                                <span className="text-[10px] font-mono text-white/25">&lt;{message.senderEmail}&gt;</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                            <StatusLabel status={message.status} />
                            <PriorityDot priority={message.priority} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-5 px-6 py-3 border-b border-white/[0.05]" style={{ background: '#131313' }}>
                    <div className="flex items-center gap-1.5">
                        <Building2 size={11} className="text-white/25" />
                        <span className="text-[10px] font-mono text-white/40">{message.companyName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock size={11} className="text-white/25" />
                        <span className="text-[10px] font-mono text-white/40">{new Date(message.receivedAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {message.priority === 'high' && (
                        <div className="flex items-center gap-1.5">
                            <AlertTriangle size={11} className="text-red-400" />
                            <span className="text-[10px] font-mono text-red-400/70 uppercase tracking-wider">High Priority</span>
                        </div>
                    )}
                </div>

                <div className="px-6 py-6">
                    <pre className="text-[13px] font-mono text-white/60 leading-relaxed whitespace-pre-wrap">{message.body}</pre>
                </div>

                <div className="px-6 py-5 border-t border-white/10">
                    <label className="block text-[9px] font-mono tracking-[0.15em] uppercase text-white/30 mb-2">Quick Reply</label>
                    <textarea rows={3} placeholder="Type your reply..."
                        className="w-full bg-transparent border border-white/10 px-4 py-3 text-[13px] font-mono text-white/80 placeholder:text-white/15 outline-none focus:border-[#F26522] focus:ring-0 transition-colors resize-none" />
                    <div className="flex justify-end mt-3">
                        <button className="px-5 py-2.5 bg-[#F26522] hover:bg-[#d4550f] text-[10px] font-mono tracking-[0.12em] uppercase text-white transition-colors">
                            Send Reply
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ── MESSAGES MANAGER ───────────────────────────
export function MessagesManager() {
    const { content, updateMessages } = useContent();
    const messages = content.messages;

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const handleUpdateStatus = (id: string, status: Message['status']) => {
        updateMessages(messages.map(m => m.id === id ? { ...m, status } : m));
    };

    const handleOpen = (msg: Message) => {
        if (msg.status === 'unread') handleUpdateStatus(msg.id, 'read');
        setSelectedId(msg.id);
    };

    const filtered = messages.filter(m => {
        const matchesSearch = m.subject.toLowerCase().includes(search.toLowerCase()) ||
            m.senderName.toLowerCase().includes(search.toLowerCase()) ||
            m.companyName.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const selected = messages.find(m => m.id === selectedId) || null;
    const unreadCount = messages.filter(m => m.status === 'unread').length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-[28px] md:text-[36px] font-black uppercase tracking-tight leading-none" style={{ fontFamily: "'Archivo Black', sans-serif" }}>Messages</h1>
                <p className="text-[11px] font-mono tracking-[0.1em] text-white/30 uppercase mt-1.5">
                    {messages.length} total · {unreadCount} unread
                </p>
            </div>

            <AnimatePresence mode="wait">
                {selected ? (
                    <MessageDetail
                        key="detail"
                        message={selected}
                        onClose={() => setSelectedId(null)}
                        onUpdateStatus={handleUpdateStatus}
                    />
                ) : (
                    <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex items-center gap-2 border border-white/10 px-3 py-2 flex-1">
                                <Search size={13} className="text-white/30" />
                                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..."
                                    className="bg-transparent text-[11px] font-mono text-white/70 placeholder:text-white/20 outline-none w-full" />
                            </div>
                            <div className="flex items-center gap-1">
                                <Filter size={13} className="text-white/20 mr-1" />
                                {['all', 'unread', 'read', 'replied', 'archived'].map(s => (
                                    <button key={s} onClick={() => setStatusFilter(s)}
                                        className={`px-3 py-2 text-[9px] font-mono tracking-[0.1em] uppercase border transition-colors ${statusFilter === s ? 'border-[#F26522]/40 text-[#F26522]' : 'border-transparent text-white/30 hover:text-white/60'
                                            }`}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="border border-white/10 divide-y divide-white/[0.04]" style={{ background: '#161616' }}>
                            {filtered.map(msg => (
                                <button
                                    key={msg.id}
                                    onClick={() => handleOpen(msg)}
                                    className={`w-full text-left px-5 py-4 hover:bg-white/[0.02] transition-colors flex items-start gap-4 group ${msg.status === 'unread' ? 'bg-white/[0.01]' : ''
                                        }`}
                                >
                                    <div className="mt-1.5 shrink-0">
                                        {msg.status === 'unread' ? <Mail size={15} className="text-sky-400" /> : <MailOpen size={15} className="text-white/20" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-3 mb-1">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <PriorityDot priority={msg.priority} />
                                                <span className={`text-[12px] font-mono truncate ${msg.status === 'unread' ? 'text-white' : 'text-white/60'}`}>
                                                    {msg.senderName}
                                                </span>
                                                <span className="text-[10px] font-mono text-white/20 hidden sm:inline">— {msg.companyName}</span>
                                            </div>
                                            <span className="text-[9px] font-mono text-white/20 shrink-0 whitespace-nowrap">
                                                {new Date(msg.receivedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <p className={`text-[11px] font-mono truncate ${msg.status === 'unread' ? 'text-white/80' : 'text-white/40'}`}>
                                            {msg.subject}
                                        </p>
                                        <p className="text-[10px] font-mono text-white/20 truncate mt-0.5">{msg.body.slice(0, 100)}...</p>
                                    </div>
                                    <div className="shrink-0 mt-1"><StatusLabel status={msg.status} /></div>
                                </button>
                            ))}
                            {filtered.length === 0 && (
                                <div className="px-5 py-12 text-center text-[11px] font-mono text-white/20">No messages match your filters.</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
