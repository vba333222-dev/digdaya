import { useEffect, useRef, useState } from 'react';
import { NoiseTexture } from '../components/NoiseTexture';
import { SEO } from '../components/SEO';

// ─── Animated counter for a subtle "live" feel ───────────────────────────────
function LiveIndicator() {
    const [tick, setTick] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setTick(t => (t + 1) % 3), 600);
        return () => clearInterval(id);
    }, []);
    return (
        <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase">
            <span
                className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] inline-block transition-all duration-300"
                style={{ opacity: tick === 0 ? 1 : 0.3 }}
            />
            Available for projects
        </span>
    );
}

// ─── Magnetic button ─────────────────────────────────────────────────────────
function MagneticButton({ children, className, type = 'button' }: { children: React.ReactNode; className?: string; type?: 'button' | 'submit' | 'reset' }) {
    const ref = useRef<HTMLButtonElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        const btn = ref.current;
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    };

    const handleMouseLeave = () => {
        const btn = ref.current;
        if (!btn) return;
        btn.style.transform = 'translate(0,0)';
    };

    return (
        <button
            ref={ref}
            type={type}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)' }}
        >
            {children}
        </button>
    );
}

// ─── Glitch text effect ───────────────────────────────────────────────────────
function GlitchHeading({ text }: { text: string }) {
    return (
        <div className="relative inline-block">
            <style>{`
                @keyframes glitch-1 {
                    0%, 90%, 100% { clip-path: none; transform: none; }
                    92% { clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%); transform: translate(-3px, 0); }
                    94% { clip-path: polygon(0 60%, 100% 60%, 100% 75%, 0 75%); transform: translate(3px, 0); }
                    96% { clip-path: polygon(0 5%, 100% 5%, 100% 15%, 0 15%); transform: translate(-2px, 0); }
                }
                @keyframes glitch-2 {
                    0%, 88%, 100% { opacity: 0; }
                    89% { opacity: 0.7; clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%); transform: translate(4px, -2px); }
                    91% { opacity: 0.5; clip-path: polygon(0 65%, 100% 65%, 100% 80%, 0 80%); transform: translate(-4px, 2px); }
                    93% { opacity: 0; }
                }
                @keyframes fade-up {
                    from { opacity: 0; transform: translateY(40px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes line-grow {
                    from { scaleX: 0; }
                    to   { scaleX: 1; }
                }
                @keyframes slide-in-right {
                    from { opacity: 0; transform: translateX(60px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes count-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .glitch-main { animation: glitch-1 8s infinite; }
                .glitch-clone {
                    position: absolute; inset: 0;
                    color: var(--brand);
                    animation: glitch-2 8s infinite;
                    pointer-events: none;
                    user-select: none;
                }
                .fade-up-1 { animation: fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
                .fade-up-2 { animation: fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
                .fade-up-3 { animation: fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s both; }
                .fade-up-4 { animation: fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.55s both; }
                .slide-in-r { animation: slide-in-right 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
                .field-focus-line {
                    position: absolute; bottom: 0; left: 0; height: 1px;
                    width: 100%; background: var(--brand);
                    transform: scaleX(0); transform-origin: left;
                    transition: transform 0.4s cubic-bezier(0.23,1,0.32,1);
                }
                input:focus ~ .field-focus-line,
                textarea:focus ~ .field-focus-line { transform: scaleX(1); }
                .send-btn-arrow {
                    display: inline-block;
                    transition: transform 0.4s cubic-bezier(0.23,1,0.32,1);
                }
                .send-btn:hover .send-btn-arrow { transform: translateX(6px); }
                .send-btn::after {
                    content: '';
                    position: absolute; inset: 0;
                    background: var(--brand);
                    transform: scaleX(0); transform-origin: left;
                    transition: transform 0.5s cubic-bezier(0.23,1,0.32,1);
                    z-index: 0;
                }
                .send-btn:hover::after { transform: scaleX(1); }
                .send-btn > * { position: relative; z-index: 1; }
                .stat-item { animation: count-up 0.6s cubic-bezier(0.16,1,0.3,1) both; }
                .stat-item:nth-child(1) { animation-delay: 0.6s; }
                .stat-item:nth-child(2) { animation-delay: 0.75s; }
                .stat-item:nth-child(3) { animation-delay: 0.9s; }
                .contact-link {
                    position: relative;
                    display: inline-block;
                }
                .contact-link::after {
                    content: '';
                    position: absolute; bottom: -2px; left: 0;
                    width: 100%; height: 1px;
                    background: var(--brand);
                    transform: scaleX(0); transform-origin: right;
                    transition: transform 0.4s cubic-bezier(0.23,1,0.32,1);
                }
                .contact-link:hover::after {
                    transform: scaleX(1); transform-origin: left;
                }
                .divider-line {
                    height: 1px; background: white;
                    transform: scaleX(0); transform-origin: left;
                    animation: line-grow 1s cubic-bezier(0.16,1,0.3,1) 0.2s forwards;
                }
                @media (max-width: 768px) {
                    .contact-grid { flex-direction: column; }
                }
            `}</style>
            <span className="glitch-main">{text}</span>
            <span className="glitch-clone" aria-hidden="true">{text}</span>
        </div>
    );
}

// ─── Input field with animated focus line ────────────────────────────────────
function FormField({
    label,
    type = 'text',
    placeholder,
    isTextarea = false,
    index = 0,
}: {
    label: string;
    type?: string;
    placeholder: string;
    isTextarea?: boolean;
    index?: number;
}) {
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const delay = `${0.5 + index * 0.12}s`;

    const baseClass =
        'w-full bg-transparent border-none pb-3 text-white font-mono text-sm focus:outline-none placeholder-white/20 resize-none peer';

    return (
        <div
            className="relative"
            style={{ animation: `fade-up 0.8s cubic-bezier(0.16,1,0.3,1) ${delay} both` }}
        >
            <label
                className="block font-mono text-[10px] uppercase tracking-[0.25em] mb-3 transition-colors duration-300"
                style={{ color: focused ? 'var(--brand)' : 'rgba(255,255,255,0.35)' }}
            >
                {label}
                {focused && (
                    <span
                        className="ml-2 text-[var(--brand)]"
                        style={{ animation: 'fade-up 0.3s ease both' }}
                    >
                        ↗
                    </span>
                )}
            </label>

            {isTextarea ? (
                <textarea
                    rows={5}
                    placeholder={placeholder}
                    className={baseClass}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={e => setHasValue(e.target.value.length > 0)}
                />
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    className={baseClass}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={e => setHasValue(e.target.value.length > 0)}
                />
            )}

            {/* static line */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-white/15" />
            {/* animated focus line */}
            <div
                className="absolute bottom-0 left-0 h-px bg-[var(--brand)]"
                style={{
                    width: '100%',
                    transform: focused || hasValue ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.5s cubic-bezier(0.23,1,0.32,1)',
                }}
            />
        </div>
    );
}

// ─── Main Contact component ───────────────────────────────────────────────────
export function Contact() {
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setSubmitted(true);
        }, 1800);
    };

    return (
        <div className="relative min-h-screen bg-[var(--bg-base)] overflow-hidden">
            <SEO title="Contact" description="Get in touch with Digdaya Teknokraf. Start a project or general inquiry — we respond within 48 hours." />
            <NoiseTexture />

            {/* Atmospheric glow blobs */}
            <div
                className="pointer-events-none absolute"
                style={{
                    top: '-10%', left: '-5%',
                    width: '50vw', height: '50vw',
                    background: 'radial-gradient(circle, rgba(234,96,1,0.06) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                }}
            />
            <div
                className="pointer-events-none absolute"
                style={{
                    bottom: '5%', right: '-10%',
                    width: '40vw', height: '40vw',
                    background: 'radial-gradient(circle, rgba(234,96,1,0.04) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                }}
            />

            {/* Top meta bar */}
            <div className="fade-up-1 relative z-10 flex items-center justify-between px-6 md:px-12 lg:px-16 pt-8 pb-0">
                <LiveIndicator />
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/20 uppercase">
                    {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
            </div>

            {/* Main grid */}
            <div className="relative z-10 px-6 md:px-12 lg:px-16 pt-16 pb-24">

                {/* ── Heading ── */}
                <div className="fade-up-2 mb-4">
                    <p className="font-mono text-[10px] tracking-[0.3em] text-[var(--brand)] uppercase mb-4">
                        — Let's build something
                    </p>
                </div>

                <h1 className="fade-up-3 text-[4.5rem] md:text-[7rem] lg:text-[10rem] font-black uppercase leading-[0.88] tracking-tighter mb-6"
                    style={{ fontFamily: "var(--font-nero)" }}>
                    <GlitchHeading text="GET IN" />
                    <br />
                    <span className="text-outline" style={{
                        WebkitTextStroke: '1px rgba(255,255,255,0.25)',
                        color: 'transparent',
                    }}>
                        TOUCH
                    </span>
                </h1>

                {/* Divider */}
                <div className="divider-line mb-16" />

                {/* ── Two-column layout ── */}
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

                    {/* LEFT: info */}
                    <div className="fade-up-3 w-full lg:w-5/12 flex flex-col justify-between">

                        {/* Stats row */}
                        <div className="flex gap-8 mb-16 border-b border-white/8 pb-12">
                            {[
                                { num: '7+', label: 'Years active' },
                                { num: '80+', label: 'Projects shipped' },
                                { num: '48h', label: 'Response time' },
                            ].map(s => (
                                <div key={s.label} className="stat-item">
                                    <div className="font-black text-3xl tracking-tight text-white mb-1"
                                        style={{ fontFamily: 'var(--font-nero)' }}>
                                        {s.num}
                                    </div>
                                    <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest">{s.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Contact details */}
                        <div className="space-y-10 font-mono text-sm">
                            {[
                                {
                                    label: 'Email Inquiries',
                                    content: (
                                        <a href="mailto:hello@digdaya.id"
                                            className="contact-link text-white text-lg font-bold hover:text-[var(--brand)] transition-colors">
                                            hello@digdaya.id
                                        </a>
                                    ),
                                },
                                {
                                    label: 'Headquarters',
                                    content: (
                                        <p className="text-white/70 leading-relaxed">
                                            SCBD Area<br />Jakarta, Indonesia
                                        </p>
                                    ),
                                },
                                {
                                    label: 'Follow along',
                                    content: (
                                        <div className="flex items-center gap-6 text-white/50">
                                            <a href="#" className="contact-link hover:text-white transition-colors">LinkedIn</a>
                                            <span className="text-white/15 text-xs">✦</span>
                                            <a href="#" className="contact-link hover:text-white transition-colors">Instagram</a>
                                            <span className="text-white/15 text-xs">✦</span>
                                            <a href="#" className="contact-link hover:text-white transition-colors">Twitter</a>
                                        </div>
                                    ),
                                },
                            ].map((item, i) => (
                                <div key={item.label}
                                    style={{ animation: `fade-up 0.8s cubic-bezier(0.16,1,0.3,1) ${0.4 + i * 0.12}s both` }}>
                                    <strong className="text-[var(--brand)] text-[9px] tracking-[0.3em] uppercase block mb-3">
                                        {String(i + 1).padStart(2, '0')} — {item.label}
                                    </strong>
                                    {item.content}
                                </div>
                            ))}
                        </div>

                        {/* Bottom note */}
                        <p className="fade-up-4 font-mono text-[10px] text-white/20 uppercase tracking-widest mt-16 leading-relaxed">
                            We respond to every inquiry<br />within 48 business hours.
                        </p>
                    </div>

                    {/* RIGHT: form */}
                    <div className="slide-in-r w-full lg:w-7/12">
                        <form onSubmit={handleSend} className="relative border border-white/8 bg-white/[0.02] backdrop-blur-sm p-10 lg:p-14">

                            {/* Corner accents */}
                            {[
                                'top-0 left-0 border-t border-l',
                                'top-0 right-0 border-t border-r',
                                'bottom-0 left-0 border-b border-l',
                                'bottom-0 right-0 border-b border-r',
                            ].map((cls, i) => (
                                <span key={i}
                                    className={`absolute w-4 h-4 border-[var(--brand)]/60 ${cls}`}
                                    style={{ margin: '-1px' }}
                                />
                            ))}

                            {/* Form number label */}
                            <div className="flex items-center justify-between mb-10">
                                <span className="font-mono text-[10px] tracking-[0.25em] text-white/25 uppercase">
                                    Form / 01
                                </span>
                                <span className="font-mono text-[10px] tracking-[0.25em] text-white/25 uppercase">
                                    General Inquiry
                                </span>
                            </div>

                            {submitted ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center"
                                    style={{ animation: 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both' }}>
                                    <div className="text-[var(--brand)] text-5xl mb-6 font-black"
                                        style={{ fontFamily: 'var(--font-nero)' }}>
                                        ✓
                                    </div>
                                    <h3 className="font-black text-2xl mb-3 uppercase tracking-tight"
                                        style={{ fontFamily: 'var(--font-nero)' }}>
                                        Message sent.
                                    </h3>
                                    <p className="font-mono text-xs text-white/40 tracking-widest uppercase">
                                        We'll be in touch within 48 hours.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-9">
                                    {/* Two-col row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-9">
                                        <FormField label="Full Name" placeholder="YOUR FULL NAME" index={0} />
                                        <FormField label="Company" placeholder="YOUR COMPANY" index={1} />
                                    </div>

                                    <FormField label="Company Email" type="email" placeholder="YOUR@EMAIL.COM" index={2} />

                                    {/* Service selector */}
                                    <div style={{ animation: 'fade-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.86s both' }}>
                                        <label className="block font-mono text-[10px] uppercase tracking-[0.25em] mb-4 text-white/35">
                                            Service Interest
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Branding', 'Web Design', 'Development', 'Strategy', 'Other'].map(tag => (
                                                <ServiceTag key={tag} label={tag} />
                                            ))}
                                        </div>
                                        <div className="mt-3 h-px w-full bg-white/10" />
                                    </div>

                                    <FormField label="Message" placeholder="DESCRIBE YOUR PROJECT OR INQUIRY" isTextarea index={4} />

                                    {/* CTA */}
                                    <div style={{ animation: 'fade-up 0.8s cubic-bezier(0.16,1,0.3,1) 1.1s both' }}
                                        className="pt-2 flex items-center justify-between flex-wrap gap-4">
                                        <p className="font-mono text-[10px] text-white/25 uppercase tracking-widest">
                                            * All fields are confidential
                                        </p>
                                        <MagneticButton
                                            className="send-btn relative overflow-hidden bg-white text-black font-mono text-[11px] font-bold uppercase tracking-[0.2em] py-5 px-10 hover:text-white transition-colors duration-500 flex items-center gap-3"
                                            type="submit"
                                        >
                                            <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                                            <span className="send-btn-arrow">
                                                {submitting ? (
                                                    <span style={{
                                                        display: 'inline-block',
                                                        animation: 'spin 1s linear infinite',
                                                    }}>◌</span>
                                                ) : '→'}
                                            </span>
                                        </MagneticButton>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom footer strip */}
            <div className="relative z-10 border-t border-white/8 px-6 md:px-12 lg:px-16 py-5 flex items-center justify-between">
                <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">
                    © {new Date().getFullYear()} Digdaya — All rights reserved
                </span>
                <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest hidden md:block">
                    Jakarta · Indonesia
                </span>
            </div>
        </div>
    );
}

// ─── Service tag pill ─────────────────────────────────────────────────────────
function ServiceTag({ label }: { label: string }) {
    const [active, setActive] = useState(false);
    return (
        <button
            type="button"
            onClick={() => setActive(a => !a)}
            className="font-mono text-[10px] uppercase tracking-widest px-4 py-2 border transition-all duration-300"
            style={{
                borderColor: active ? 'var(--brand)' : 'rgba(255,255,255,0.15)',
                color: active ? 'var(--brand)' : 'rgba(255,255,255,0.4)',
                background: active ? 'var(--brand-ghost)' : 'transparent',
            }}
        >
            {active && '✓ '}{label}
        </button>
    );
}