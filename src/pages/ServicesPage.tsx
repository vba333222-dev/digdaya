import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { NoiseTexture } from '../components/NoiseTexture';
import { SEO } from '../components/SEO';

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const ORANGE = '#F26522';

const services = [
    {
        id: '01',
        title: 'Platform Engineering',
        short: 'Build',
        tags: ['Backend', 'API Design', 'Cloud Infra', 'DevOps'],
        body: 'We architect and engineer B2B platforms that hold under real production pressure — distributed systems, event-driven architecture, and infrastructure that scales without ceremony.',
        deliverables: ['System Architecture', 'API Development', 'CI/CD Pipelines', 'Cloud Infrastructure', 'Performance Tuning'],
        duration: '8–24 wks',
        accent: '#1a3a6b',
        accentLight: '#4f8fff',
    },
    {
        id: '02',
        title: 'Product Design',
        short: 'Design',
        tags: ['UX Research', 'UI Systems', 'Prototyping', 'Figma'],
        body: 'Brutalist by conviction — every design decision is structural, not decorative. We build design systems that scale across products and teams without losing coherence.',
        deliverables: ['Design System', 'UI/UX Flows', 'Interactive Prototypes', 'Component Library', 'Design Tokens'],
        duration: '4–12 wks',
        accent: '#3a1a00',
        accentLight: ORANGE,
    },
    {
        id: '03',
        title: 'IoT & Embedded Systems',
        short: 'Connect',
        tags: ['Firmware', 'Edge Computing', 'Protocols', 'RTOS'],
        body: 'From microcontroller firmware to cloud telemetry pipelines — we close the gap between the physical and the digital. Industrial-grade reliability, engineered from both ends.',
        deliverables: ['Firmware Development', 'Edge Infrastructure', 'Protocol Integration', 'Sensor Systems', 'OTA Updates'],
        duration: '12–32 wks',
        accent: '#001a12',
        accentLight: '#22c55e',
    },
    {
        id: '04',
        title: 'Brand Identity',
        short: 'Identity',
        tags: ['Strategy', 'Visual Identity', 'Motion', 'Print'],
        body: 'Identity as infrastructure. We construct brand systems that operate across every touchpoint — from product UI to physical signage — with structural precision.',
        deliverables: ['Brand Strategy', 'Visual Identity', 'Motion Guidelines', 'Brand Book', 'Asset Systems'],
        duration: '4–8 wks',
        accent: '#1a001a',
        accentLight: '#a855f7',
    },
    {
        id: '05',
        title: 'Data & Intelligence',
        short: 'Analyze',
        tags: ['Analytics', 'ML Systems', 'Dashboards', 'ETL'],
        body: 'Operational intelligence built into your product — not bolted on. We build data pipelines, analytics layers, and ML inference systems that inform decisions at scale.',
        deliverables: ['Data Architecture', 'Analytics Dashboards', 'ML Pipeline', 'ETL Systems', 'Reporting Layer'],
        duration: '6–16 wks',
        accent: '#001a1a',
        accentLight: '#06b6d4',
    },
];

const process = [
    { step: 'I', label: 'Discover', desc: 'Deep audit of your technical landscape, constraints, and goals.' },
    { step: 'II', label: 'Architect', desc: 'System blueprint — structure before execution.' },
    { step: 'III', label: 'Execute', desc: 'Iterative delivery with full transparency and precision.' },
    { step: 'IV', label: 'Sustain', desc: 'Long-term reliability and performance stewardship.' },
];

// ─────────────────────────────────────────────
// SHARED UTILITIES
// ─────────────────────────────────────────────
const Reveal = ({
    children, delay = 0, y = 32, className = '',
}: {
    children: React.ReactNode; delay?: number; y?: number; className?: string;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-60px 0px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y, filter: 'blur(3px)' }}
            animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.95, delay, ease: [0.16, 1, 0.3, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

const SplitReveal = ({ text, delay = 0, className = '', style = {} }: {
    text: string; delay?: number; className?: string; style?: React.CSSProperties;
}) => {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: '-40px 0px' });
    return (
        <span ref={ref} className={`block overflow-hidden ${className}`} style={style}>
            <motion.span
                className="flex flex-wrap"
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                variants={{ visible: { transition: { staggerChildren: 0.022, delayChildren: delay } } }}
            >
                {text.split('').map((ch, i) => (
                    <motion.span
                        key={i}
                        style={{ whiteSpace: ch === ' ' ? 'pre' : undefined }}
                        variants={{
                            hidden: { y: '110%', opacity: 0 },
                            visible: { y: '0%', opacity: 1, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
                        }}
                    >
                        {ch}
                    </motion.span>
                ))}
            </motion.span>
        </span>
    );
};

const Divider = ({ delay = 0 }: { delay?: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true });
    return (
        <div ref={ref} className="w-full overflow-hidden">
            <motion.div
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: 'left', background: 'rgba(255,255,255,0.07)', height: '1px' }}
            />
        </div>
    );
};

// ─────────────────────────────────────────────
// SERVICE ACCORDION ROW
// ─────────────────────────────────────────────
const ServiceRow = ({
    service,
    index,
    isOpen,
    onToggle,
}: {
    service: typeof services[0];
    index: number;
    isOpen: boolean;
    onToggle: () => void;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-40px 0px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="border-b overflow-hidden"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
        >
            {/* ── Header row ── */}
            <button
                onClick={onToggle}
                className="w-full text-left group flex items-center gap-4 md:gap-8 py-7 md:py-8 focus:outline-none"
            >
                {/* Left: number */}
                <motion.span
                    animate={{ color: isOpen ? service.accentLight : 'rgba(255,255,255,0.2)' }}
                    transition={{ duration: 0.3 }}
                    className="text-[var(--label-sm)] font-mono tracking-[0.2em] shrink-0 w-7 hidden md:block"
                >
                    {service.id}
                </motion.span>

                {/* Center: title */}
                <div className="flex-1 flex items-center gap-5 min-w-0">
                    <motion.h3
                        animate={{
                            color: isOpen ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.72)',
                            x: isOpen ? 4 : 0,
                        }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[6.5vw] md:text-[2.8vw] font-black uppercase tracking-[-0.025em] leading-none"
                        style={{ fontFamily: 'var(--font-nero)' }}
                    >
                        {service.title}
                    </motion.h3>
                </div>

                {/* Tags — desktop only */}
                <div className="hidden lg:flex items-center gap-2 shrink-0">
                    {service.tags.slice(0, 2).map((tag) => (
                        <motion.span
                            key={tag}
                            animate={{ opacity: isOpen ? 0.7 : 0.28, borderColor: isOpen ? `${service.accentLight}40` : 'rgba(255,255,255,0.1)' }}
                            transition={{ duration: 0.3 }}
                            className="text-[0.48rem] font-mono tracking-[0.16em] uppercase border px-2 py-1"
                            style={{ color: 'rgba(255,255,255,0.55)' }}
                        >
                            {tag}
                        </motion.span>
                    ))}
                </div>

                {/* Duration */}
                <motion.span
                    animate={{ color: isOpen ? service.accentLight : 'rgba(255,255,255,0.22)' }}
                    transition={{ duration: 0.3 }}
                    className="text-[0.5rem] font-mono tracking-[0.14em] shrink-0 hidden md:block"
                >
                    {service.duration}
                </motion.span>

                {/* Toggle icon */}
                <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                    className="shrink-0 w-7 h-7 flex items-center justify-center border"
                    style={{
                        borderColor: isOpen ? `${service.accentLight}50` : 'rgba(255,255,255,0.12)',
                        color: isOpen ? service.accentLight : 'rgba(255,255,255,0.4)',
                    }}
                >
                    <span className="text-sm leading-none">+</span>
                </motion.div>
            </button>

            {/* ── Expanded panel ── */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                        className="overflow-hidden"
                    >
                        <div
                            className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 md:gap-12 pb-10 pt-2 pl-0 md:pl-[calc(28px+2rem)]"
                        >
                            {/* Left: description */}
                            <div className="flex flex-col gap-6">
                                {/* Accent bar */}
                                <div
                                    className="w-8 h-[2px]"
                                    style={{ background: service.accentLight, opacity: 0.7 }}
                                />
                                <p
                                    className="text-[0.8rem] font-mono leading-[1.9] max-w-xl"
                                    style={{ color: 'rgba(255,255,255,0.55)' }}
                                >
                                    {service.body}
                                </p>

                                {/* All tags */}
                                <div className="flex flex-wrap gap-2">
                                    {service.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-[var(--label-xs)] font-mono tracking-[0.16em] uppercase border px-2.5 py-1"
                                            style={{
                                                borderColor: `${service.accentLight}30`,
                                                color: service.accentLight,
                                                opacity: 0.8,
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Right: deliverables */}
                            <div className="flex flex-col gap-4">
                                <span
                                    className="text-[var(--label-xs)] font-mono tracking-[0.24em] uppercase"
                                    style={{ color: 'rgba(255,255,255,0.28)' }}
                                >
                                    Deliverables
                                </span>
                                <div className="flex flex-col gap-2">
                                    {service.deliverables.map((d, i) => (
                                        <motion.div
                                            key={d}
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                                            className="flex items-center gap-3"
                                        >
                                            <span
                                                className="w-1 h-1 rounded-full shrink-0"
                                                style={{ background: service.accentLight, opacity: 0.6 }}
                                            />
                                            <span
                                                className="text-[var(--label-md)] font-mono"
                                                style={{ color: 'rgba(255,255,255,0.5)' }}
                                            >
                                                {d}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[var(--label-xs)] font-mono tracking-[0.16em] uppercase" style={{ color: 'rgba(255,255,255,0.22)' }}>
                                            Timeline
                                        </span>
                                        <span
                                            className="text-[0.6rem] font-mono"
                                            style={{ color: service.accentLight }}
                                        >
                                            {service.duration}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ─────────────────────────────────────────────
// PROCESS STEP
// ─────────────────────────────────────────────
const ProcessStep = ({ step, index }: { step: typeof process[0]; index: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-40px 0px' });
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="flex flex-col gap-4 py-8 md:py-10 px-6 md:px-8 border relative overflow-hidden cursor-default"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
        >
            {/* Hover bg */}
            <motion.div
                animate={{ opacity: hovered ? 1 : 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 pointer-events-none"
                style={{ background: `linear-gradient(135deg, rgba(242,101,34,0.04) 0%, transparent 70%)` }}
            />

            <div className="relative z-10 flex flex-col gap-4">
                {/* Roman numeral */}
                <div className="flex items-start justify-between">
                    <motion.span
                        animate={{ color: hovered ? ORANGE : 'rgba(255,255,255,0.18)' }}
                        transition={{ duration: 0.3 }}
                        className="text-[var(--label-sm)] font-mono tracking-[0.2em]"
                    >
                        {step.step}
                    </motion.span>
                    <motion.span
                        animate={{ opacity: hovered ? 0.6 : 0, x: hovered ? 0 : 4 }}
                        transition={{ duration: 0.3 }}
                        className="text-xs"
                        style={{ color: ORANGE }}
                    >
                        →
                    </motion.span>
                </div>

                {/* Label */}
                <motion.h4
                    animate={{ color: hovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.75)' }}
                    transition={{ duration: 0.3 }}
                    className="text-[5.5vw] md:text-[1.8vw] font-black uppercase tracking-[-0.02em] leading-none"
                    style={{ fontFamily: 'var(--font-nero)' }}
                >
                    {step.label}
                </motion.h4>

                {/* Desc */}
                <p
                    className="text-[var(--label-md)] font-mono leading-[1.8]"
                    style={{ color: 'rgba(255,255,255,0.38)' }}
                >
                    {step.desc}
                </p>
            </div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export function ServicesPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

    const handleToggle = (i: number) => {
        setOpenIndex(openIndex === i ? null : i);
    };

    return (
        <div className="relative bg-[var(--bg-base)] text-white min-h-screen overflow-x-hidden">
            <SEO title="Services" description="Discover Digdaya Teknokraf's core disciplines — hardware & infrastructure, connectivity, security & trust, software engineering, and creative consulting." />
            <NoiseTexture />

            {/* ══════════════════════════════════════
                HERO
            ══════════════════════════════════════ */}
            <section ref={heroRef} className="relative min-h-[70vh] md:min-h-[80vh] flex flex-col justify-end pb-16 overflow-hidden">
                {/* Ambient glow top-right */}
                <div
                    className="absolute pointer-events-none"
                    style={{
                        top: '-5%', right: '-10%',
                        width: '55vw', height: '55vw',
                        background: `radial-gradient(circle, rgba(242,101,34,0.07) 0%, transparent 65%)`,
                    }}
                />

                {/* Ghost background text */}
                <div className="absolute inset-0 flex items-center justify-end overflow-hidden pointer-events-none select-none pr-[4vw]">
                    <motion.span
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                        aria-hidden="true"
                        className="text-[32vw] md:text-[24vw] font-black uppercase leading-[0.78] select-none"
                        style={{
                            fontFamily: 'var(--font-nero)',
                            color: 'transparent',
                            WebkitTextStroke: '1px rgba(255,255,255,0.028)',
                            y: heroY,
                            opacity: heroOpacity,
                        } as any}
                    >
                        SVC
                    </motion.span>
                </div>

                {/* Section label */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="absolute top-32 left-6 md:left-12 lg:left-16 flex items-center gap-3"
                >
                    <div className="h-[1px] w-5" style={{ background: ORANGE, opacity: 0.5 }} />
                    <span className="text-[0.58rem] font-mono tracking-[0.28em] uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        What We Do
                    </span>
                </motion.div>

                {/* Main headline */}
                <motion.div
                    style={{ y: heroY }}
                    className="relative z-10 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto w-full"
                >
                    <SplitReveal
                        text="OUR"
                        delay={0.25}
                        className="text-[17vw] md:text-[10.5vw] font-black leading-[0.84] tracking-[-0.04em] uppercase"
                        style={{ fontFamily: 'var(--font-nero)', color: 'rgba(255,255,255,0.9)' }}
                    />
                    <SplitReveal
                        text="SERVICES"
                        delay={0.38}
                        className="text-[17vw] md:text-[10.5vw] font-black leading-[0.84] tracking-[-0.04em] uppercase"
                        style={{ fontFamily: 'var(--font-nero)', color: 'transparent', WebkitTextStroke: `1.5px rgba(242,101,34,0.58)` }}
                    />

                    {/* Sub copy */}
                    <Reveal delay={0.75} className="mt-8 max-w-md">
                        <p
                            className="text-[0.72rem] font-mono leading-[1.9]"
                            style={{ color: 'rgba(255,255,255,0.38)' }}
                        >
                            A comprehensive breakdown of our engineering and design capabilities.
                            We deliver uncompromising digital solutions — built to last.
                        </p>
                    </Reveal>

                </motion.div>
            </section>

            {/* ══════════════════════════════════════
                SERVICES ACCORDION
            ══════════════════════════════════════ */}
            <section className="relative px-6 md:px-12 lg:px-16 pt-20 md:pt-28 pb-8">
                {/* Background glow */}
                <div
                    className="absolute pointer-events-none"
                    style={{
                        top: '10%', left: '-10%',
                        width: '40vw', height: '40vw',
                        background: `radial-gradient(circle, rgba(242,101,34,0.04) 0%, transparent 65%)`,
                    }}
                />

                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12 md:gap-16 items-start">

                        {/* Left sticky label */}
                        <div className="lg:sticky lg:top-40">
                            <Reveal delay={0} className="flex flex-col gap-3">
                                <span className="text-[0.58rem] font-mono tracking-[0.28em] uppercase" style={{ color: ORANGE, opacity: 0.75 }}>
                                    § 001
                                </span>
                                <span className="text-[0.58rem] font-mono tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.22)' }}>
                                    Capabilities
                                </span>

                                {/* Vertical service index */}
                                <div className="hidden lg:flex flex-col gap-3 mt-6">
                                    {services.map((s, i) => (
                                        <button
                                            key={s.id}
                                            onClick={() => handleToggle(i)}
                                            className="text-left flex items-center gap-2 group"
                                        >
                                            <motion.div
                                                animate={{ width: openIndex === i ? 16 : 6 }}
                                                transition={{ duration: 0.3 }}
                                                className="h-[1px] shrink-0"
                                                style={{ background: openIndex === i ? s.accentLight : 'rgba(255,255,255,0.2)' }}
                                            />
                                            <motion.span
                                                animate={{ color: openIndex === i ? s.accentLight : 'rgba(255,255,255,0.3)' }}
                                                transition={{ duration: 0.3 }}
                                                className="text-[var(--label-sm)] font-mono tracking-[0.28em] uppercase"
                                            >
                                                {s.short}
                                            </motion.span>
                                        </button>
                                    ))}
                                </div>
                            </Reveal>
                        </div>

                        {/* Accordion */}
                        <div>
                            <Divider />
                            {services.map((service, i) => (
                                <ServiceRow
                                    key={service.id}
                                    service={service}
                                    index={i}
                                    isOpen={openIndex === i}
                                    onToggle={() => handleToggle(i)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                PROCESS SECTION
            ══════════════════════════════════════ */}
            <section className="relative px-6 md:px-12 lg:px-16 pt-24 md:pt-36 pb-8 overflow-hidden">
                <div
                    className="absolute pointer-events-none"
                    style={{
                        top: '20%', right: '-8%',
                        width: '40vw', height: '40vw',
                        background: `radial-gradient(circle, rgba(242,101,34,0.05) 0%, transparent 65%)`,
                    }}
                />

                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12 md:gap-16 items-start">

                        {/* Left label */}
                        <Reveal delay={0} className="lg:sticky lg:top-40">
                            <div className="flex flex-col gap-3">
                                <span className="text-[0.58rem] font-mono tracking-[0.28em] uppercase" style={{ color: ORANGE, opacity: 0.75 }}>
                                    § 002
                                </span>
                                <span className="text-[0.58rem] font-mono tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.22)' }}>
                                    How We Work
                                </span>
                            </div>
                        </Reveal>

                        {/* Right: process headline + grid */}
                        <div className="flex flex-col gap-10">
                            <SplitReveal
                                text="THE PROCESS"
                                delay={0.05}
                                className="text-[8vw] md:text-[3.8vw] font-black uppercase tracking-[-0.03em] leading-none"
                                style={{ fontFamily: 'var(--font-nero)', color: 'rgba(255,255,255,0.85)' }}
                            />

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                                {process.map((step, i) => (
                                    <ProcessStep key={step.step} step={step} index={i} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                MANIFESTO STRIP
            ══════════════════════════════════════ */}
            <section
                className="relative px-6 md:px-12 lg:px-16 py-20 md:py-28 mt-16 overflow-hidden"
                style={{
                    background: '#0a0a0a',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
            >
                {/* Orange accent lines */}
                <div
                    className="absolute top-0 left-0 right-0 h-[1px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${ORANGE}25, transparent)` }}
                />
                <div
                    className="absolute bottom-0 left-0 right-0 h-[1px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${ORANGE}25, transparent)` }}
                />

                <div className="max-w-[1400px] mx-auto flex flex-col gap-3">
                    {[
                        { text: 'NO SHORTCUTS.', outlined: false },
                        { text: 'NO DECORATION.', outlined: true },
                        { text: 'ONLY STRUCTURE.', outlined: false },
                    ].map(({ text, outlined }, i) => (
                        <SplitReveal
                            key={text}
                            text={text}
                            delay={0.07 * i}
                            className="text-[8vw] md:text-[5vw] font-black uppercase leading-[0.9] tracking-[-0.03em]"
                            style={{
                                fontFamily: 'var(--font-nero)',
                                color: outlined ? 'transparent' : 'rgba(255,255,255,0.88)',
                                WebkitTextStroke: outlined ? `1.5px ${ORANGE}` : '0px',
                            }}
                        />
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════════
                CTA
            ══════════════════════════════════════ */}
            <section className="relative px-6 md:px-12 lg:px-16 py-28 md:py-40 overflow-hidden">
                <div
                    className="absolute pointer-events-none"
                    style={{
                        bottom: '-20%', left: '50%', transform: 'translateX(-50%)',
                        width: '60vw', height: '40vw',
                        background: `radial-gradient(ellipse, rgba(242,101,34,0.06) 0%, transparent 65%)`,
                    }}
                />

                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-12 relative z-10">
                    <div className="flex flex-col gap-4">
                        <Reveal delay={0}>
                            <span className="text-[0.58rem] font-mono tracking-[0.28em] uppercase" style={{ color: ORANGE, opacity: 0.7 }}>
                                § 003 — Engage
                            </span>
                        </Reveal>
                        <div>
                            <SplitReveal
                                text="Ready to build"
                                delay={0.1}
                                className="text-[7vw] md:text-[3.8vw] font-black uppercase leading-[0.9] tracking-[-0.03em]"
                                style={{ fontFamily: 'var(--font-nero)', color: 'rgba(255,255,255,0.9)' }}
                            />
                            <SplitReveal
                                text="something real?"
                                delay={0.22}
                                className="text-[7vw] md:text-[3.8vw] font-black uppercase leading-[0.9] tracking-[-0.03em]"
                                style={{ fontFamily: 'var(--font-nero)', color: 'transparent', WebkitTextStroke: `1.5px ${ORANGE}70` }}
                            />
                        </div>
                    </div>

                    <Reveal delay={0.3} className="flex flex-col items-start md:items-end gap-4">
                        <motion.a
                            href="/contact"
                            whileHover={{ backgroundColor: ORANGE, color: '#000', scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ duration: 0.22 }}
                            className="px-8 py-4 border text-[0.6rem] font-mono tracking-[0.22em] uppercase flex items-center gap-3"
                            style={{ borderColor: `${ORANGE}55`, color: 'rgba(255,255,255,0.7)', background: 'transparent' }}
                        >
                            Start a Project <span>→</span>
                        </motion.a>
                        <span className="text-[var(--label-xs)] font-mono tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                            hello@digdaya.id
                        </span>
                    </Reveal>
                </div>
            </section>
        </div>
    );
}