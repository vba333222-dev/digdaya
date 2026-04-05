import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NoiseTexture } from './NoiseTexture';

// ─── Stagger letter reveal ────────────────────────────────────────────────────
const LetterReveal = ({
    text, className = '', style = {}, delay = 0,
}: {
    text: string; className?: string; style?: React.CSSProperties; delay?: number;
}) => {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: '-8%' });
    return (
        <span ref={ref} className={`block overflow-hidden ${className}`} style={style}>
            <span className="sr-only">{text}</span>
            <span className="flex flex-wrap" aria-hidden>
                {text.split('').map((char, i) => (
                    <motion.span
                        key={i}
                        initial={{ y: '115%', opacity: 0 }}
                        animate={inView ? { y: '0%', opacity: 1 } : {}}
                        transition={{ duration: 0.72, delay: delay + i * 0.028, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-block"
                        style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
                    >
                        {char}
                    </motion.span>
                ))}
            </span>
        </span>
    );
};

// ─── Fade-up block ────────────────────────────────────────────────────────────
const FadeUp = ({ children, delay = 0, className = '' }: {
    children: React.ReactNode; delay?: number; className?: string;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-12%' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// ─── Magnetic CTA link ────────────────────────────────────────────────────────
const MagneticCTA = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const ref = useRef<HTMLAnchorElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 180, damping: 18 });
    const sy = useSpring(y, { stiffness: 180, damping: 18 });

    const handleMove = (e: React.MouseEvent) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - rect.left - rect.width / 2) * 0.18);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.18);
    };
    const handleLeave = () => { x.set(0); y.set(0); };

    return (
        <motion.a
            ref={ref}
            href={href}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            style={{ x: sx, y: sy }}
            className="inline-block"
        >
            {children}
        </motion.a>
    );
};

// ─── Expanding rule ───────────────────────────────────────────────────────────
const ExpandLine = ({ delay = 0, color = 'rgba(255,255,255,0.06)', className = '' }: {
    delay?: number; color?: string; className?: string;
}) => (
    <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
        className={`h-px origin-left w-full ${className}`}
        style={{ background: color }}
    />
);

// ─── Service pill ─────────────────────────────────────────────────────────────
const ServicePill = ({ label, delay }: { label: string; delay: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-8%' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
        >
            <Link
                to="/services"
                className="group relative flex items-center gap-2 px-4 py-2 rounded-full border text-[var(--label-md)] font-mono tracking-[0.1em] uppercase transition-colors duration-300 overflow-hidden border-white/8 text-white/30 hover:border-[var(--brand-dim)] hover:text-[var(--brand)]"
            >
                <span
                    className="w-1 h-1 rounded-full flex-shrink-0 transition-colors duration-300 bg-white/20 group-hover:bg-[var(--brand)]"
                />
                {label}
            </Link>
        </motion.div>
    );
};

// ─── Animated counter-clock ───────────────────────────────────────────────────
const LiveClock = () => {
    const [time, setTime] = useState(() => {
        const d = new Date();
        return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Jakarta' });
    });
    useEffect(() => {
        const t = setInterval(() => {
            setTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Jakarta' }));
        }, 1000);
        return () => clearInterval(t);
    }, []);
    return (
        <span className="font-mono text-[0.55rem] tracking-[0.2em] text-white/20">
            WIB {time}
        </span>
    );
};

// ─── Main Footer ──────────────────────────────────────────────────────────────
export const Footer = () => {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end end'] });

    const orbY = useTransform(scrollYProgress, [0, 1], ['-20%', '10%']);
    const ctaY = useTransform(scrollYProgress, [0, 0.5], [60, 0]);
    const ctaOp = useTransform(scrollYProgress, [0, 0.35], [0, 1]);

    const serviceLinks = [
        'Hardware & Infra',
        'Connectivity',
        'Security & Trust',
        'Software & Tech',
        'Creative Consulting',
    ];

    const navLinks = [
        { label: 'About', href: '/about' },
        { label: 'Projects', href: '/projects' },
        { label: 'Services', href: '/services' },
        { label: 'Contact', href: '/contact' },
    ];

    const legalLinks = [
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms of Use', href: '/terms-of-use' },
        { label: 'Licenses', href: '/licenses' },
    ];

    return (
        <footer
            ref={containerRef}
            id="contact"
            className="w-full relative overflow-hidden"
            style={{ background: 'var(--bg-pure)', isolation: 'isolate' }}
        >
            {/* ── BG: deep gradient ── */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    zIndex: 0,
                    background: `
                        radial-gradient(ellipse 80% 60% at 50% 120%, rgba(242,101,34,0.07) 0%, transparent 60%),
                        radial-gradient(ellipse 70% 50% at 10% 50%, rgba(242,101,34,0.04) 0%, transparent 55%),
                        linear-gradient(175deg, #04040f 0%, #030308 50%, #050208 100%)
                    `,
                }}
            />

            {/* ── BG: ember orb, bottom-center ── */}
            <motion.div
                className="absolute pointer-events-none"
                style={{
                    zIndex: 1, y: orbY,
                    bottom: '-20%', left: '50%', translateX: '-50%',
                    width: '70vw', height: '40vw',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(242,101,34,0.10) 0%, rgba(180,55,8,0.04) 50%, transparent 72%)',
                    filter: 'blur(80px)',
                }}
            />

            {/* ── BG: dot grid ── */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    zIndex: 2, opacity: 0.035,
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)',
                    backgroundSize: '44px 44px',
                }}
            />

            {/* ── BG: noise ── */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
                <NoiseTexture opacity={0.06} />
            </div>

            {/* ── BG: vignette ── */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    zIndex: 4,
                    background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 20%, rgba(0,0,6,0.6) 70%, rgba(0,0,5,0.92) 100%)',
                }}
            />

            {/* ── TOP BORDER — orange glow line ── */}
            <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full origin-left"
                style={{ zIndex: 10, height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(242,101,34,0.6) 25%, #F26522 50%, rgba(242,101,34,0.6) 75%, transparent 100%)' }}
            />
            {/* glow bloom under top border */}
            <div
                className="relative w-full h-px pointer-events-none"
                style={{
                    zIndex: 9,
                    background: 'linear-gradient(90deg, transparent 0%, rgba(242,101,34,0.18) 30%, rgba(242,101,34,0.25) 50%, rgba(242,101,34,0.18) 70%, transparent 100%)',
                    filter: 'blur(6px)',
                    marginTop: '-1px',
                }}
            />

            {/* ════════════════════════════════════════════
                CONTENT — z-index 10+
            ════════════════════════════════════════════ */}
            <div className="relative max-w-[1560px] mx-auto px-6 md:px-16" style={{ zIndex: 10 }}>

                {/* ── TOP META ROW ────────────────────────── */}
                <FadeUp delay={0.1} className="flex items-center justify-between pt-16 md:pt-20 pb-16 md:pb-20 border-b border-white/[0.05]">
                    {/* Left: label + tagline */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <motion.div
                                className="w-1.5 h-1.5 rounded-full bg-[#F26522]"
                                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.3, 1] }}
                                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                            />
                            <span className="text-[0.5rem] font-mono tracking-[0.4em] text-[#F26522] uppercase">
                                Contact
                            </span>
                        </div>
                        <p className="text-[0.6rem] font-mono tracking-[0.15em] text-white/20 uppercase max-w-[28ch]">
                            Building physical & digital futures — Jakarta, Indonesia
                        </p>
                    </div>

                    {/* Right: email CTA */}
                    <motion.a
                        href="mailto:hello@digdaya.id"
                        className="hidden md:flex items-center gap-3 group"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.3 }}
                    >
                        <span className="text-[0.65rem] font-mono tracking-[0.2em] text-white/25 uppercase group-hover:text-[#F26522] transition-colors duration-400">
                            hello@digdaya.id
                        </span>
                        <div
                            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#F26522]/50 transition-colors duration-400"
                            style={{ background: 'rgba(255,255,255,0.03)' }}
                        >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-white/30 group-hover:text-[#F26522] transition-colors duration-400" />
                            </svg>
                        </div>
                    </motion.a>
                </FadeUp>

                {/* ── HERO CTA ─────────────────────────────── */}
                <motion.div
                    style={{ y: ctaY, opacity: ctaOp }}
                    className="py-20 md:py-28"
                >
                    {/* Pre-label */}
                    <FadeUp delay={0.05}>
                        <span className="text-[0.5rem] font-mono tracking-[0.45em] text-white/20 uppercase block mb-6">
                            Ready to start something real?
                        </span>
                    </FadeUp>

                    {/* Main CTA text — magnetic, two lines */}
                    <div className="mb-10 md:mb-12">
                        <MagneticCTA href="mailto:hello@digdaya.id">
                            <LetterReveal
                                text="Let's build"
                                delay={0.1}
                                className="text-[11vw] md:text-[6.5vw] font-black leading-[0.88] tracking-[-0.04em] uppercase text-white"
                                style={{ fontFamily: 'var(--font-nero)' }}
                            />
                            <LetterReveal
                                text="together."
                                delay={0.5}
                                className="text-[11vw] md:text-[6.5vw] font-black leading-[0.88] tracking-[-0.04em] uppercase"
                                style={{ fontFamily: 'var(--font-nero)', color: '#F26522' }}
                            />
                        </MagneticCTA>
                    </div>

                    {/* CTA buttons row */}
                    <FadeUp delay={0.55} className="flex flex-wrap items-center gap-4">
                        {/* Primary button */}
                        <motion.a
                            href="mailto:hello@digdaya.id"
                            className="group relative flex items-center gap-3 px-7 py-3.5 rounded-full overflow-hidden"
                            style={{ background: '#F26522' }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ duration: 0.25 }}
                        >
                            <motion.div
                                className="absolute inset-0 pointer-events-none"
                                style={{ background: 'rgba(255,255,255,0.12)' }}
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            />
                            <span className="text-[0.65rem] font-mono tracking-[0.2em] text-black uppercase font-bold relative z-10">
                                Start a project
                            </span>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative z-10">
                                <path d="M2 10L10 2M10 2H4M10 2V8" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </motion.a>

                        {/* Ghost button */}
                        <motion.a
                            href="tel:+6221000000"
                            className="group flex items-center gap-3 px-7 py-3.5 rounded-full border border-white/10 hover:border-white/25 transition-colors duration-400"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ duration: 0.25 }}
                        >
                            <span className="text-[0.65rem] font-mono tracking-[0.2em] text-white/35 group-hover:text-white/60 uppercase transition-colors duration-400">
                                Schedule a call
                            </span>
                        </motion.a>
                    </FadeUp>
                </motion.div>

                <ExpandLine delay={0.2} color="rgba(255,255,255,0.05)" />

                {/* ── SERVICES TAG CLOUD ───────────────────── */}
                <div className="py-14 md:py-16">
                    <FadeUp delay={0.05} className="mb-6">
                        <span className="text-[0.5rem] font-mono tracking-[0.4em] text-white/20 uppercase">
                            What we do
                        </span>
                    </FadeUp>
                    <div className="flex flex-wrap gap-2.5">
                        {serviceLinks.map((label, i) => (
                            <ServicePill key={label} label={label} delay={0.1 + i * 0.06} />
                        ))}
                    </div>
                </div>

                <ExpandLine delay={0.1} color="rgba(255,255,255,0.05)" />

                {/* ── LINKS GRID ───────────────────────────── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-6 py-14 md:py-16">

                    {/* Navigation */}
                    <FadeUp delay={0.1} className="flex flex-col gap-2.5">
                        <span className="text-[0.48rem] font-mono tracking-[0.38em] text-white/18 uppercase mb-3">
                            Navigate
                        </span>
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.href}
                                className="group flex items-center gap-2 text-[0.8rem] font-light text-white/28 hover:text-white transition-all duration-300 w-fit"
                            >
                                <span className="w-3 h-px bg-white/15 group-hover:bg-white/50 group-hover:w-5 transition-all duration-300" />
                                {link.label}
                            </Link>
                        ))}
                    </FadeUp>

                    {/* Social */}
                    <FadeUp delay={0.18} className="flex flex-col gap-2.5">
                        <span className="text-[0.48rem] font-mono tracking-[0.38em] text-white/35 uppercase mb-3">
                            Connect
                        </span>
                        {[
                            { label: 'LinkedIn', href: '#', hint: '↗' },
                            { label: 'Twitter/X', href: '#', hint: '↗' },
                            { label: 'GitHub', href: '#', hint: '↗' },
                        ].map((link) => (
                            <motion.a
                                key={link.label}
                                href={link.href}
                                className="group flex items-center justify-between text-[0.8rem] font-light text-white/28 hover:text-white transition-all duration-300 w-fit gap-6"
                                whileHover={{ x: 4 }}
                            >
                                <span>{link.label}</span>
                                <span className="text-[0.65rem] text-white/15 group-hover:text-white/50 transition-colors duration-300 -translate-x-1 group-hover:translate-x-0">
                                    {link.hint}
                                </span>
                            </motion.a>
                        ))}
                    </FadeUp>

                    {/* Legal */}
                    <FadeUp delay={0.24} className="flex flex-col gap-2.5">
                        <span className="text-[0.48rem] font-mono tracking-[0.38em] text-white/18 uppercase mb-3">
                            Legal
                        </span>
                        {legalLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.href}
                                className="text-[0.8rem] font-light text-white/20 hover:text-white/50 transition-colors duration-300 w-fit"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </FadeUp>

                    {/* HQ + coordinates */}
                    <FadeUp delay={0.3} className="flex flex-col gap-2">
                        <span className="text-[0.48rem] font-mono tracking-[0.38em] text-white/18 uppercase mb-3">
                            Headquarters
                        </span>
                        <p className="text-[0.8rem] font-light text-white/28 leading-relaxed">
                            Jakarta<br />Indonesia
                        </p>

                        {/* Coordinate display */}
                        <div
                            className="mt-5 px-3 py-2.5 rounded-lg border border-white/[0.06] flex flex-col gap-1"
                            style={{ background: 'rgba(255,255,255,0.02)' }}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-[0.42rem] font-mono tracking-[0.3em] text-white/15 uppercase">Lat</span>
                                <span className="text-[0.6rem] font-mono text-white/30 ml-auto">−6.2088°</span>
                            </div>
                            <div className="h-px w-full bg-white/[0.05]" />
                            <div className="flex items-center gap-2">
                                <span className="text-[0.42rem] font-mono tracking-[0.3em] text-white/15 uppercase">Lng</span>
                                <span className="text-[0.6rem] font-mono text-white/30 ml-auto">106.8456°</span>
                            </div>
                        </div>

                        <LiveClock />
                    </FadeUp>
                </div>

                <ExpandLine delay={0} color="rgba(255,255,255,0.05)" />

                {/* ── BOTTOM BAR ───────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.5 }}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-7"
                >
                    {/* Left */}
                    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                        <span className="text-[0.5rem] font-mono text-white/25 tracking-[0.18em] uppercase">
                            © 2026 Digdaya Teknokraf Indonesia
                        </span>
                        <span className="hidden md:block w-px h-3 bg-white/10" />
                        <span className="text-[0.5rem] font-mono text-white/25 tracking-[0.18em] uppercase">
                            All rights reserved
                        </span>
                    </div>

                    {/* Right: system status row */}
                    <div className="flex items-center gap-5 md:gap-6">
                        {/* Version tag */}
                        <div
                            className="flex items-center gap-2 px-2.5 py-1 rounded border border-white/[0.07]"
                            style={{ background: 'rgba(255,255,255,0.02)' }}
                        >
                            <span className="text-[0.42rem] font-mono text-white/20 tracking-[0.2em] uppercase">
                                sys.v2.0.26
                            </span>
                        </div>

                        {/* Status indicator */}
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-40" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                            </span>
                            <span className="text-[0.45rem] font-mono text-white/30 tracking-[0.18em] uppercase">
                                All systems operational
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ── Bottom ambient glow ── */}
            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
                style={{
                    zIndex: 5,
                    width: '50%',
                    height: '120px',
                    background: 'radial-gradient(ellipse 100% 100% at 50% 100%, rgba(242,101,34,0.10) 0%, transparent 70%)',
                    filter: 'blur(20px)',
                }}
            />
            {/* Bottom hairline */}
            <div
                className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
                style={{
                    zIndex: 11,
                    background: 'linear-gradient(90deg, transparent, rgba(242,101,34,0.15) 30%, rgba(242,101,34,0.22) 50%, rgba(242,101,34,0.15) 70%, transparent)',
                }}
            />
        </footer>
    );
};