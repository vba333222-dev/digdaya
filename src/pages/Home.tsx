import { Hero } from '../components/Hero';
import { VideoReel } from '../components/VideoReel';
import { Services } from '../components/Services';
import { Vision } from '../components/Vision';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { NoiseTexture } from '../components/NoiseTexture';

/* ── Simple CTA Block before Footer ── */
function HomeCTA() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-15%' });

    return (
        <section
            ref={ref}
            className="relative w-full py-32 md:py-44 overflow-hidden"
            style={{ background: 'var(--bg-pure)' }}
        >
            <NoiseTexture />
            <div className="relative z-10 flex flex-col items-center text-center px-6">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[var(--label-sm)] font-mono tracking-[0.3em] uppercase text-white/30 mb-6"
                >
                    Ready to build?
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[10vw] md:text-[5vw] font-black uppercase leading-[0.9] tracking-tighter mb-10"
                    style={{ fontFamily: 'var(--font-nero)' }}
                >
                    Let's Talk
                </motion.h2>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Link
                        to="/contact"
                        className="inline-block px-10 py-5 border border-white/20 text-[var(--label-sm)] font-mono tracking-[0.22em] uppercase hover:bg-[var(--brand)] hover:border-[var(--brand)] transition-all duration-500"
                    >
                        Start a Project →
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

import { SEO } from '../components/SEO';

export function Home() {
    return (
        <>
            <SEO
                title=""
                description="Digdaya Teknokraf — Engineering the physical frontier. Hardware, connectivity, security, and software solutions for Indonesia and beyond."
            />
            <Hero />
            <Vision />
            <Services />
            <VideoReel />
            <HomeCTA />
        </>
    );
}
