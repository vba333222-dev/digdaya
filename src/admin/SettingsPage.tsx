import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useContent } from './ContentContext';
import type { SiteSettings } from './siteContent';
import { Globe, User, Search as SearchIcon, Palette, Save, Check, X, Plus, Trash2, RotateCcw } from 'lucide-react';

const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'seo', label: 'SEO', icon: SearchIcon },
    { id: 'appearance', label: 'Appearance', icon: Palette },
] as const;

type TabId = typeof tabs[number]['id'];

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

function Field({ label, value, onChange, type = 'text', placeholder = '' }: {
    label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
    return (
        <div>
            <label className="block text-[9px] font-mono tracking-[0.15em] uppercase text-white/40 mb-2">{label}</label>
            <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                className="w-full bg-transparent border border-white/10 px-4 py-3 text-[13px] font-mono text-white/80 placeholder:text-white/15 outline-none focus:border-[#F26522] focus:ring-0 transition-colors" />
        </div>
    );
}

// ── General Tab ──
function GeneralTab({ settings, onChange }: { settings: SiteSettings; onChange: (s: SiteSettings) => void }) {
    return (
        <div className="space-y-5">
            <Field label="Site Name" value={settings.siteName} onChange={v => onChange({ ...settings, siteName: v })} />
            <Field label="Site URL" value={settings.siteUrl} onChange={v => onChange({ ...settings, siteUrl: v })} />
            <Field label="Tagline" value={settings.tagline} onChange={v => onChange({ ...settings, tagline: v })} />
            <Field label="Contact Email" value={settings.contactEmail} onChange={v => onChange({ ...settings, contactEmail: v })} type="email" />
            <Field label="Phone Number" value={settings.phoneNumber} onChange={v => onChange({ ...settings, phoneNumber: v })} />
            <div>
                <label className="block text-[9px] font-mono tracking-[0.15em] uppercase text-white/40 mb-2">Address</label>
                <textarea rows={3} value={settings.address} onChange={e => onChange({ ...settings, address: e.target.value })}
                    className="w-full bg-transparent border border-white/10 px-4 py-3 text-[13px] font-mono text-white/80 outline-none focus:border-[#F26522] focus:ring-0 transition-colors resize-none" />
            </div>

            {/* Social Links */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-[9px] font-mono tracking-[0.15em] uppercase text-white/40">Social Links</label>
                    <button onClick={() => onChange({ ...settings, socialLinks: [...settings.socialLinks, { platform: '', url: '' }] })}
                        className="text-[9px] font-mono text-[#F26522]/60 hover:text-[#F26522] transition-colors flex items-center gap-1">
                        <Plus size={10} /> Add
                    </button>
                </div>
                <div className="space-y-2">
                    {settings.socialLinks.map((link, i) => (
                        <div key={i} className="flex gap-2">
                            <input type="text" value={link.platform} onChange={e => {
                                const links = [...settings.socialLinks];
                                links[i] = { ...links[i], platform: e.target.value };
                                onChange({ ...settings, socialLinks: links });
                            }} placeholder="Platform"
                                className="w-32 bg-transparent border border-white/10 px-3 py-2 text-[11px] font-mono text-white/80 placeholder:text-white/15 outline-none focus:border-[#F26522] focus:ring-0 transition-colors" />
                            <input type="url" value={link.url} onChange={e => {
                                const links = [...settings.socialLinks];
                                links[i] = { ...links[i], url: e.target.value };
                                onChange({ ...settings, socialLinks: links });
                            }} placeholder="https://..."
                                className="flex-1 bg-transparent border border-white/10 px-3 py-2 text-[11px] font-mono text-white/80 placeholder:text-white/15 outline-none focus:border-[#F26522] focus:ring-0 transition-colors" />
                            <button onClick={() => onChange({ ...settings, socialLinks: settings.socialLinks.filter((_, j) => j !== i) })}
                                className="px-2 text-white/20 hover:text-red-400 transition-colors">
                                <Trash2 size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Maintenance Toggle */}
            <div className="flex items-center justify-between border border-white/10 p-4">
                <div>
                    <p className="text-[12px] font-mono text-white/70">Maintenance Mode</p>
                    <p className="text-[10px] font-mono text-white/25 mt-0.5">When enabled, visitors will see a maintenance page</p>
                </div>
                <button onClick={() => onChange({ ...settings, maintenance: !settings.maintenance })}
                    className={`w-10 h-5 border transition-colors relative ${settings.maintenance ? 'bg-[#F26522] border-[#F26522]' : 'bg-transparent border-white/20'}`}>
                    <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white transition-all ${settings.maintenance ? 'left-[calc(100%-18px)]' : 'left-0.5'}`} />
                </button>
            </div>
        </div>
    );
}

// ── Profile Tab ──
function ProfileTab() {
    return (
        <div className="space-y-5">
            <div className="flex items-center gap-5 border border-white/10 p-5" style={{ background: '#0D0D0D' }}>
                <div className="w-16 h-16 border border-white/10 flex items-center justify-center text-[20px] font-black text-white/30">AD</div>
                <div>
                    <p className="text-[14px] font-mono text-white/80">Administrator</p>
                    <p className="text-[10px] font-mono text-white/30 mt-1">admin@digdaya.id · Super Admin</p>
                </div>
            </div>
            <Field label="Display Name" value="Administrator" onChange={() => { }} />
            <Field label="Email" value="admin@digdaya.id" onChange={() => { }} type="email" />
            <Field label="Current Password" value="" onChange={() => { }} type="password" placeholder="Enter current password" />
            <Field label="New Password" value="" onChange={() => { }} type="password" placeholder="Enter new password" />
        </div>
    );
}

// ── SEO Tab ──
function SEOTab({ settings, onChange }: { settings: SiteSettings; onChange: (s: SiteSettings) => void }) {
    return (
        <div className="space-y-5">
            <Field label="Default Meta Title" value={settings.seoDefaults.metaTitle} onChange={v => onChange({ ...settings, seoDefaults: { ...settings.seoDefaults, metaTitle: v } })} />
            <div>
                <label className="block text-[9px] font-mono tracking-[0.15em] uppercase text-white/40 mb-2">Default Meta Description</label>
                <textarea rows={3} value={settings.seoDefaults.metaDescription} onChange={e => onChange({ ...settings, seoDefaults: { ...settings.seoDefaults, metaDescription: e.target.value } })}
                    className="w-full bg-transparent border border-white/10 px-4 py-3 text-[13px] font-mono text-white/80 outline-none focus:border-[#F26522] focus:ring-0 transition-colors resize-none" />
                <span className="text-[9px] font-mono text-white/20 mt-1 block">{settings.seoDefaults.metaDescription.length}/160 characters</span>
            </div>
            <Field label="Default OG Image URL" value={settings.seoDefaults.ogImage} onChange={v => onChange({ ...settings, seoDefaults: { ...settings.seoDefaults, ogImage: v } })} />
            <Field label="Google Analytics ID" value={settings.analyticsId} onChange={v => onChange({ ...settings, analyticsId: v })} placeholder="G-XXXXXXXXXX" />

            <div className="border border-white/10 p-5" style={{ background: '#0D0D0D' }}>
                <p className="text-[9px] font-mono tracking-[0.15em] uppercase text-white/30 mb-3">Search Preview</p>
                <div className="space-y-1">
                    <p className="text-[14px] text-sky-400 font-mono truncate">{settings.seoDefaults.metaTitle}</p>
                    <p className="text-[11px] text-emerald-500 font-mono truncate">{settings.siteUrl}</p>
                    <p className="text-[11px] text-white/40 font-mono line-clamp-2">{settings.seoDefaults.metaDescription}</p>
                </div>
            </div>
        </div>
    );
}

// ── Appearance Tab ──
function AppearanceTab() {
    return (
        <div className="space-y-5">
            <div>
                <label className="block text-[9px] font-mono tracking-[0.15em] uppercase text-white/40 mb-3">Brand Colors</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { name: 'Primary', hex: '#F26522' },
                        { name: 'Background', hex: '#090909' },
                        { name: 'Card', hex: '#161616' },
                        { name: 'Border', hex: '#8A8A8A' },
                    ].map(c => (
                        <div key={c.name} className="border border-white/10 p-3">
                            <div className="w-full h-8 mb-2 border border-white/5" style={{ background: c.hex }} />
                            <span className="text-[9px] font-mono text-white/40 block">{c.name}</span>
                            <span className="text-[10px] font-mono text-white/60">{c.hex}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-[9px] font-mono tracking-[0.15em] uppercase text-white/40 mb-3">Typography</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="border border-white/10 p-4">
                        <span className="text-[9px] font-mono text-white/30 block mb-2">Headings</span>
                        <p className="text-[20px] font-black uppercase tracking-tight" style={{ fontFamily: "'Archivo Black', sans-serif" }}>Archivo Black</p>
                    </div>
                    <div className="border border-white/10 p-4">
                        <span className="text-[9px] font-mono text-white/30 block mb-2">Body / Data</span>
                        <p className="text-[14px] font-mono">Monospace / Inter</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── SETTINGS PAGE ──────────────────────────────
export function SettingsPage() {
    const { content, updateSettings, resetToDefaults } = useContent();
    const [localSettings, setLocalSettings] = useState<SiteSettings>({ ...content.settings });
    const [activeTab, setActiveTab] = useState<TabId>('general');
    const [toast, setToast] = useState<string | null>(null);

    const handleSave = () => {
        updateSettings(localSettings);
        setToast('Settings saved & published');
        setTimeout(() => setToast(null), 3000);
    };

    const handleReset = () => {
        resetToDefaults();
        setLocalSettings({ ...content.settings });
        setToast('All content reset to defaults');
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-[28px] md:text-[36px] font-black uppercase tracking-tight leading-none" style={{ fontFamily: "'Archivo Black', sans-serif" }}>Settings</h1>
                    <p className="text-[11px] font-mono tracking-[0.1em] text-white/30 uppercase mt-1.5">System Configuration & Preferences</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleReset} className="flex items-center gap-2 px-4 py-3 border border-white/10 text-[10px] font-mono tracking-[0.12em] uppercase text-white/40 hover:text-red-400 hover:border-red-400/30 transition-colors shrink-0" title="Reset all content to factory defaults">
                        <RotateCcw size={13} /> Reset
                    </button>
                    <button onClick={handleSave} className="flex items-center gap-2 px-5 py-3 bg-[#F26522] hover:bg-[#d4550f] text-[11px] font-mono tracking-[0.12em] uppercase text-white transition-colors shrink-0">
                        <Save size={14} /> Save Changes
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-0 border-b border-white/10">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-3 text-[10px] font-mono tracking-[0.1em] uppercase border-b-2 transition-colors ${activeTab === tab.id ? 'border-[#F26522] text-[#F26522]' : 'border-transparent text-white/30 hover:text-white/60'
                            }`}>
                        <tab.icon size={13} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={activeTab}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="border border-white/10 p-6" style={{ background: '#161616' }}>
                    {activeTab === 'general' && <GeneralTab settings={localSettings} onChange={setLocalSettings} />}
                    {activeTab === 'profile' && <ProfileTab />}
                    {activeTab === 'seo' && <SEOTab settings={localSettings} onChange={setLocalSettings} />}
                    {activeTab === 'appearance' && <AppearanceTab />}
                </motion.div>
            </AnimatePresence>

            <AnimatePresence>
                {toast && <Toast message={toast} onClose={() => setToast(null)} />}
            </AnimatePresence>
        </div>
    );
}
