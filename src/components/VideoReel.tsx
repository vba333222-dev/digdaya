import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const VideoReel = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    const setVideoRef = (index: number) => (el: HTMLVideoElement | null) => {
        videoRefs.current[index] = el;
    };

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    // ── Section entrance / exit ─────────────────────────────────
    const sectionOpacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0, 1, 1, 0]);
    const sectionScale = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0.9, 1, 1, 0.97]);

    // ── Background layer parallax ───────────────────────────────
    const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);
    const orb1Y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
    const orb2Y = useTransform(scrollYProgress, [0, 1], ['8%', '-18%']);

    // ── Capsule parallax ────────────────────────────────────────
    const cap1Y = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);
    const cap1Scale = useTransform(scrollYProgress, [0, 1], [0.88, 1.04]);
    const cap2Y = useTransform(scrollYProgress, [0, 1], ['-18%', '28%']);
    const cap2X = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
    const cap3Y = useTransform(scrollYProgress, [0, 1], ['28%', '-18%']);
    const cap3X = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

    return (
        <section
            ref={sectionRef}
            id="reel"
            className="relative w-full h-[180vh] md:h-[220vh]"
            style={{ background: 'var(--bg-base)' }}
        >
            {/* ── STICKY VIEWPORT ─────────────────────────────────── */}
            <motion.div
                className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center transform-gpu"
                style={{ perspective: 800, opacity: sectionOpacity, scale: sectionScale }}
            >

                {/* ════════════════════════════════════════════════════
                    BACKGROUND SYSTEM
                    Aligned to brand: pure black base + orange warmth.
                    Replaced blue-indigo with brand orange accent tones.
                    Replaced "DIGDAYA" text with geometric line art.
                ════════════════════════════════════════════════════ */}

                {/* 1. Base — pure black, consistent with rest of site */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        background: `
                            radial-gradient(ellipse 140% 70% at 50% 105%, rgba(12,8,4,1) 0%, transparent 55%),
                            radial-gradient(ellipse 100% 55% at 50% -5%,  rgba(8,5,2,0.95) 0%, transparent 55%),
                            linear-gradient(160deg, #060604 0%, #080604 40%, #060606 70%, #060606 100%)
                        `,
                    }}
                />

                {/* 2. Orange warm glow — primary brand accent */}
                {/* Orb A — orange-amber, top-left, main warmth source */}
                <motion.div
                    className="absolute z-[1] pointer-events-none"
                    style={{
                        y: orb1Y,
                        top: '-18%', left: '-12%',
                        width: '60vw', height: '60vw',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(242,101,34,0.13) 0%, rgba(200,70,10,0.06) 40%, transparent 68%)',
                        filter: 'blur(55px)',
                    }}
                />
                {/* Orb B — deep orange-red, bottom-right, balancing warmth */}
                <motion.div
                    className="absolute z-[1] pointer-events-none"
                    style={{
                        y: orb2Y,
                        bottom: '-18%', right: '-12%',
                        width: '65vw', height: '65vw',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(200,60,0,0.10) 0%, rgba(160,40,0,0.04) 40%, transparent 68%)',
                        filter: 'blur(70px)',
                    }}
                />
                {/* Orb C — faint warm center, adds depth without blue */}
                <div
                    className="absolute z-[1] pointer-events-none"
                    style={{
                        top: '25%', left: '30%',
                        width: '40vw', height: '40vw',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(242,101,34,0.04) 0%, transparent 60%)',
                        filter: 'blur(40px)',
                    }}
                />

                {/* 3. Fine grid — orange-tinted lines instead of blue ── */}
                <motion.div
                    className="absolute inset-0 z-[2] pointer-events-none"
                    style={{ y: gridY }}
                >
                    <svg
                        className="absolute inset-0 w-full h-full"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <pattern id="reel-grid" width="72" height="72" patternUnits="userSpaceOnUse">
                                <path d="M 72 0 L 0 0 0 72" fill="none" stroke="rgba(242,101,34,0.07)" strokeWidth="0.5" />
                            </pattern>
                            {/* Fade: visible in center band, transparent at top/bottom edges */}
                            <linearGradient id="reel-gridFade" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="white" stopOpacity="0" />
                                <stop offset="30%" stopColor="white" stopOpacity="1" />
                                <stop offset="70%" stopColor="white" stopOpacity="1" />
                                <stop offset="100%" stopColor="white" stopOpacity="0" />
                            </linearGradient>
                            <mask id="reel-gridMask">
                                <rect width="100%" height="100%" fill="url(#reel-gridFade)" />
                            </mask>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#reel-grid)" mask="url(#reel-gridMask)" />
                    </svg>
                </motion.div>

                {/* 4. Diagonal cross-lines — structural brutalist decoration */}
                {/* Replaces the "DIGDAYA" ghost text with geometric geometry */}
                <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
                    <svg
                        className="absolute inset-0 w-full h-full"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                        viewBox="0 0 1440 900"
                    >
                        <defs>
                            {/* Horizontal fade mask for diagonal lines */}
                            <linearGradient id="diagFadeH" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="white" stopOpacity="0" />
                                <stop offset="20%" stopColor="white" stopOpacity="1" />
                                <stop offset="80%" stopColor="white" stopOpacity="1" />
                                <stop offset="100%" stopColor="white" stopOpacity="0" />
                            </linearGradient>
                            <mask id="diagMask">
                                <rect width="100%" height="100%" fill="url(#diagFadeH)" />
                            </mask>
                        </defs>

                        {/* Long diagonal lines — very faint structural lines */}
                        <g mask="url(#diagMask)" opacity="1">
                            {/* Top-left → bottom-right diagonals */}
                            <line x1="-200" y1="0" x2="900" y2="900" stroke="rgba(242,101,34,0.06)" strokeWidth="1" />
                            <line x1="100" y1="0" x2="1200" y2="900" stroke="rgba(242,101,34,0.04)" strokeWidth="0.7" />
                            <line x1="400" y1="0" x2="1500" y2="900" stroke="rgba(242,101,34,0.05)" strokeWidth="0.7" />
                            <line x1="700" y1="0" x2="1800" y2="900" stroke="rgba(242,101,34,0.03)" strokeWidth="0.5" />
                            {/* Top-right → bottom-left diagonals */}
                            <line x1="1640" y1="0" x2="540" y2="900" stroke="rgba(255,255,255,0.03)" strokeWidth="0.7" />
                            <line x1="1340" y1="0" x2="240" y2="900" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
                            <line x1="1040" y1="0" x2="-60" y2="900" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
                        </g>

                        {/* Horizontal rule at vertical center — editorial feel */}
                        <line
                            x1="0" y1="450" x2="1440" y2="450"
                            stroke="rgba(242,101,34,0.06)" strokeWidth="0.6"
                        />

                        {/* Corner bracket ornaments — consistent with NavigationMenu */}
                        {/* Top-left */}
                        <path d="M 60 60 L 60 30 L 90 30" fill="none" stroke="rgba(242,101,34,0.22)" strokeWidth="1" />
                        {/* Top-right */}
                        <path d="M 1380 60 L 1380 30 L 1350 30" fill="none" stroke="rgba(242,101,34,0.22)" strokeWidth="1" />
                        {/* Bottom-left */}
                        <path d="M 60 840 L 60 870 L 90 870" fill="none" stroke="rgba(242,101,34,0.22)" strokeWidth="1" />
                        {/* Bottom-right */}
                        <path d="M 1380 840 L 1380 870 L 1350 870" fill="none" stroke="rgba(242,101,34,0.22)" strokeWidth="1" />

                        {/* Section index label — top-left */}
                        <text
                            x="78" y="52"
                            fontFamily="monospace"
                            fontSize="8"
                            letterSpacing="3"
                            fill="rgba(242,101,34,0.35)"
                            textAnchor="start"
                        >
                            § REEL
                        </text>
                        {/* Year label — top-right */}
                        <text
                            x="1362" y="52"
                            fontFamily="monospace"
                            fontSize="8"
                            letterSpacing="3"
                            fill="rgba(255,255,255,0.15)"
                            textAnchor="end"
                        >
                            2019 — NOW
                        </text>
                    </svg>
                </div>

                {/* 5. Horizontal scanlines — very subtle film feel */}
                <div
                    className="absolute inset-0 z-[4] pointer-events-none"
                    style={{
                        opacity: 0.018,
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.5) 3px, rgba(255,255,255,0.5) 4px)',
                        backgroundSize: '100% 4px',
                    }}
                />

                {/* 6. Radial vignette — brand-matched dark edges */}
                <div
                    className="absolute inset-0 z-[5] pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse 88% 82% at 50% 50%, transparent 28%, rgba(4,3,2,0.60) 65%, rgba(3,2,1,0.92) 100%)',
                    }}
                />

                {/* 7. Top & bottom darkening bars */}
                <div
                    className="absolute inset-x-0 top-0 h-36 z-[5] pointer-events-none"
                    style={{ background: 'linear-gradient(to bottom, rgba(6,6,6,0.95) 0%, transparent 100%)' }}
                />
                <div
                    className="absolute inset-x-0 bottom-0 h-36 z-[5] pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(6,6,6,0.95) 0%, transparent 100%)' }}
                />

                {/* 8. Fine noise grain — consistent with NoiseTexture component */}
                <div
                    className="absolute inset-0 z-[6] pointer-events-none opacity-[0.06] mix-blend-overlay"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                        backgroundSize: '180px 180px',
                    }}
                />

                {/* 9. Left & right brand accent lines */}
                <div className="absolute inset-0 z-[7] pointer-events-none overflow-hidden">
                    <div
                        className="absolute left-0 top-0 bottom-0 w-[1px]"
                        style={{ background: 'linear-gradient(to bottom, transparent, rgba(242,101,34,0.18) 30%, rgba(242,101,34,0.18) 70%, transparent)' }}
                    />
                    <div
                        className="absolute right-0 top-0 bottom-0 w-[1px]"
                        style={{ background: 'linear-gradient(to bottom, transparent, rgba(242,101,34,0.12) 30%, rgba(242,101,34,0.12) 70%, transparent)' }}
                    />
                    {/* Faint center horizontal line */}
                    <div
                        className="absolute left-0 right-0 top-1/2 h-[1px]"
                        style={{ background: 'radial-gradient(ellipse 60% 100% at 50% 50%, rgba(242,101,34,0.07), transparent)' }}
                    />
                </div>

                {/* ════════════════════════════════════════════════════
                    CAPSULES
                ════════════════════════════════════════════════════ */}

                {/* CAPSULE 2 — Left */}
                <div className="absolute top-1/2 left-[2%] md:left-[10%] w-[30vw] md:w-[22vw] aspect-[9/16] -translate-y-1/2 z-10 hidden sm:block">
                    <motion.div
                        className="w-full h-full"
                        initial={{ opacity: 0, y: 150 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        <motion.div
                            className="w-full h-full rounded-[100vw] overflow-hidden border bg-[#0a0804] relative"
                            style={{
                                y: cap2Y,
                                x: cap2X,
                                rotateY: 8,
                                rotateX: -3,
                                borderColor: 'rgba(242,101,34,0.10)',
                                boxShadow: '-10px 15px 60px rgba(0,0,0,0.85), 0 0 0 1px rgba(242,101,34,0.05), inset 0 1px 0 rgba(255,180,100,0.07)',
                            }}
                        >
                            <video
                                ref={setVideoRef(1)}
                                autoPlay loop muted playsInline preload="auto" crossOrigin="anonymous"
                                poster={`https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload/so_0,w_400,f_jpg,q_50/v1/mvbi6pc9fxby2uximb8q`}
                                className="absolute inset-0 w-full h-full object-cover grayscale-[40%] contrast-110 relative z-0"
                            >
                                <source src={`https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload/c_scale,w_800,q_auto,f_mp4/v1/mvbi6pc9fxby2uximb8q`} type="video/mp4" />
                            </video>
                            {/* Warm orange tint — consistent with brand */}
                            <div className="absolute inset-0 pointer-events-none z-10"
                                style={{ background: 'rgba(80,30,5,0.20)', mixBlendMode: 'multiply' }} />
                            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.85)] pointer-events-none z-20" />
                            <div className="absolute inset-0 pointer-events-none z-30 rounded-[100vw]"
                                style={{ boxShadow: 'inset 0 0 0 1px rgba(242,101,34,0.08)' }} />
                        </motion.div>
                    </motion.div>
                </div>

                {/* CAPSULE 1 — Center (Primary) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[65vw] sm:w-[34vw] md:w-[26vw] aspect-[9/16] -translate-y-1/2 z-20">
                    <motion.div
                        className="w-full h-full"
                        initial={{ opacity: 0, y: 200 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        <motion.div
                            className="w-full h-full rounded-[100vw] overflow-hidden bg-[#080604] relative"
                            style={{
                                y: cap1Y,
                                scale: cap1Scale,
                                rotateY: 0,
                                rotateX: 0,
                                borderColor: 'rgba(242,101,34,0.08)',
                                boxShadow: '-20px 30px 80px rgba(0,0,0,0.95), 0 0 80px rgba(242,101,34,0.07), 0 0 0 1px rgba(242,101,34,0.06), inset 0 1px 0 rgba(255,200,140,0.09)',
                            }}
                        >
                            <video
                                ref={setVideoRef(0)}
                                autoPlay loop muted playsInline preload="auto" crossOrigin="anonymous"
                                poster={`https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload/so_0,w_400,f_jpg,q_50/v1/fkat1cwxefyznzqmju9u`}
                                className="absolute inset-0 w-full h-full object-cover grayscale-[20%] contrast-125 relative z-0"
                            >
                                <source src={`https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload/c_scale,w_800,q_auto,f_mp4/v1/fkat1cwxefyznzqmju9u`} type="video/mp4" />
                            </video>
                            <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.85)] pointer-events-none z-20" />
                            <div className="absolute top-0 inset-x-0 h-1/3 pointer-events-none z-30"
                                style={{ background: 'linear-gradient(to bottom, rgba(242,101,34,0.04), transparent)' }} />
                        </motion.div>
                    </motion.div>
                </div>

                {/* CAPSULE 3 — Right */}
                <div className="absolute top-1/2 right-[2%] md:right-[10%] w-[30vw] md:w-[22vw] aspect-[9/16] -translate-y-1/2 z-30 hidden sm:block">
                    <motion.div
                        className="w-full h-full"
                        initial={{ opacity: 0, y: 150 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        <motion.div
                            className="w-full h-full rounded-[100vw] overflow-hidden bg-[#0a0804] relative"
                            style={{
                                y: cap3Y,
                                x: cap3X,
                                rotateY: -8,
                                rotateX: 3,
                                borderColor: 'rgba(242,101,34,0.10)',
                                boxShadow: '-30px 30px 80px rgba(0,0,0,0.9), 0 0 60px rgba(242,101,34,0.05), 0 0 0 1px rgba(242,101,34,0.07), inset 0 1px 0 rgba(255,180,80,0.07)',
                            }}
                        >
                            <video
                                ref={setVideoRef(2)}
                                autoPlay loop muted playsInline preload="auto" crossOrigin="anonymous"
                                poster={`https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload/so_0,w_400,f_jpg,q_50/v1/whprtmm6vpmzw9dygnfb`}
                                className="absolute inset-0 w-full h-full object-cover contrast-125 relative z-0"
                            >
                                <source src={`https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload/c_scale,w_800,q_auto,f_mp4/v1/whprtmm6vpmzw9dygnfb`} type="video/mp4" />
                            </video>
                            {/* Consistent warm tint — same brand direction as other capsules */}
                            <div className="absolute inset-0 pointer-events-none z-10"
                                style={{ background: 'rgba(90,35,5,0.18)', mixBlendMode: 'multiply' }} />
                            <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.85)] pointer-events-none z-20" />
                            <div className="absolute inset-0 pointer-events-none z-30 rounded-[100vw]"
                                style={{ boxShadow: 'inset 0 0 0 1px rgba(242,101,34,0.08)' }} />
                        </motion.div>
                    </motion.div>
                </div>

                {/* ════════════════════════════════════════════════════
                    SCROLL INDICATOR
                ════════════════════════════════════════════════════ */}
                <motion.div
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                >
                    <span className="text-[0.45rem] font-mono tracking-[0.4em] uppercase"
                        style={{ color: 'rgba(255,255,255,0.22)' }}>
                        Scroll to traverse
                    </span>
                    <div className="w-[1px] h-6 overflow-hidden relative"
                        style={{ background: 'rgba(242,101,34,0.15)' }}>
                        <motion.div
                            className="absolute top-0 w-full h-full"
                            style={{ background: 'rgba(242,101,34,0.7)' }}
                            animate={{ y: ['-100%', '100%'] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                        />
                    </div>
                </motion.div>

            </motion.div>
        </section>
    );
};