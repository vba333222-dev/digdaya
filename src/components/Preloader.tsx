import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, animate } from 'framer-motion';

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const ORANGE = '#F26522';
const LOAD_MS = 2200; // total loading duration

// Fake system readout lines that type in during load
const BOOT_LINES = [
    'INIT DIGDAYA TEKNOKRAF v2.4.1',
    'LOADING ASSET MANIFESTS',
    'BINDING RENDER PIPELINE',
    'CALIBRATING VIEWPORT',
    'MOUNTING COMPONENT TREE',
    'SYSTEM READY',
];

// ─────────────────────────────────────────────
// CORNER BRACKET
// ─────────────────────────────────────────────
const Bracket = ({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) => {
    const transforms = {
        tl: 'translate(0,0)',
        tr: 'translate(0,0) scaleX(-1)',
        bl: 'translate(0,0) scaleY(-1)',
        br: 'translate(0,0) scale(-1,-1)',
    };
    const positions = {
        tl: 'top-8 left-8 md:top-10 md:left-10',
        tr: 'top-8 right-8 md:top-10 md:right-10',
        bl: 'bottom-8 left-8 md:bottom-10 md:left-10',
        br: 'bottom-8 right-8 md:bottom-10 md:right-10',
    };
    return (
        <motion.div
            className={`absolute ${positions[pos]} pointer-events-none`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.35, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ transform: transforms[pos] }}
        >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M0 28 L0 0 L28 0" stroke={ORANGE} strokeWidth="1.5" />
            </svg>
        </motion.div>
    );
};

// ─────────────────────────────────────────────
// BOOT LOG — lines appear sequentially
// ─────────────────────────────────────────────
const BootLog = ({ progress }: { progress: number }) => {
    // How many lines to show based on progress
    const visibleCount = Math.ceil((progress / 100) * BOOT_LINES.length);

    return (
        <div className="flex flex-col gap-[3px]">
            {BOOT_LINES.map((line, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: i < visibleCount ? 1 : 0.15, x: 0 }}
                    transition={{ duration: 0.3, delay: i < visibleCount ? 0 : 0 }}
                    className="flex items-center gap-3"
                >
                    {/* Indicator dot */}
                    <span
                        className="w-[5px] h-[5px] rounded-full shrink-0"
                        style={{
                            background: i < visibleCount
                                ? (i === visibleCount - 1 ? ORANGE : 'rgba(255,255,255,0.4)')
                                : 'rgba(255,255,255,0.1)',
                        }}
                    />
                    <span
                        className="text-[0.52rem] font-mono tracking-[0.14em]"
                        style={{
                            color: i === visibleCount - 1
                                ? ORANGE
                                : i < visibleCount
                                    ? 'rgba(255,255,255,0.45)'
                                    : 'rgba(255,255,255,0.1)',
                        }}
                    >
                        {line}
                    </span>
                    {/* Blinking cursor on active line */}
                    {i === visibleCount - 1 && progress < 100 && (
                        <motion.span
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 0.7, repeat: Infinity }}
                            className="text-[0.52rem] font-mono"
                            style={{ color: ORANGE }}
                        >
                            _
                        </motion.span>
                    )}
                </motion.div>
            ))}
        </div>
    );
};

// ─────────────────────────────────────────────
// MAIN PRELOADER
// ─────────────────────────────────────────────
export const Preloader = () => {
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [exiting, setExiting] = useState(false);
    const startRef = useRef<number | null>(null);

    // Smooth displayed number
    const rawProgress = useMotionValue(0);
    const smoothProgress = useSpring(rawProgress, { stiffness: 80, damping: 20 });
    const [displayNum, setDisplayNum] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);

        const raf = (ts: number) => {
            if (!startRef.current) startRef.current = ts;
            const elapsed = ts - startRef.current;
            const t = Math.min(elapsed / LOAD_MS, 1);
            // Ease-out cubic — fast start, settle at end
            const eased = 1 - Math.pow(1 - t, 3);
            const val = Math.floor(eased * 100);
            setProgress(val);
            rawProgress.set(val);

            if (elapsed < LOAD_MS) {
                requestAnimationFrame(raf);
            } else {
                // Small pause at 100% before exit
                setTimeout(() => {
                    setExiting(true);
                    setTimeout(() => setIsLoading(false), 1500);
                }, 350);
            }
        };

        requestAnimationFrame(raf);
    }, []);

    // Sync spring value → display integer
    useEffect(() => {
        const unsub = smoothProgress.on('change', v => setDisplayNum(Math.floor(v)));
        return unsub;
    }, [smoothProgress]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="preloader"
                    className="fixed inset-0 z-[10000] overflow-hidden"
                    style={{ background: 'var(--bg-base)' }}
                    role="status"
                    aria-live="polite"
                    aria-label="Loading Digdaya Teknokraf"
                >
                    {/* ── Grain noise ── */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-[0.055]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                            backgroundSize: '160px 160px',
                            mixBlendMode: 'overlay',
                        }}
                    />

                    {/* ── Subtle orange ambient — bottom left ── */}
                    <div
                        className="absolute pointer-events-none"
                        style={{
                            bottom: '-10%', left: '-5%',
                            width: '45vw', height: '45vw',
                            borderRadius: '50%',
                            background: `radial-gradient(circle, rgba(242,101,34,0.07) 0%, transparent 65%)`,
                            filter: 'blur(40px)',
                        }}
                    />

                    {/* ── Corner brackets ── */}
                    <Bracket pos="tl" />
                    <Bracket pos="tr" />
                    <Bracket pos="bl" />
                    <Bracket pos="br" />

                    {/* ── Top bar ── */}
                    <motion.div
                        className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 md:px-12 py-8 md:py-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        {/* Logo wordmark */}
                        <div className="flex items-center gap-2">
                            <span
                                className="text-[0.62rem] font-mono tracking-[0.28em] uppercase"
                                style={{ color: 'rgba(255,255,255,0.5)' }}
                            >
                                Digdaya
                            </span>
                            <span
                                className="text-[0.5rem] font-mono tracking-[0.18em] border px-1.5 py-0.5"
                                style={{ color: ORANGE, borderColor: `${ORANGE}35` }}
                            >
                                Teknokraf
                            </span>
                        </div>
                        {/* Status */}
                        <span
                            className="text-[0.5rem] font-mono tracking-[0.22em] uppercase"
                            style={{ color: 'rgba(255,255,255,0.2)' }}
                        >
                            {progress < 100 ? 'Initializing' : 'Ready'}
                        </span>
                    </motion.div>

                    {/* ── Vertical progress rail — left edge ── */}
                    <motion.div
                        className="absolute left-0 top-0 bottom-0 w-[2px]"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            transformOrigin: 'top',
                        }}
                    >
                        <motion.div
                            className="absolute top-0 left-0 w-full"
                            style={{
                                height: `${progress}%`,
                                background: `linear-gradient(to bottom, transparent, ${ORANGE}80, ${ORANGE})`,
                                transition: 'height 0.1s linear',
                            }}
                        />
                        {/* Moving glow dot */}
                        <motion.div
                            className="absolute left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full"
                            style={{
                                top: `calc(${progress}% - 3px)`,
                                background: ORANGE,
                                boxShadow: `0 0 8px ${ORANGE}`,
                                transition: 'top 0.1s linear',
                            }}
                        />
                    </motion.div>

                    {/* ── CENTER COMPOSITION ─────────────────────────── */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-12 md:gap-14">

                        {/* Giant progress number */}
                        <motion.div
                            className="relative flex items-end gap-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {/* The number */}
                            <span
                                className="text-[22vw] md:text-[16vw] font-black leading-none tabular-nums select-none"
                                style={{
                                    fontFamily: 'var(--font-nero)',
                                    color: 'transparent',
                                    WebkitTextStroke: `1.5px rgba(255,255,255,${progress < 50 ? 0.12 + (progress / 50) * 0.25 : 0.37})`,
                                    transition: 'WebkitTextStroke 0.3s',
                                }}
                            >
                                {displayNum.toString()}
                            </span>
                            {/* Percent sign */}
                            <span
                                className="text-[5vw] md:text-[3.5vw] font-black leading-none mb-[1.5vw]"
                                style={{
                                    fontFamily: 'var(--font-nero)',
                                    color: ORANGE,
                                    opacity: 0.7,
                                }}
                            >
                                %
                            </span>

                            {/* Orange fill that reveals the number from bottom */}
                            <div
                                className="absolute inset-0 pointer-events-none overflow-hidden flex items-end"
                                style={{ zIndex: 1 }}
                            >
                                <motion.div
                                    className="w-full"
                                    style={{
                                        height: `${progress}%`,
                                        background: `linear-gradient(to top, ${ORANGE} 0%, ${ORANGE}60 60%, transparent 100%)`,
                                        WebkitMaskImage: 'inherit',
                                        transition: 'height 0.12s linear',
                                        mixBlendMode: 'overlay',
                                    }}
                                />
                            </div>
                        </motion.div>

                        {/* Horizontal progress bar */}
                        <motion.div
                            className="flex flex-col items-center gap-3 w-[55vw] md:w-[28vw]"
                            initial={{ opacity: 0, scaleX: 0.6 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {/* Track */}
                            <div
                                className="w-full h-[1px] relative overflow-hidden"
                                style={{ background: 'rgba(255,255,255,0.08)' }}
                            >
                                {/* Fill */}
                                <div
                                    className="absolute top-0 left-0 h-full"
                                    style={{
                                        width: `${progress}%`,
                                        background: ORANGE,
                                        transition: 'width 0.1s linear',
                                    }}
                                />
                                {/* Shimmer on fill edge */}
                                <div
                                    className="absolute top-0 h-full w-8"
                                    style={{
                                        left: `calc(${progress}% - 32px)`,
                                        background: `linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent)`,
                                        transition: 'left 0.1s linear',
                                    }}
                                />
                            </div>

                            {/* Tick marks */}
                            <div className="w-full flex justify-between">
                                {[0, 25, 50, 75, 100].map((tick) => (
                                    <div key={tick} className="flex flex-col items-center gap-1">
                                        <div
                                            className="w-[1px] h-[4px]"
                                            style={{
                                                background: progress >= tick
                                                    ? `${ORANGE}70`
                                                    : 'rgba(255,255,255,0.1)',
                                                transition: 'background 0.3s',
                                            }}
                                        />
                                        <span
                                            className="text-[0.42rem] font-mono tabular-nums"
                                            style={{
                                                color: progress >= tick
                                                    ? 'rgba(255,255,255,0.35)'
                                                    : 'rgba(255,255,255,0.12)',
                                                transition: 'color 0.3s',
                                            }}
                                        >
                                            {tick}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* ── BOTTOM SYSTEM READOUT ── */}
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 px-8 md:px-12 pb-8 md:pb-10 flex items-end justify-between gap-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        {/* Boot log */}
                        <BootLog progress={progress} />

                        {/* Right: coordinates / meta */}
                        <div className="hidden md:flex flex-col items-end gap-[3px] shrink-0">
                            {[
                                { label: 'LAT', value: '−6.2088°' },
                                { label: 'LNG', value: '106.8456°' },
                                { label: 'UTC', value: '+7' },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-2">
                                    <span className="text-[0.42rem] font-mono tracking-[0.18em]"
                                        style={{ color: 'rgba(255,255,255,0.2)' }}>
                                        {item.label}
                                    </span>
                                    <span className="text-[0.48rem] font-mono tabular-nums"
                                        style={{ color: 'rgba(255,255,255,0.35)' }}>
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* ── EXIT ANIMATION: dramatic cinematic wipe upward ── */}
                    <AnimatePresence>
                        {exiting && (
                            <>
                                {/* Orange flash / flare — fires first */}
                                <motion.div
                                    key="flash"
                                    className="absolute inset-0 z-[20] pointer-events-none"
                                    style={{ background: ORANGE }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 0.18, 0] }}
                                    transition={{ duration: 0.55, ease: 'easeOut' }}
                                />

                                {/* Panel 1 — full dark wipe, slides up first (slight lead) */}
                                <motion.div
                                    key="wipe-1"
                                    className="absolute inset-x-0 bottom-0 z-[15]"
                                    style={{ background: 'var(--bg-base)', top: 0 }}
                                    initial={{ y: '0%' }}
                                    animate={{ y: '-100%' }}
                                    transition={{
                                        duration: 1.1,
                                        delay: 0.05,
                                        ease: [0.76, 0, 0.24, 1],
                                    }}
                                />

                                {/* Panel 2 — orange accent strip, slightly behind */}
                                <motion.div
                                    key="wipe-2"
                                    className="absolute inset-x-0 bottom-0 z-[14]"
                                    style={{ background: ORANGE, top: 0 }}
                                    initial={{ y: '0%' }}
                                    animate={{ y: '-100%' }}
                                    transition={{
                                        duration: 1.1,
                                        delay: 0.13,
                                        ease: [0.76, 0, 0.24, 1],
                                    }}
                                />

                                {/* Panel 3 — dark again, trails last */}
                                <motion.div
                                    key="wipe-3"
                                    className="absolute inset-x-0 bottom-0 z-[13]"
                                    style={{ background: '#111', top: 0 }}
                                    initial={{ y: '0%' }}
                                    animate={{ y: '-100%' }}
                                    transition={{
                                        duration: 1.1,
                                        delay: 0.22,
                                        ease: [0.76, 0, 0.24, 1],
                                    }}
                                />

                                {/* Horizontal scan line that sweeps upward with the wipe */}
                                <motion.div
                                    key="scanline"
                                    className="absolute inset-x-0 z-[16] pointer-events-none"
                                    style={{
                                        height: 2,
                                        background: `linear-gradient(to right, transparent 0%, ${ORANGE} 30%, #fff 50%, ${ORANGE} 70%, transparent 100%)`,
                                        boxShadow: `0 0 24px 4px ${ORANGE}`,
                                    }}
                                    initial={{ top: '100%', opacity: 1 }}
                                    animate={{ top: '-2px', opacity: [1, 1, 0] }}
                                    transition={{
                                        top: { duration: 1.05, delay: 0.05, ease: [0.76, 0, 0.24, 1] },
                                        opacity: { duration: 0.3, delay: 1.0 },
                                    }}
                                />
                            </>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
};