import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NoiseTexture } from '../components/NoiseTexture';
import { SEO } from '../components/SEO';

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const ORANGE = '#F26522';

const pillars = [
    {
        num: '01',
        title: 'Engineering',
        body: 'We build high-performance systems from the ground up — scalable B2B platforms, robust APIs, and infrastructure that holds under pressure.',
    },
    {
        num: '02',
        title: 'Design',
        body: 'Brutalist by conviction. Every pixel earns its place. We strip away ornamentation to expose raw structure and uncompromising function.',
    },
    {
        num: '03',
        title: 'Strategy',
        body: 'We think in systems. Before a single line of code, we map the architecture of your product against the landscape it must dominate.',
    },
];

const manifesto = [
    'WE DO NOT DECORATE.',
    'WE CONSTRUCT.',
    'WE BUILD WHAT LASTS.',
];

// ─────────────────────────────────────────────
// SCROLL-TRIGGERED REVEAL
// ─────────────────────────────────────────────
const Reveal = ({
    children,
    delay = 0,
    y = 40,
    className = '',
}: {
    children: React.ReactNode;
    delay?: number;
    y?: number;
    className?: string;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px 0px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y, filter: 'blur(4px)' }}
            animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 1.0, delay, ease: [0.16, 1, 0.3, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// ─────────────────────────────────────────────
// CHAR-BY-CHAR REVEAL FOR HEADLINE
// ─────────────────────────────────────────────
const SplitReveal = ({ text, delay = 0, className = '', style = {} }: {
    text: string; delay?: number; className?: string; style?: React.CSSProperties;
}) => {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: '-60px 0px' });
    return (
        <span ref={ref} className={`block overflow-hidden ${className}`} style={style}>
            <motion.span
                className="flex flex-wrap"
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                variants={{ visible: { transition: { staggerChildren: 0.025, delayChildren: delay } } }}
            >
                {text.split('').map((ch, i) => (
                    <motion.span
                        key={i}
                        style={{ whiteSpace: ch === ' ' ? 'pre' : undefined }}
                        variants={{
                            hidden: { y: '110%', opacity: 0 },
                            visible: { y: '0%', opacity: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
                        }}
                    >
                        {ch}
                    </motion.span>
                ))}
            </motion.span>
        </span>
    );
};

// ─────────────────────────────────────────────
// HORIZONTAL MARQUEE
// ─────────────────────────────────────────────
const Marquee = ({ items }: { items: string[] }) => (
    <div className="overflow-hidden whitespace-nowrap">
        <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            className="inline-flex"
        >
            {[...items, ...items].map((item, i) => (
                <span key={i} className="inline-flex items-center">
                    <span
                        className="text-[var(--label-sm)] font-mono tracking-[0.22em] uppercase px-8"
                        style={{ color: 'rgba(255,255,255,0.18)' }}
                    >
                        {item}
                    </span>
                    <span style={{ color: ORANGE, opacity: 0.35, fontSize: '0.5rem' }}>◆</span>
                </span>
            ))}
        </motion.div>
    </div>
);

// ─────────────────────────────────────────────
// SECTION DIVIDER
// ─────────────────────────────────────────────
const Divider = ({ delay = 0 }: { delay?: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true });
    return (
        <div ref={ref} className="w-full overflow-hidden">
            <motion.div
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: 'left center', background: 'rgba(255,255,255,0.08)', height: '1px' }}
            />
        </div>
    );
};

// ─────────────────────────────────────────────
// PARALLAX GHOST TEXT
// ─────────────────────────────────────────────
const ParallaxGhost = ({ text, speed = 0.12 }: { text: string; speed?: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);
    return (
        <div ref={ref} className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
            <motion.span
                style={{ y, fontFamily: 'var(--font-nero)', color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.025)' }}
                className="text-[28vw] font-black uppercase leading-none"
            >
                {text}
            </motion.span>
        </div>
    );
};

// ─────────────────────────────────────────────
// ABOUT PAGE
// ─────────────────────────────────────────────
export function About() {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(heroScroll, [0, 1], ['0%', '28%']);
    const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);

    return (
        <div className="relative bg-[var(--bg-base)] text-white min-h-screen overflow-x-hidden">
            <SEO title="About" description="Learn about Digdaya Teknokraf — a multi-disciplinary technology firm engineering the physical frontier since 2019." />
            <NoiseTexture />

            {/* ══════════════════════════════════════
                SECTION 1 — HERO
            ══════════════════════════════════════ */}
            <section ref={heroRef} className="relative min-h-screen flex flex-col justify-end pb-16 md:pb-20 overflow-hidden">
                {/* Ambient glow */}
                <div
                    className="absolute pointer-events-none"
                    style={{
                        top: '10%', right: '-8%',
                        width: '55vw', height: '55vw',
                        background: `radial-gradient(circle, rgba(242,101,34,0.07) 0%, transparent 65%)`,
                    }}
                />

                {/* Ghost BG text */}
                <div className="absolute inset-0 flex items-center justify-end overflow-hidden pointer-events-none select-none pr-[5vw]">
                    <motion.span
                        className="text-[32vw] font-black uppercase leading-[0.8]"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        aria-hidden="true"
                        style={{
                            fontFamily: 'var(--font-nero)',
                            color: 'transparent',
                            WebkitTextStroke: '1px rgba(255,255,255,0.032)',
                            y: heroY,
                            opacity: heroOpacity,
                        } as any}
                    >
                        ABOUT
                    </motion.span>
                </div>

                {/* Top label */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="absolute top-32 left-6 md:left-12 lg:left-16 flex items-center gap-3"
                >
                    <div className="h-[1px] w-6" style={{ background: ORANGE, opacity: 0.5 }} />
                    <span className="text-[var(--label-sm)] font-mono tracking-[0.28em] uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        About Digdaya
                    </span>
                </motion.div>

                {/* Main headline */}
                <motion.div
                    style={{ y: heroY }}
                    className="relative z-10 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto w-full"
                >
                    <SplitReveal
                        text="ENGINEERING"
                        delay={0.3}
                        className="text-[14vw] md:text-[9vw] font-black leading-[0.88] tracking-[-0.03em] uppercase"
                        style={{ fontFamily: 'var(--font-nero)', color: 'rgba(255,255,255,0.9)' }}
                    />
                    <SplitReveal
                        text="THE DIGITAL &"
                        delay={0.45}
                        className="text-[14vw] md:text-[9vw] font-black leading-[0.88] tracking-[-0.03em] uppercase"
                        style={{ fontFamily: 'var(--font-nero)', color: 'transparent', WebkitTextStroke: `1.5px rgba(242,101,34,0.6)` }}
                    />
                    <SplitReveal
                        text="PHYSICAL FRONTIER"
                        delay={0.6}
                        className="text-[9vw] md:text-[5.5vw] font-black leading-[0.88] tracking-[-0.03em] uppercase"
                        style={{ fontFamily: 'var(--font-nero)', color: 'transparent', WebkitTextStroke: `1px rgba(255,255,255,0.22)` }}
                    />

                    {/* Scroll cue */}
                    <Reveal delay={1.1} className="mt-10 flex items-center gap-4">
                        <motion.div
                            animate={{ y: [0, 7, 0] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-[1px] h-8"
                            style={{ background: `linear-gradient(to bottom, ${ORANGE}80, transparent)` }}
                        />
                        <span className="text-[var(--label-xs)] font-mono tracking-[0.3em] uppercase" style={{ color: 'rgba(255,255,255,0.22)' }}>
                            Scroll to explore
                        </span>
                    </Reveal>
                </motion.div>
            </section>

            {/* ══════════════════════════════════════
                MARQUEE DIVIDER
            ══════════════════════════════════════ */}
            <div className="border-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <Marquee items={[
                    'Brutalist by Conviction',
                    'Engineering Excellence',
                    'High-Performance Systems',
                    'Jakarta Indonesia',
                    'Est. 2019',
                    'B2B Platforms',
                    'Digital Architecture',
                ]} />
            </div>

            {/* ══════════════════════════════════════
                SECTION 2 — IDENTITY
            ══════════════════════════════════════ */}
            <section className="relative py-24 md:py-36 px-6 md:px-12 lg:px-16 overflow-hidden">
                <ParallaxGhost text="WHO" speed={0.10} />

                <div className="relative z-10 max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 md:gap-20 items-start">

                        {/* Left — section label */}
                        <Reveal delay={0} className="lg:sticky lg:top-40">
                            <div className="flex flex-col gap-3">
                                <span
                                    className="text-[0.58rem] font-mono tracking-[0.28em] uppercase"
                                    style={{ color: ORANGE, opacity: 0.8 }}
                                >
                                    § 001
                                </span>
                                <span
                                    className="text-[var(--label-sm)] font-mono tracking-[0.2em] uppercase"
                                    style={{ color: 'rgba(255,255,255,0.22)' }}
                                >
                                    Identity
                                </span>
                            </div>
                        </Reveal>

                        {/* Right — content */}
                        <div className="flex flex-col gap-16">
                            <Reveal delay={0.1}>
                                <p
                                    className="text-[4.5vw] md:text-[2.2vw] lg:text-[1.8vw] font-black uppercase leading-[1.15] tracking-[-0.02em]"
                                    style={{ fontFamily: 'var(--font-nero)', color: 'rgba(255,255,255,0.88)' }}
                                >
                                    Digdaya Teknokraf is a{' '}
                                    <span style={{ color: ORANGE }}>collective of engineers</span>{' '}
                                    and brutalist designers building the digital infrastructure of tomorrow.
                                </p>
                            </Reveal>

                            <Divider delay={0.1} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Reveal delay={0.15}>
                                    <div className="flex flex-col gap-3">
                                        <h3
                                            className="text-[0.6rem] font-mono tracking-[0.22em] uppercase"
                                            style={{ color: ORANGE }}
                                        >
                                            Our Mission
                                        </h3>
                                        <p
                                            className="text-[0.78rem] font-mono leading-[1.85] text-justify"
                                            style={{ color: 'rgba(255,255,255,0.55)' }}
                                        >
                                            To architect definitive digital experiences. We engineer rigorous,
                                            high-performance systems and B2B platforms, employing a brutalist
                                            methodology that strips away the non-essential to reveal true
                                            function and form.
                                        </p>
                                    </div>
                                </Reveal>

                                <Reveal delay={0.25}>
                                    <div className="flex flex-col gap-3">
                                        <h3
                                            className="text-[0.6rem] font-mono tracking-[0.22em] uppercase"
                                            style={{ color: ORANGE }}
                                        >
                                            History
                                        </h3>
                                        <p
                                            className="text-[0.78rem] font-mono leading-[1.85] text-justify"
                                            style={{ color: 'rgba(255,255,255,0.55)' }}
                                        >
                                            Founded in 2019, Digdaya Teknokraf emerged from the void to challenge
                                            conventional digital aesthetics. We are a collective of hardcore
                                            engineers and brutalist designers constructing the web of tomorrow —
                                            from Jakarta to the global arena.
                                        </p>
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                SECTION 4 — THREE PILLARS
            ══════════════════════════════════════ */}
            <section className="relative py-24 md:py-36 px-6 md:px-12 lg:px-16 overflow-hidden">
                <ParallaxGhost text="HOW" speed={0.08} />

                <div className="relative z-10 max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 md:gap-20 items-start">

                        <Reveal delay={0} className="lg:sticky lg:top-40">
                            <div className="flex flex-col gap-3">
                                <span className="text-[var(--label-sm)] font-mono tracking-[0.28em] uppercase" style={{ color: ORANGE, opacity: 0.8 }}>
                                    § 002
                                </span>
                                <span className="text-[0.58rem] font-mono tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.22)' }}>
                                    Our Pillars
                                </span>
                            </div>
                        </Reveal>

                        <div className="flex flex-col">
                            {pillars.map((pillar, i) => (
                                <Reveal key={pillar.num} delay={0.1 * i}>
                                    <motion.div
                                        whileHover={{ x: 6 }}
                                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                        className="group py-10 md:py-12 flex flex-col md:flex-row md:items-start gap-6 md:gap-10 border-b"
                                        style={{ borderColor: 'rgba(255,255,255,0.07)' }}
                                    >
                                        {/* Number */}
                                        <span
                                            className="text-[0.6rem] font-mono tracking-[0.2em] shrink-0 pt-1 transition-colors duration-300"
                                            style={{ color: 'rgba(242,101,34,0.45)' }}
                                        >
                                            {pillar.num}
                                        </span>

                                        {/* Content */}
                                        <div className="flex flex-col gap-4 flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3
                                                    className="text-[7vw] md:text-[3.2vw] font-black uppercase tracking-[-0.025em] leading-none"
                                                    style={{ fontFamily: 'var(--font-nero)', color: 'rgba(255,255,255,0.9)' }}
                                                >
                                                    {pillar.title}
                                                </h3>
                                                <motion.span
                                                    animate={{ x: 0, opacity: 0.4 }}
                                                    whileHover={{ x: 4, opacity: 1 }}
                                                    className="text-xs font-mono opacity-0 group-hover:opacity-40 transition-opacity duration-300"
                                                    style={{ color: ORANGE }}
                                                >
                                                    →
                                                </motion.span>
                                            </div>
                                            <p
                                                className="text-[0.75rem] font-mono leading-[1.9] max-w-xl"
                                                style={{ color: 'rgba(255,255,255,0.48)' }}
                                            >
                                                {pillar.body}
                                            </p>
                                        </div>
                                    </motion.div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                SECTION 5 — MANIFESTO STRIP
            ══════════════════════════════════════ */}
            <section className="relative py-24 md:py-32 overflow-hidden" style={{ background: '#0a0a0a' }}>
                {/* Horizontal orange line */}
                <div
                    className="absolute top-0 left-0 right-0 h-[1px]"
                    style={{ background: `linear-gradient(90deg, transparent 0%, ${ORANGE}30 30%, ${ORANGE}30 70%, transparent 100%)` }}
                />
                <div
                    className="absolute bottom-0 left-0 right-0 h-[1px]"
                    style={{ background: `linear-gradient(90deg, transparent 0%, ${ORANGE}30 30%, ${ORANGE}30 70%, transparent 100%)` }}
                />

                <div className="px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto flex flex-col gap-3 md:gap-4">
                    {manifesto.map((line, i) => (
                        <SplitReveal
                            key={i}
                            text={line}
                            delay={0.08 * i}
                            className="text-[7.5vw] md:text-[4.5vw] font-black uppercase leading-[0.92] tracking-[-0.03em]"
                            style={{
                                fontFamily: 'var(--font-nero)',
                                color: i === 1 ? 'transparent' : 'rgba(255,255,255,0.88)',
                                WebkitTextStroke: i === 1 ? `1.5px ${ORANGE}` : '0px',
                            }}
                        />
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════════
                SECTION 6 — CTA
            ══════════════════════════════════════ */}
            <section className="relative py-28 md:py-40 px-6 md:px-12 lg:px-16 overflow-hidden">
                <div
                    className="absolute pointer-events-none"
                    style={{
                        bottom: '-20%', left: '50%', transform: 'translateX(-50%)',
                        width: '60vw', height: '40vw',
                        background: `radial-gradient(ellipse, rgba(242,101,34,0.06) 0%, transparent 65%)`,
                    }}
                />

                <div className="relative z-10 max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
                    <div className="flex flex-col gap-5 max-w-xl">
                        <Reveal delay={0}>
                            <span className="text-[var(--label-sm)] font-mono tracking-[0.28em] uppercase" style={{ color: ORANGE, opacity: 0.7 }}>
                                § 003 — Contact
                            </span>
                        </Reveal>
                        <SplitReveal
                            text="Ready to build"
                            delay={0.1}
                            className="text-[8vw] md:text-[4vw] font-black uppercase leading-[0.9] tracking-[-0.03em]"
                            style={{ fontFamily: 'var(--font-nero)', color: 'rgba(255,255,255,0.88)' }}
                        />
                        <SplitReveal
                            text="something real?"
                            delay={0.2}
                            className="text-[8vw] md:text-[4vw] font-black uppercase leading-[0.9] tracking-[-0.03em]"
                            style={{ fontFamily: 'var(--font-nero)', color: 'transparent', WebkitTextStroke: `1.5px ${ORANGE}80` }}
                        />
                    </div>

                    <Reveal delay={0.3} className="flex flex-col items-start md:items-end gap-4">
                        <Link
                            to="/contact"
                            className="inline-block px-8 py-4 text-[var(--label-sm)] font-mono tracking-[0.22em] uppercase border hover:bg-[var(--brand)] transition-all duration-300"
                            style={{
                                borderColor: `${ORANGE}60`,
                                color: 'rgba(255,255,255,0.8)',
                            }}
                        >
                            Start a Project →
                        </Link>
                        <span className="text-[var(--label-xs)] font-mono tracking-[0.15em] uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>
                            hello@digdaya.id
                        </span>
                    </Reveal>
                </div>
            </section>
        </div>
    );
}