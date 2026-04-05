import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { NoiseTexture } from './NoiseTexture';

// ─── Primitive: scroll-driven word reveal ───────────────────────────────────
const RevealWord = ({
    word,
    range,
    progress,
    className = '',
    style = {},
}: {
    word: string;
    range: [number, number];
    progress: ReturnType<typeof useScroll>['scrollYProgress'];
    className?: string;
    style?: React.CSSProperties;
}) => {
    const opacity = useTransform(progress, range, [0.06, 1]);
    const y = useTransform(progress, range, [28, 0]);
    const blur = useTransform(progress, range, [6, 0]);
    const filter = useTransform(blur, (v) => `blur(${v}px)`);
    return (
        <motion.span
            style={{ opacity, y, filter, display: 'inline-block', marginRight: '0.25em', ...style }}
            className={className}
        >
            {word}
        </motion.span>
    );
};

// ─── Primitive: expanding rule ──────────────────────────────────────────────
const RevealLine = ({
    range, progress,
    width = '100%',
    color = 'rgba(242,101,34,0.35)',
    className = '',
}: {
    range: [number, number];
    progress: ReturnType<typeof useScroll>['scrollYProgress'];
    width?: string; color?: string; className?: string;
}) => {
    const scaleX = useTransform(progress, range, [0, 1]);
    const opacity = useTransform(progress, range, [0, 1]);
    return (
        <motion.div
            style={{ scaleX, opacity, width, background: color }}
            className={`h-px origin-left ${className}`}
        />
    );
};

// ─── Main ───────────────────────────────────────────────────────────────────
export const Vision = () => {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    // Cinematic section transition
    const sectionOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
    const sectionScale = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.85, 1, 1, 0.95]);

    const getRange = (i: number, total: number, base = 0.18, span = 0.42): [number, number] => {
        const start = base + (i / total) * span;
        return [start, Math.min(start + 0.055, 0.82)];
    };

    const group1Words = ['We', 'engineer'];
    const group3Words = ['For', 'globally', 'recognized'];
    const group4Words = ['Companies', 'to', 'early-stage'];
    const group5Words = ['Startups.'];
    const allWords = [...group1Words, 'physical', '&', 'digital', 'future', ...group3Words, ...group4Words, ...group5Words];
    const total = allWords.length;
    let idx = 0;

    // Motion values
    const imageParallaxY = useTransform(scrollYProgress, [0, 1], ['-18%', '18%']);
    const bgTextY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);
    const orbY1 = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
    const orbY2 = useTransform(scrollYProgress, [0, 1], ['8%', '-12%']);
    const taglineOpacity = useTransform(scrollYProgress, [0.12, 0.24], [0, 1]);
    const bgTextOpacity = useTransform(scrollYProgress, [0.08, 0.25, 0.75, 0.92], [0, 0.04, 0.04, 0]);

    const displayClass = 'text-[13vw] md:text-[7.5vw] font-black leading-[0.88] tracking-[-0.04em] uppercase';
    const outlineClass = 'text-[8.5vw] md:text-[4.8vw] font-black leading-[0.9] tracking-[-0.03em] uppercase';
    const outlineStyle: React.CSSProperties = {
        fontFamily: 'var(--font-nero)',
        color: 'transparent',
        WebkitTextStroke: '1px rgba(255,255,255,0.18)',
    };

    return (
        <section
            ref={containerRef}
            id="vision"
            className="w-full relative min-h-[180vh]"
            style={{ background: 'var(--bg-pure)' }}
        >
            {/*
             * ╔══════════════════════════════════════════════════╗
             * ║  STICKY CONTAINER — one stacking context         ║
             * ║  Background + content all live here so z-index   ║
             * ║  is unambiguous and nothing gets clipped/covered. ║
             * ╚══════════════════════════════════════════════════╝
             */}
            <motion.div
                className="sticky top-0 h-screen w-full overflow-hidden transform-gpu"
                style={{ isolation: 'isolate', opacity: sectionOpacity, scale: sectionScale }}
            >

                {/* ── BG 0: deep base gradient ──────────────────── */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        zIndex: 0,
                        background: `
                            radial-gradient(ellipse 100% 70% at 18% 50%, rgba(18,8,4,0.95) 0%, transparent 65%),
                            radial-gradient(ellipse 80% 60% at 82% 18%, rgba(4,6,22,0.9) 0%, transparent 60%),
                            linear-gradient(158deg, #04040e 0%, #060614 30%, #08060b 65%, #030308 100%)
                        `,
                    }}
                />

                {/* ── BG 1a: ember orb, left ─────────────────────── */}
                <motion.div
                    className="absolute pointer-events-none"
                    style={{
                        zIndex: 1,
                        y: orbY1,
                        top: '5%', left: '-10%',
                        width: '58vw', height: '58vw',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(242,101,34,0.18) 0%, rgba(180,55,8,0.08) 42%, transparent 68%)',
                        filter: 'blur(72px)',
                    }}
                />

                {/* ── BG 1b: indigo orb, top-right ──────────────── */}
                <motion.div
                    className="absolute pointer-events-none"
                    style={{
                        zIndex: 1,
                        y: orbY2,
                        top: '-14%', right: '-10%',
                        width: '50vw', height: '50vw',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(55,38,210,0.13) 0%, rgba(28,18,140,0.06) 44%, transparent 70%)',
                        filter: 'blur(85px)',
                    }}
                />

                {/* ── BG 2: dot matrix ──────────────────────────── */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        zIndex: 2,
                        opacity: 0.042,
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.85) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />

                {/* ── BG 3: vertical accent rule ────────────────── */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
                    <div
                        className="absolute top-0 bottom-0"
                        style={{
                            right: '30%', width: '1px',
                            background: 'linear-gradient(to bottom, transparent 0%, rgba(242,101,34,0.11) 25%, rgba(242,101,34,0.16) 50%, rgba(242,101,34,0.11) 75%, transparent 100%)',
                        }}
                    />
                </div>

                {/* ── BG 4: scanlines ───────────────────────────── */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        zIndex: 4,
                        opacity: 0.016,
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,1) 3px, rgba(255,255,255,1) 4px)',
                    }}
                />

                {/* ── BG 5: radial vignette ─────────────────────── */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        zIndex: 5,
                        background: 'radial-gradient(ellipse 88% 82% at 50% 50%, transparent 18%, rgba(1,1,10,0.52) 58%, rgba(0,0,6,0.92) 100%)',
                    }}
                />

                {/* ── BG 6: edge bars ───────────────────────────── */}
                <div className="absolute inset-x-0 top-0 h-28 pointer-events-none"
                    style={{ zIndex: 6, background: 'linear-gradient(to bottom, rgba(3,3,8,0.88) 0%, transparent 100%)' }} />
                <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
                    style={{ zIndex: 6, background: 'linear-gradient(to top, rgba(3,3,8,0.88) 0%, transparent 100%)' }} />

                {/* ── BG 7: noise canvas ────────────────────────── */}
                <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 7 }}>
                    <NoiseTexture opacity={0.08} />
                </div>

                {/* ══════════════════════════════════════════════
                    CONTENT (z-index 10+)
                ══════════════════════════════════════════════ */}

                {/* Ghost "VISION" text */}
                <motion.div
                    style={{ opacity: bgTextOpacity, y: bgTextY, zIndex: 10 }}
                    className="absolute inset-0 flex items-center justify-end pr-[5vw] pointer-events-none select-none"
                >
                    <span
                        className="text-[28vw] font-black uppercase leading-none"
                        style={{
                            fontFamily: 'var(--font-nero)',
                            color: 'transparent',
                            WebkitTextStroke: '1px rgba(255,255,255,0.032)',
                            letterSpacing: '-0.04em',
                        }}
                    >
                        VISION
                    </span>
                </motion.div>

                {/* Primary content wrapper */}
                <div
                    className="absolute inset-0 flex items-center"
                    style={{ zIndex: 20 }}
                >
                    <div className="w-full max-w-[1440px] mx-auto px-6 md:px-16">

                        {/* ── Section label ── */}
                        <motion.div
                            style={{ opacity: taglineOpacity }}
                            className="flex items-center justify-between mb-10 md:mb-14"
                        >
                            <div className="flex items-center gap-4">
                                <motion.div
                                    className="w-1.5 h-1.5 rounded-full bg-[#F26522]"
                                    animate={{ scale: [1, 1.7, 1], opacity: [1, 0.35, 1] }}
                                    transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                                />
                                <span className="text-[0.55rem] font-mono tracking-[0.35em] text-[#F26522] uppercase">
                                    Our Vision
                                </span>
                                <div className="h-px w-10 bg-[#F26522]/25" />
                            </div>
                            <span className="hidden md:block text-[0.5rem] font-mono tracking-[0.3em] text-white/20 uppercase">
                                Est. 2019
                            </span>
                        </motion.div>

                        {/* ── Typography ── */}
                        <div className="flex flex-col gap-1 md:gap-2">

                            {/* Row 1 — italic accent */}
                            <div className="flex items-baseline gap-[0.25em] mb-1">
                                {group1Words.map((word) => {
                                    const i = idx++;
                                    return (
                                        <RevealWord
                                            key={i}
                                            word={word}
                                            range={getRange(i, total)}
                                            progress={scrollYProgress}
                                            className="text-[5.5vw] md:text-[2.8vw] font-light italic"
                                            style={{ fontFamily: 'var(--font-body)', color: '#F26522', letterSpacing: '-0.01em' }}
                                        />
                                    );
                                })}
                            </div>

                            <RevealLine range={[0.20, 0.30]} progress={scrollYProgress} width="22%" color="rgba(242,101,34,0.28)" className="mb-3" />

                            {/* Row 2 — PHYSICAL [pill] & DIGITAL [pill] FUTURE */}
                            <div className="flex flex-wrap items-center gap-y-1">
                                <RevealWord
                                    word="physical"
                                    range={getRange(idx++, total)}
                                    progress={scrollYProgress}
                                    className={displayClass}
                                    style={{ fontFamily: 'var(--font-nero)', color: '#FFFFFF' }}
                                />

                                {/* Pill 1 */}
                                <motion.span
                                    className="inline-block align-middle mx-[1.2vw] overflow-hidden bg-[#111] relative flex-shrink-0"
                                    style={{
                                        width: 'clamp(56px, 10vw, 138px)',
                                        height: 'clamp(28px, 5vw, 68px)',
                                        borderRadius: '999px',
                                        boxShadow: '0 0 0 1px rgba(242,101,34,0.20), 0 8px 32px rgba(0,0,0,0.65)',
                                    }}
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <motion.img
                                        src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop"
                                        className="absolute top-0 left-0 w-full object-cover mix-blend-luminosity opacity-70"
                                        style={{ y: imageParallaxY, height: '140%' }}
                                        alt=""
                                    />
                                    <div className="absolute inset-0" style={{ background: 'rgba(242,101,34,0.14)', mixBlendMode: 'multiply' }} />
                                </motion.span>

                                <RevealWord
                                    word="&"
                                    range={getRange(idx++, total)}
                                    progress={scrollYProgress}
                                    className={displayClass}
                                    style={{ fontFamily: 'var(--font-nero)', color: '#F26522' }}
                                />

                                <RevealWord
                                    word="digital"
                                    range={getRange(idx++, total)}
                                    progress={scrollYProgress}
                                    className={displayClass}
                                    style={{ fontFamily: 'var(--font-nero)', color: '#FFFFFF' }}
                                />

                                {/* Pill 2 */}
                                <motion.span
                                    className="inline-block align-middle mx-[1.2vw] overflow-hidden bg-[#111] relative flex-shrink-0"
                                    style={{
                                        width: 'clamp(56px, 10vw, 138px)',
                                        height: 'clamp(28px, 5vw, 68px)',
                                        borderRadius: '999px',
                                        boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 8px 32px rgba(0,0,0,0.65)',
                                    }}
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <motion.img
                                        src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop"
                                        className="absolute top-0 left-0 w-full object-cover mix-blend-luminosity opacity-60"
                                        style={{ y: imageParallaxY, height: '140%' }}
                                        alt=""
                                    />
                                </motion.span>

                                <RevealWord
                                    word="future"
                                    range={getRange(idx++, total)}
                                    progress={scrollYProgress}
                                    className={displayClass}
                                    style={{ fontFamily: 'var(--font-nero)', color: '#FFFFFF' }}
                                />
                            </div>

                            <RevealLine range={[0.33, 0.44]} progress={scrollYProgress} width="55%" color="rgba(255,255,255,0.07)" className="my-4" />

                            {/* Row 3 — outline strokes */}
                            <div className="flex flex-wrap items-baseline">
                                {group3Words.map((word) => {
                                    const i = idx++;
                                    return (
                                        <RevealWord key={i} word={word} range={getRange(i, total)} progress={scrollYProgress}
                                            className={outlineClass} style={outlineStyle} />
                                    );
                                })}
                            </div>

                            {/* Row 4 — outline strokes */}
                            <div className="flex flex-wrap items-baseline">
                                {group4Words.map((word) => {
                                    const i = idx++;
                                    return (
                                        <RevealWord key={i} word={word} range={getRange(i, total)} progress={scrollYProgress}
                                            className={outlineClass} style={outlineStyle} />
                                    );
                                })}
                            </div>

                            {/* Row 5 — orange climax */}
                            <div className="flex items-baseline mt-2">
                                {group5Words.map((word) => {
                                    const i = idx++;
                                    return (
                                        <RevealWord key={i} word={word} range={getRange(i, total)} progress={scrollYProgress}
                                            className={displayClass}
                                            style={{ fontFamily: 'var(--font-nero)', color: '#F26522' }} />
                                    );
                                })}
                            </div>

                            <RevealLine range={[0.52, 0.64]} progress={scrollYProgress} width="38%" color="rgba(242,101,34,0.3)" className="mt-5" />


                        </div>
                    </div>
                </div>

                {/* ── Scroll indicator ── */}
                <motion.div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    style={{ zIndex: 30 }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                >
                    <div className="w-px h-8 overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.10)' }}>
                        <motion.div
                            className="absolute top-0 w-full h-full"
                            style={{ background: 'rgba(242,101,34,0.6)' }}
                            animate={{ y: ['-100%', '100%'] }}
                            transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
                        />
                    </div>
                </motion.div>

            </motion.div>{/* /sticky */}
        </section>
    );
};