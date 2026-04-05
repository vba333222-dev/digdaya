import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
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

const SplitReveal = ({ text, delay = 0, className = '', style = {} }: { text: string; delay?: number; className?: string; style?: React.CSSProperties }) => {
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

export function Licenses() {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

    const licenses = [
        { name: 'React', author: 'Meta Platforms, Inc.', type: 'MIT License' },
        { name: 'Framer Motion', author: 'Framer B.V.', type: 'MIT License' },
        { name: 'Tailwind CSS', author: 'Tailwind Labs, Inc.', type: 'MIT License' },
        { name: 'Vite', author: 'Yuxi (Evan) You', type: 'MIT License' },
        { name: 'React Router', author: 'Remix Software, Inc.', type: 'MIT License' },
        { name: 'Nero Font', author: 'Third-Party Foundry', type: 'Commercial / Web License' },
    ];

    return (
        <div className="relative bg-[var(--bg-base)] text-white min-h-screen overflow-x-hidden">
            <NoiseTexture />

            <section ref={heroRef} className="relative min-h-[50vh] md:min-h-[60vh] flex flex-col justify-end pb-16 overflow-hidden">
                <div className="absolute pointer-events-none" style={{ top: '-10%', right: '-10%', width: '55vw', height: '55vw', background: `radial-gradient(circle, rgba(242,101,34,0.07) 0%, transparent 65%)` }} />

                <div className="absolute inset-0 flex items-center justify-end overflow-hidden pointer-events-none select-none pr-[4vw]">
                    <motion.span style={{ y: heroY, opacity: heroOpacity, fontFamily: 'var(--font-nero)', color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.028)' }} className="text-[28vw] md:text-[20vw] font-black uppercase leading-[0.78]">
                        OSS
                    </motion.span>
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }} className="absolute top-32 left-6 md:left-12 lg:left-16 flex items-center gap-3">
                    <div className="h-[1px] w-5" style={{ background: ORANGE, opacity: 0.5 }} />
                    <span className="text-[0.58rem] font-mono tracking-[0.28em] uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>Legal / Info</span>
                </motion.div>

                <motion.div style={{ y: heroY }} className="relative z-10 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto w-full">
                    <SplitReveal text="SOFTWARE" delay={0.25} className="text-[17vw] md:text-[8vw] font-black leading-[0.84] tracking-[-0.04em] uppercase" style={{ fontFamily: 'var(--font-nero)', color: 'rgba(255,255,255,0.9)' }} />
                    <SplitReveal text="LICENSES" delay={0.38} className="text-[17vw] md:text-[8vw] font-black leading-[0.84] tracking-[-0.04em] uppercase" style={{ fontFamily: 'var(--font-nero)', color: 'transparent', WebkitTextStroke: `1.5px rgba(242,101,34,0.58)` }} />

                    <Reveal delay={0.75} className="mt-8">
                        <span className="text-[0.55rem] font-mono tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.28)' }}>Last Updated: March 2026</span>
                    </Reveal>
                </motion.div>
            </section>

            <section className="relative px-6 md:px-12 lg:px-16 pb-32">
                <div className="max-w-[1000px] mx-auto flex flex-col gap-16 md:gap-20">
                    <Reveal delay={0.2}>
                        <p className="text-[0.8rem] font-mono leading-[2] text-[rgba(255,255,255,0.55)]">
                            Our digital infrastructure relies on the robust work of open-source projects and specific commercial licenses. We acknowledge and respect the engineers and designers behind these foundational tools.
                        </p>
                    </Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {licenses.map((lic, i) => (
                            <Reveal key={i} delay={0.1 + i * 0.05}>
                                <div className="flex flex-col gap-3 p-6 border transition-colors duration-300 hover:bg-white/[0.02]" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                                    <span className="text-[0.55rem] font-mono tracking-[0.2em] uppercase" style={{ color: ORANGE }}>{lic.type}</span>
                                    <h4 className="text-[1.8rem] font-black uppercase tracking-tight leading-none" style={{ fontFamily: 'var(--font-nero)', color: 'rgba(255,255,255,0.85)' }}>
                                        {lic.name}
                                    </h4>
                                    <span className="text-[0.65rem] font-mono mt-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                                        © {lic.author}
                                    </span>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
