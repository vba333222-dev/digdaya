// ── Placeholder admin pages ──
// Will be fully implemented when backend is connected.

export function MessagesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1
                    className="text-[28px] md:text-[36px] font-black uppercase tracking-tight leading-none"
                    style={{ fontFamily: "'Archivo Black', sans-serif" }}
                >
                    Messages
                </h1>
                <p className="text-[11px] font-mono tracking-[0.1em] text-white/30 uppercase mt-1.5">
                    Client Inquiries & Communications
                </p>
            </div>
            <div className="border border-white/10 p-12 text-center" style={{ background: '#161616' }}>
                <p className="text-[11px] font-mono text-white/20 tracking-[0.15em] uppercase">
                    Connect backend to display messages
                </p>
            </div>
        </div>
    );
}

export function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1
                    className="text-[28px] md:text-[36px] font-black uppercase tracking-tight leading-none"
                    style={{ fontFamily: "'Archivo Black', sans-serif" }}
                >
                    Settings
                </h1>
                <p className="text-[11px] font-mono tracking-[0.1em] text-white/30 uppercase mt-1.5">
                    System Configuration
                </p>
            </div>
            <div className="border border-white/10 p-12 text-center" style={{ background: '#161616' }}>
                <p className="text-[11px] font-mono text-white/20 tracking-[0.15em] uppercase">
                    Settings panel — coming soon
                </p>
            </div>
        </div>
    );
}
