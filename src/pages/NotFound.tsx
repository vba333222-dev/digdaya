import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NoiseTexture } from '../components/NoiseTexture';

const ORANGE = '#F26522';

const Reveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-60px 0px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 32, filter: 'blur(3px)' }}
            animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export function NotFound() {
    return (
        <div className="relative bg-[var(--bg-base)] text-white min-h-screen overflow-x-hidden flex flex-col items-center justify-center px-6">
            <NoiseTexture />

            {/* Giant ghost 404 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <span
                    className="text-[50vw] md:text-[35vw] font-black uppercase leading-none"
                    style={{
                        fontFamily: 'var(--font-nero)',
                        color: 'transparent',
                        WebkitTextStroke: '1.5px rgba(255,255,255,0.03)',
                    }}
                >
                    404
                </span>
            </div>

            <div className="relative z-10 text-center flex flex-col items-center gap-6 max-w-md">
                <Reveal delay={0.1}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-[1px] w-5" style={{ background: ORANGE, opacity: 0.5 }} />
                        <span className="text-[0.58rem] font-mono tracking-[0.28em] uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            Error / 404
                        </span>
                        <div className="h-[1px] w-5" style={{ background: ORANGE, opacity: 0.5 }} />
                    </div>
                </Reveal>

                <Reveal delay={0.25}>
                    <h1
                        className="text-[18vw] md:text-[8vw] font-black uppercase leading-[0.84] tracking-[-0.04em]"
                        style={{ fontFamily: 'var(--font-nero)', color: 'rgba(255,255,255,0.9)' }}
                    >
                        PAGE NOT
                        <br />
                        <span style={{ color: 'transparent', WebkitTextStroke: `1.5px rgba(242,101,34,0.58)` }}>
                            FOUND
                        </span>
                    </h1>
                </Reveal>

                <Reveal delay={0.5}>
                    <p className="text-[0.75rem] font-mono leading-[1.8]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </Reveal>

                <Reveal delay={0.65}>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-3 px-8 py-4 border text-[0.6rem] font-mono tracking-[0.22em] uppercase transition-all duration-300 hover:bg-[#F26522] hover:text-black hover:border-[#F26522]"
                        style={{ borderColor: `${ORANGE}50`, color: 'rgba(255,255,255,0.7)' }}
                    >
                        ← Back to Home
                    </Link>
                </Reveal>
            </div>
        </div>
    );
}
