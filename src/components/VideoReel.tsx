import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const VideoReel = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    // Clip-path morphs from rounded pill to full rectangle as user scrolls
    const clipProgress = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);
    const borderRadius = useTransform(clipProgress, [0, 1], [80, 0]);
    const scale = useTransform(scrollYProgress, [0.1, 0.5], [0.85, 1]);
    const insetX = useTransform(clipProgress, [0, 1], [8, 0]); // vw
    const insetY = useTransform(clipProgress, [0, 1], [4, 0]); // vh

    // Derived string values (hooks at top level!)
    const marginLR = useTransform(insetX, (v) => `${v}vw`);
    const marginTB = useTransform(insetY, (v) => `${v}vh`);

    // Parallax for text
    const textY = useTransform(scrollYProgress, [0.2, 0.6], ['0%', '-30%']);
    const textOpacity = useTransform(scrollYProgress, [0.2, 0.45], [1, 0]);

    // Overlay darkens as video expands
    const overlayOpacity = useTransform(scrollYProgress, [0.1, 0.5], [0.6, 0.3]);

    return (
        <section
            ref={sectionRef}
            id="reel"
            className="relative w-full py-20 md:py-32"
            style={{ background: '#050505' }}
        >
            {/* Video container with morphing shape */}
            <motion.div
                className="relative mx-auto overflow-hidden"
                style={{
                    borderRadius,
                    scale,
                    marginLeft: marginLR,
                    marginRight: marginLR,
                    marginTop: marginTB,
                    marginBottom: marginTB,
                }}
            >
                {/* Video */}
                <div className="relative w-full aspect-[16/8] md:aspect-[16/7] overflow-hidden">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                        poster="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                    >
                        <source
                            src="https://cdn.coverr.co/videos/coverr-digital-data-flow-4721/1080p.mp4"
                            type="video/mp4"
                        />
                    </video>

                    {/* Dark overlay */}
                    <motion.div
                        className="absolute inset-0 bg-black"
                        style={{ opacity: overlayOpacity }}
                    />

                    {/* Center content */}
                    <motion.div
                        className="absolute inset-0 flex flex-col items-center justify-center z-10"
                        style={{ y: textY, opacity: textOpacity }}
                    >
                        {/* Play icon */}
                        <motion.button
                            className="group relative flex items-center justify-center w-20 h-20 md:w-28 md:h-28 rounded-full border border-white/20 hover:border-[#F26522]/60 transition-colors duration-500 mb-6 cursor-none"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Play showreel"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="white"
                                className="w-6 h-6 md:w-8 md:h-8 ml-1 group-hover:fill-[#F26522] transition-colors duration-500"
                            >
                                <polygon points="5,3 19,12 5,21" />
                            </svg>

                            {/* Rotating text around button */}
                            <svg
                                className="absolute w-full h-full animate-spin-slow"
                                viewBox="0 0 100 100"
                            >
                                <defs>
                                    <path
                                        id="circlePath"
                                        d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                                    />
                                </defs>
                                <text className="fill-white/30 text-[8px] font-mono uppercase tracking-[0.3em]">
                                    <textPath href="#circlePath">
                                        PLAY REEL • DIGDAYA TEKNOKRAF •{' '}
                                    </textPath>
                                </text>
                            </svg>
                        </motion.button>

                        <span className="text-[0.6rem] font-mono tracking-[0.3em] text-white/40 uppercase">
                            Showreel 2026
                        </span>
                    </motion.div>

                    {/* Bottom gradient fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
                </div>
            </motion.div>
        </section>
    );
};
