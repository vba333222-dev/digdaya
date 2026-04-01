import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { NoiseTexture } from './NoiseTexture';

// --- Animated grid line ---
const GridLine = ({ direction, position, delay }: { direction: 'h' | 'v'; position: string; delay: number }) => (
    <motion.div
        initial={{ scaleX: direction === 'h' ? 0 : 1, scaleY: direction === 'v' ? 0 : 1 }}
        whileInView={{ scaleX: 1, scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bg-white/[0.03]"
        style={{
            ...(direction === 'h'
                ? { left: 0, right: 0, height: '1px', top: position, originX: 0 }
                : { top: 0, bottom: 0, width: '1px', left: position, originY: 0 }),
        }}
    />
);

// --- Stagger letter reveal ---
const LetterReveal = ({
    text,
    className = '',
    style = {},
    delay = 0,
}: {
    text: string;
    className?: string;
    style?: React.CSSProperties;
    delay?: number;
}) => {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: '-10%' });

    return (
        <span ref={ref} className={`block overflow-hidden ${className}`} style={style}>
            <span className="sr-only">{text}</span>
            <span className="flex flex-wrap" aria-hidden="true">
                {text.split('').map((char, i) => (
                    <motion.span
                        key={i}
                        initial={{ y: '110%', opacity: 0 }}
                        animate={inView ? { y: '0%', opacity: 1 } : {}}
                        transition={{
                            duration: 0.6,
                            delay: delay + i * 0.025,
                            ease: [0.16, 1, 0.3, 1],
                        }}
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

export const Footer = () => {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end end'],
    });

    const headerY = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
    const headerOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

    const linksRef = useRef<HTMLDivElement>(null);
    const linksInView = useInView(linksRef, { once: true, margin: '-15%' });

    const linkVariants = {
        hidden: { opacity: 0, y: 30, x: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                duration: 0.7,
                delay: 0.4 + i * 0.06,
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            },
        }),
    };

    const serviceLinks = [
        { label: 'Hardware & Infra', href: '#services' },
        { label: 'Connectivity', href: '#services' },
        { label: 'Security & Trust', href: '#services' },
        { label: 'Software & Tech', href: '#services' },
        { label: 'Creative Consulting', href: '#services' },
    ];

    const legalLinks = [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Use', href: '#' },
        { label: 'Licenses', href: '#' },
    ];

    const socials = [
        { label: 'LinkedIn', href: '#' },
        { label: 'Twitter/X', href: '#' },
        { label: 'GitHub', href: '#' },
    ];

    return (
        <footer
            ref={containerRef}
            id="contact"
            className="w-full relative overflow-hidden"
            style={{ background: '#050505' }}
        >
            {/* Noise texture */}
            <NoiseTexture opacity={0.06} />

            {/* Animated tech grid lines */}
            <div className="absolute inset-0 pointer-events-none">
                <GridLine direction="h" position="20%" delay={0.2} />
                <GridLine direction="h" position="55%" delay={0.4} />
                <GridLine direction="h" position="85%" delay={0.6} />
                <GridLine direction="v" position="33%" delay={0.3} />
                <GridLine direction="v" position="66%" delay={0.5} />
            </div>

            {/* Top border line with glow */}
            <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-[1px] origin-left"
                style={{
                    background: 'linear-gradient(90deg, transparent 0%, #F26522 30%, #F26522 70%, transparent 100%)',
                }}
            />

            {/* Main content */}
            <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-16 pt-20 md:pt-28 pb-12">

                {/* Header: Section label + CTA */}
                <motion.div
                    style={{ y: headerY, opacity: headerOpacity }}
                    className="flex items-center justify-between mb-20 md:mb-28"
                >
                    <div className="flex items-center gap-4">
                        <span className="text-[0.6rem] font-bold tracking-[0.3em] text-[#F26522] uppercase">
                            Contact
                        </span>
                        <div className="h-[1px] w-16 bg-[#F26522]/30" />
                    </div>
                    <motion.a
                        href="mailto:hello@digdaya.id"
                        className="text-[0.7rem] font-mono tracking-[0.2em] text-white/30 uppercase hover:text-[#F26522] transition-colors duration-500"
                        whileHover={{ x: 5 }}
                    >
                        hello@digdaya.id →
                    </motion.a>
                </motion.div>

                {/* CTA — Get in Touch */}
                <div className="mb-16 md:mb-24">
                    <motion.a
                        href="mailto:hello@digdaya.id"
                        className="group block cursor-none"
                        whileHover="hover"
                        initial="idle"
                    >
                        <span className="text-[0.6rem] font-bold tracking-[0.3em] text-white/20 uppercase block mb-4">
                            Ready to start?
                        </span>
                        <span
                            className="text-[10vw] md:text-[5.5vw] font-black leading-[0.9] tracking-[-0.03em] uppercase text-white/80 group-hover:text-[#F26522] transition-colors duration-500 block"
                            style={{ fontFamily: 'var(--font-nero)' }}
                        >
                            Get in Touch →
                        </span>
                        <motion.div
                            className="h-[2px] bg-[#F26522] mt-4 origin-left"
                            variants={{
                                idle: { scaleX: 0 },
                                hover: { scaleX: 1 },
                            }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                        />
                    </motion.a>
                </div>

                {/* Giant logo text */}
                <div className="mb-20 md:mb-28">
                    <LetterReveal
                        text="DIGDAYA"
                        delay={0.1}
                        className="text-[20vw] md:text-[12vw] font-black leading-[0.8] tracking-[-0.05em] uppercase"
                        style={{
                            fontFamily: 'var(--font-nero)',
                            color: 'transparent',
                            WebkitTextStroke: '1.5px rgba(242,101,34,0.4)',
                        }}
                    />
                    <LetterReveal
                        text="TEKNOKRAF"
                        delay={0.4}
                        className="text-[20vw] md:text-[12vw] font-black leading-[0.8] tracking-[-0.05em] uppercase"
                        style={{
                            fontFamily: 'var(--font-nero)',
                            color: '#F26522',
                        }}
                    />
                </div>

                {/* Links grid */}
                <div
                    ref={linksRef}
                    className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 pb-16 md:pb-20"
                >
                    {/* Services column */}
                    <div className="flex flex-col gap-3">
                        <motion.span
                            custom={0}
                            initial="hidden"
                            animate={linksInView ? 'visible' : 'hidden'}
                            variants={linkVariants}
                            className="text-[0.6rem] font-bold tracking-[0.3em] text-white/20 uppercase mb-4"
                        >
                            Services
                        </motion.span>
                        {serviceLinks.map((link, i) => (
                            <motion.a
                                key={link.label}
                                href={link.href}
                                custom={i + 1}
                                initial="hidden"
                                animate={linksInView ? 'visible' : 'hidden'}
                                variants={linkVariants}
                                className="group flex items-center gap-2 text-sm font-light text-white/30 hover:text-[#F26522] transition-all duration-300"
                            >
                                <span className="text-[8px] text-[#F26522] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                    ▸
                                </span>
                                {link.label}
                            </motion.a>
                        ))}
                    </div>

                    {/* Social column */}
                    <div className="flex flex-col gap-3">
                        <motion.span
                            custom={0}
                            initial="hidden"
                            animate={linksInView ? 'visible' : 'hidden'}
                            variants={linkVariants}
                            className="text-[0.6rem] font-bold tracking-[0.3em] text-white/20 uppercase mb-4"
                        >
                            Connect
                        </motion.span>
                        {socials.map((link, i) => (
                            <motion.a
                                key={link.label}
                                href={link.href}
                                custom={i + 7}
                                initial="hidden"
                                animate={linksInView ? 'visible' : 'hidden'}
                                variants={linkVariants}
                                className="group flex items-center gap-2 text-sm font-light text-white/30 hover:text-white transition-all duration-300"
                            >
                                <span className="text-[8px] text-white/20 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                    ▸
                                </span>
                                {link.label}
                            </motion.a>
                        ))}
                    </div>

                    {/* Legal column */}
                    <div className="flex flex-col gap-3">
                        <motion.span
                            custom={0}
                            initial="hidden"
                            animate={linksInView ? 'visible' : 'hidden'}
                            variants={linkVariants}
                            className="text-[0.6rem] font-bold tracking-[0.3em] text-white/20 uppercase mb-4"
                        >
                            Legal
                        </motion.span>
                        {legalLinks.map((link, i) => (
                            <motion.a
                                key={link.label}
                                href={link.href}
                                custom={i + 10}
                                initial="hidden"
                                animate={linksInView ? 'visible' : 'hidden'}
                                variants={linkVariants}
                                className="group flex items-center gap-2 text-sm font-light text-white/30 hover:text-white transition-all duration-300"
                            >
                                <span className="text-[8px] text-white/20 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                    ▸
                                </span>
                                {link.label}
                            </motion.a>
                        ))}
                    </div>

                    {/* Info column */}
                    <div className="flex flex-col gap-3">
                        <motion.span
                            custom={0}
                            initial="hidden"
                            animate={linksInView ? 'visible' : 'hidden'}
                            variants={linkVariants}
                            className="text-[0.6rem] font-bold tracking-[0.3em] text-white/20 uppercase mb-4"
                        >
                            Headquarters
                        </motion.span>
                        <motion.p
                            custom={14}
                            initial="hidden"
                            animate={linksInView ? 'visible' : 'hidden'}
                            variants={linkVariants}
                            className="text-sm font-light text-white/20 leading-relaxed"
                        >
                            Jakarta, Indonesia
                        </motion.p>
                        <motion.span
                            custom={15}
                            initial="hidden"
                            animate={linksInView ? 'visible' : 'hidden'}
                            variants={linkVariants}
                            className="text-[0.6rem] font-mono text-white/10 tracking-wider mt-4"
                        >
                            LAT -6.2088 / LNG 106.8456
                        </motion.span>
                    </div>
                </div>

                {/* Bottom bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
                >
                    <span className="text-[0.6rem] font-mono text-white/15 tracking-[0.15em] uppercase">
                        © 2026 Digdaya Teknokraf Indonesia. All rights reserved.
                    </span>
                    <div className="flex items-center gap-6">
                        <span className="text-[0.55rem] font-mono text-white/10 tracking-wider">
                            SYS.v2.0.26
                        </span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                            <span className="text-[0.55rem] font-mono text-white/15 tracking-wider">
                                ALL SYSTEMS OPERATIONAL
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom glow */}
            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px]"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(242,101,34,0.2), transparent)',
                }}
            />
        </footer>
    );
};
