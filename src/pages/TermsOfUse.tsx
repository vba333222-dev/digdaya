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

export function TermsOfUse() {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

    const sections = [
        { title: '1. Agreement to Terms', body: 'By accessing this Website, accessible from digdaya.id, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site.' },
        { title: '2. Use License', body: 'Permission is granted to temporarily download one copy of the materials on Digdaya Teknokraf\'s Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.' },
        { title: '3. Disclaimer', body: 'All the materials on Digdaya Teknokraf\'s Website are provided "as is". Digdaya Teknokraf makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, Digdaya Teknokraf does not make any representations concerning the accuracy or reliability of the use of the materials on its Website.' },
        { title: '4. Limitations', body: 'Digdaya Teknokraf or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on Digdaya Teknokraf\'s Website, even if Digdaya Teknokraf or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage.' },
    ];

    return (
        <div className="relative bg-[var(--bg-base)] text-white min-h-screen overflow-x-hidden">
            <NoiseTexture />

            <section ref={heroRef} className="relative min-h-[50vh] md:min-h-[60vh] flex flex-col justify-end pb-16 overflow-hidden">
                <div className="absolute pointer-events-none" style={{ top: '-10%', right: '-10%', width: '55vw', height: '55vw', background: `radial-gradient(circle, rgba(242,101,34,0.07) 0%, transparent 65%)` }} />

                <div className="absolute inset-0 flex items-center justify-end overflow-hidden pointer-events-none select-none pr-[4vw]">
                    <motion.span style={{ y: heroY, opacity: heroOpacity, fontFamily: 'var(--font-nero)', color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.028)' }} className="text-[28vw] md:text-[20vw] font-black uppercase leading-[0.78]">
                        TERMS
                    </motion.span>
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }} className="absolute top-32 left-6 md:left-12 lg:left-16 flex items-center gap-3">
                    <div className="h-[1px] w-5" style={{ background: ORANGE, opacity: 0.5 }} />
                    <span className="text-[0.58rem] font-mono tracking-[0.28em] uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>Legal / Info</span>
                </motion.div>

                <motion.div style={{ y: heroY }} className="relative z-10 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto w-full">
                    <SplitReveal text="TERMS OF" delay={0.25} className="text-[17vw] md:text-[8vw] font-black leading-[0.84] tracking-[-0.04em] uppercase" style={{ fontFamily: 'var(--font-nero)', color: 'rgba(255,255,255,0.9)' }} />
                    <SplitReveal text="SERVICE" delay={0.38} className="text-[17vw] md:text-[8vw] font-black leading-[0.84] tracking-[-0.04em] uppercase" style={{ fontFamily: 'var(--font-nero)', color: 'transparent', WebkitTextStroke: `1.5px rgba(242,101,34,0.58)` }} />

                    <Reveal delay={0.75} className="mt-8">
                        <span className="text-[0.55rem] font-mono tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.28)' }}>Last Updated: March 2026</span>
                    </Reveal>
                </motion.div>
            </section>

            <section className="relative px-6 md:px-12 lg:px-16 pb-32">
                <div className="max-w-[1000px] mx-auto flex flex-col gap-16 md:gap-20">
                    <Reveal delay={0.2}>
                        <p className="text-[0.8rem] font-mono leading-[2] text-[rgba(255,255,255,0.55)]">
                            These Terms of Service govern your use of the website located at digdaya.id and any related services provided by Digdaya Teknokraf. Structure, function, and terms apply exactly as written.
                        </p>
                    </Reveal>

                    {sections.map((sec, i) => (
                        <div key={i} className="flex flex-col gap-4 border-t pt-8" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                            <Reveal delay={0.1}>
                                <h3 className="text-[1.8rem] md:text-[2rem] font-black uppercase tracking-tight" style={{ fontFamily: 'var(--font-nero)', color: 'rgba(255,255,255,0.85)' }}>{sec.title}</h3>
                            </Reveal>
                            <Reveal delay={0.2}>
                                <div className="pl-4 md:pl-8 border-l-2" style={{ borderColor: 'rgba(242,101,34,0.4)' }}>
                                    <p className="text-[0.75rem] font-mono leading-[1.8]" style={{ color: 'rgba(255,255,255,0.45)' }}>{sec.body}</p>
                                </div>
                            </Reveal>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
