import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { NoiseTexture } from './NoiseTexture';

// --- Word with scroll-driven reveal ---
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
    const opacity = useTransform(progress, range, [0.08, 1]);
    const y = useTransform(progress, range, [20, 0]);
    const blur = useTransform(progress, range, [4, 0]);
    const filter = useTransform(blur, (v) => `blur(${v}px)`);

    return (
        <motion.span
            style={{ opacity, y, filter, ...style }}
            className={`inline-block mr-[0.3em] ${className}`}
        >
            {word}
        </motion.span>
    );
};

// --- Animated horizontal line ---
const RevealLine = ({
    range,
    progress,
    width = '100%',
    color = 'rgba(242,101,34,0.3)',
}: {
    range: [number, number];
    progress: ReturnType<typeof useScroll>['scrollYProgress'];
    width?: string;
    color?: string;
}) => {
    const scaleX = useTransform(progress, range, [0, 1]);
    const opacity = useTransform(progress, range, [0, 1]);
    return (
        <motion.div
            style={{ scaleX, opacity, width, background: color }}
            className="h-[1px] origin-left"
        />
    );
};

export const Vision = () => {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    const getRange = (i: number, total: number, base = 0.15, span = 0.45): [number, number] => {
        const start = base + (i / total) * span;
        const end = start + 0.06;
        return [start, Math.min(end, 0.85)];
    };

    // Semantic groups
    const group1Words = ['We', 'engineer'];
    // group2 is rendered as explicit JSX below (with inline image masks)
    const group3Words = ['For', 'globally', 'recognized'];
    const group4Words = ['Companies', 'to', 'early', 'stage'];
    const group5Words = ['Startups.'];

    const allWords = [...group1Words, 'physical', '&', 'digital', 'future', ...group3Words, ...group4Words, ...group5Words];
    const total = allWords.length;
    let idx = 0;

    // Outline stroke style shared by group3 & group4
    const outlineStyle = {
        fontFamily: 'var(--font-nero)',
        color: 'transparent',
        WebkitTextStroke: '1px rgba(255,255,255,0.2)',
    };
    const outlineClass = 'text-[8vw] md:text-[4.5vw] font-black leading-[0.9] tracking-[-0.03em] uppercase';

    const labelOpacity = useTransform(scrollYProgress, [0.12, 0.22], [0, 1]);
    const imageParallaxY = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);
    const bgTextOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 0.03, 0.03, 0]);

    return (
        <section
            ref={containerRef}
            id="vision"
            className="w-full relative min-h-[250vh] flex items-center justify-center"
            style={{ background: '#050505' }}
        >
            {/* Canvas noise grain */}
            <NoiseTexture opacity={0.12} />

            {/* Subtle radial gradient for depth */}
            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    background: 'radial-gradient(ellipse 60% 50% at 30% 50%, rgba(242,101,34,0.05) 0%, transparent 70%)',
                }}
            />

            <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
                {/* Background decorative giant text */}
                <motion.div
                    style={{ opacity: bgTextOpacity }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                >
                    <span
                        className="text-[35vw] font-black uppercase leading-none"
                        style={{
                            fontFamily: 'var(--font-nero)',
                            color: 'transparent',
                            WebkitTextStroke: '1px rgba(255,255,255,0.04)',
                        }}
                    >
                        VISION
                    </span>
                </motion.div>

                <div className="w-full max-w-[1400px] mx-auto px-6 md:px-16 relative z-10">
                    {/* Section label */}
                    <motion.div
                        style={{ opacity: labelOpacity }}
                        className="flex items-center gap-4 mb-12"
                    >
                        <span className="text-[0.6rem] font-bold tracking-[0.3em] text-[#F26522] uppercase">
                            Our Vision
                        </span>
                        <div className="h-[1px] w-12 bg-[#F26522]/30" />
                    </motion.div>

                    {/* Main text composition */}
                    <div className="flex flex-col gap-2">

                        {/* "We engineer" — small, italic accent */}
                        <div className="flex items-baseline gap-[0.3em]">
                            {group1Words.map((word) => {
                                const i = idx++;
                                return (
                                    <RevealWord
                                        key={i}
                                        word={word}
                                        range={getRange(i, total)}
                                        progress={scrollYProgress}
                                        className="text-[6vw] md:text-[3vw] font-light italic tracking-[-0.01em]"
                                        style={{ fontFamily: 'var(--font-body)', color: '#F26522' }}
                                    />
                                );
                            })}
                        </div>

                        <RevealLine range={[0.18, 0.3]} progress={scrollYProgress} width="30%" />

                        {/* "physical [mask] & digital [mask] future" — explicit JSX with inline image masks */}
                        <div className="flex flex-wrap items-center mt-2">
                            {/* PHYSICAL */}
                            <RevealWord
                                word="physical"
                                range={getRange(idx++, total)}
                                progress={scrollYProgress}
                                className="text-[14vw] md:text-[8vw] font-black leading-[0.85] tracking-[-0.04em] uppercase"
                                style={{ fontFamily: 'var(--font-nero)', color: '#FFFFFF' }}
                            />
                            {/* Inline image mask 1 */}
                            <span className="inline-block align-middle w-[20vw] md:w-[12vw] h-[10vw] md:h-[6vw] rounded-full overflow-hidden relative mx-[1vw] bg-[#1a1a1a]">
                                <motion.img
                                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop"
                                    className="absolute top-0 left-0 w-full h-[140%] object-cover mix-blend-luminosity opacity-80"
                                    style={{ y: imageParallaxY }}
                                />
                            </span>
                            {/* & */}
                            <RevealWord
                                word="&"
                                range={getRange(idx++, total)}
                                progress={scrollYProgress}
                                className="text-[14vw] md:text-[8vw] font-black leading-[0.85] tracking-[-0.04em] uppercase"
                                style={{ fontFamily: 'var(--font-nero)', color: '#F26522' }}
                            />
                            {/* DIGITAL */}
                            <RevealWord
                                word="digital"
                                range={getRange(idx++, total)}
                                progress={scrollYProgress}
                                className="text-[14vw] md:text-[8vw] font-black leading-[0.85] tracking-[-0.04em] uppercase"
                                style={{ fontFamily: 'var(--font-nero)', color: '#FFFFFF' }}
                            />
                            {/* Inline image mask 2 */}
                            <span className="inline-block align-middle w-[20vw] md:w-[12vw] h-[10vw] md:h-[6vw] rounded-full overflow-hidden relative mx-[1vw] bg-[#1a1a1a]">
                                <motion.img
                                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop"
                                    className="absolute top-0 left-0 w-full h-[140%] object-cover mix-blend-luminosity opacity-80"
                                    style={{ y: imageParallaxY }}
                                />
                            </span>
                            {/* FUTURE */}
                            <RevealWord
                                word="future"
                                range={getRange(idx++, total)}
                                progress={scrollYProgress}
                                className="text-[14vw] md:text-[8vw] font-black leading-[0.85] tracking-[-0.04em] uppercase"
                                style={{ fontFamily: 'var(--font-nero)', color: '#FFFFFF' }}
                            />
                        </div>

                        <RevealLine range={[0.32, 0.44]} progress={scrollYProgress} width="60%" color="rgba(255,255,255,0.08)" />

                        {/* "For globally recognized" — outline stroke */}
                        <div className="flex flex-wrap items-baseline mt-6">
                            {group3Words.map((word) => {
                                const i = idx++;
                                return (
                                    <RevealWord
                                        key={i}
                                        word={word}
                                        range={getRange(i, total)}
                                        progress={scrollYProgress}
                                        className={outlineClass}
                                        style={outlineStyle}
                                    />
                                );
                            })}
                        </div>

                        {/* "Companies to early stage" — outline stroke uniform */}
                        <div className="flex flex-wrap items-baseline">
                            {group4Words.map((word) => {
                                const i = idx++;
                                return (
                                    <RevealWord
                                        key={i}
                                        word={word}
                                        range={getRange(i, total)}
                                        progress={scrollYProgress}
                                        className={outlineClass}
                                        style={outlineStyle}
                                    />
                                );
                            })}
                        </div>

                        {/* "Startups." — accent, orange */}
                        <div className="flex items-baseline mt-4">
                            {group5Words.map((word) => {
                                const i = idx++;
                                return (
                                    <RevealWord
                                        key={i}
                                        word={word}
                                        range={getRange(i, total)}
                                        progress={scrollYProgress}
                                        className="text-[14vw] md:text-[8vw] font-black leading-[0.85] tracking-[-0.04em] uppercase"
                                        style={{
                                            fontFamily: 'var(--font-nero)',
                                            color: '#F26522',
                                        }}
                                    />
                                );
                            })}
                        </div>

                        <RevealLine range={[0.5, 0.62]} progress={scrollYProgress} width="45%" />
                    </div>
                </div>
            </div>
        </section>
    );
};
