import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { NoiseTexture } from './NoiseTexture';
import { useContent } from '../admin/ContentContext';
import type { HomeService } from '../admin/siteContent';

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

// Service type alias for component props
type ServiceItem = HomeService;

const CompetencyItem = ({
    item,
    accent,
}: {
    item: string;
    accent: string;
}) => {
    return (
        <motion.li
            className="group flex items-center gap-4 py-3 md:py-4 cursor-pointer relative overflow-hidden"
            style={{
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                willChange: 'transform, opacity',
            }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <span
                className="text-[var(--label-sm)] font-mono transition-all duration-300 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0"
                style={{ color: accent }}
            >
                →
            </span>
            <span className="text-[0.85rem] md:text-[0.95rem] font-medium tracking-wide text-white/40 group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1">
                {item}
            </span>
        </motion.li>
    );
};


// --- Service Card with whileInView scroll animations powered natively by Framer Motion ---
const ServiceCard = ({
    service,
    total,
}: {
    service: ServiceItem;
    total: number;
}) => {
    const isOrange = service.accent === '#F26522';

    return (
        <div
            className="h-full flex flex-col relative shrink-0"
            style={{
                width: '100vw',
                background: isOrange ? '#0A0A0A' : '#0F0F0F',
                perspective: '1200px',
            }}
        >
            {/* Noise texture overlay */}
            <NoiseTexture opacity={0.04} />

            {/* Architectural grid lines */}
            <div className="absolute inset-0 pointer-events-none z-[1]">
                <div className="absolute left-[33%] top-0 bottom-0 w-[1px] bg-white/[0.02]" />
                <div className="absolute left-[66%] top-0 bottom-0 w-[1px] bg-white/[0.02]" />
                <div className="absolute top-[50%] left-0 right-0 h-[1px] bg-white/[0.02]" />
            </div>

            {/* Giant background number */}
            <motion.div
                className="absolute right-[-2vw] top-1/2 select-none pointer-events-none"
                style={{
                    fontSize: '45vw',
                    fontFamily: 'var(--font-nero)',
                    fontWeight: 900,
                    lineHeight: 0.8,
                    color: 'transparent',
                    WebkitTextStroke: `1px ${isOrange ? 'rgba(242,101,34,0.06)' : 'rgba(255,255,255,0.03)'}`,
                    transformOrigin: 'center center',
                }}
                initial={{ opacity: 0, scale: 0.6, rotate: -20, y: '-50%' }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0, y: '-50%' }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1, ease: 'easeOut' }}
            >
                {service.num}
            </motion.div>

            {/* Top bar */}
            <div className="w-full px-8 md:px-16 py-6 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-6">
                    <span
                        className="text-[1.1rem] md:text-[1.1rem] font-mono font-bold tracking-wider"
                        style={{ color: service.accent }}
                    >
                        {service.num}
                    </span>
                    <div className="h-[1px] w-12 bg-white/10" />
                    <span className="text-[var(--label-sm)] font-bold tracking-[0.3em] text-white/30 uppercase">
                        Service Category
                    </span>
                </div>
                <span className="text-[var(--label-sm)] font-mono text-white/30 tracking-widest">
                    {service.num}/{String(total).padStart(2, '0')}
                </span>
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/5" />
            </div>

            {/* Main content area */}
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-12 relative">
                {/* Left: Title area */}
                <div className="md:col-span-7 flex flex-col justify-center px-8 md:px-16 py-12 relative overflow-hidden" style={{ perspective: '800px' }}>
                    {/* Background Image scoped strictly to Title Area */}
                    {service.imageId && (
                        <div className="absolute inset-0 z-0 pointer-events-none bg-[#050505]/50">
                            <img
                                src={`https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dprsmfj1i'}/image/upload/f_auto,q_auto,w_1000/${service.imageId}`}
                                alt=""
                                className="w-full h-full object-cover opacity-70"
                            />
                            {/* Smooth gradient fading into the solid brutalist dark background on the right */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0A0A0A]" />
                            {/* Dark gradient for text contrast at the bottom/top */}
                            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/50 via-transparent to-[#0A0A0A]/80" />
                        </div>
                    )}

                    <motion.h2
                        className="relative z-10 text-[12vw] md:text-[6.5vw] font-black leading-[0.82] tracking-tight uppercase whitespace-pre-line m-0 drop-shadow-[0_12px_24px_rgba(0,0,0,1)] mix-blend-normal"
                        style={{
                            fontFamily: 'var(--font-nero)',
                            color: isOrange ? '#F26522' : '#FFFFFF',
                            transformOrigin: 'left center',
                            willChange: 'transform, opacity',
                        }}
                        initial={{ opacity: 0, scale: 0.8, rotateX: 25, y: 150 }}
                        whileInView={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        {service.title}
                    </motion.h2>

                    <motion.p
                        className="relative z-10 text-sm md:text-base font-medium leading-relaxed mt-8 max-w-[480px] drop-shadow-[0_4px_10px_rgba(0,0,0,1)]"
                        style={{
                            color: 'rgba(255,255,255,0.7)',
                            fontFamily: 'var(--font-body)',
                            willChange: 'transform, opacity',
                        }}
                        initial={{ opacity: 0, x: -30, y: 40 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                    >
                        {service.description}
                    </motion.p>
                </div>

                {/* Vertical divider */}
                <div className="hidden md:block md:col-span-1 relative">
                    <motion.div
                        className="absolute left-1/2 top-8 bottom-8 w-[1px] bg-white/5 origin-top"
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                    />
                </div>

                {/* Right: Competencies */}
                <div className="md:col-span-4 flex flex-col justify-center px-8 md:px-4 py-12">
                    <motion.span
                        className="comp-label text-[var(--label-sm)] font-bold tracking-[0.3em] uppercase mb-8"
                        style={{ color: service.accent }}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        Core Competencies
                    </motion.span>

                    <ul className="flex flex-col gap-0">
                        {service.items.map((item, i) => (
                            <CompetencyItem
                                key={i}
                                item={item}
                                accent={service.accent}
                            />
                        ))}
                    </ul>
                </div>
            </div>

            {/* Bottom progress bar */}
            <div className="w-full px-8 md:px-16 pb-8">
                <div className="w-full h-[2px] bg-white/5 relative overflow-hidden">
                    <motion.div
                        className="absolute left-0 top-0 h-full origin-left"
                        style={{
                            width: '100%',
                            background: isOrange
                                ? 'linear-gradient(90deg, rgba(242,101,34,0) 0%, #F26522 100%)'
                                : 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 100%)',
                        }}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                    />
                </div>
            </div>
        </div>
    );
};

export const Services = () => {
    const { content } = useContent();
    const servicesList = content.homeServices;
    const sectionRef = useRef<HTMLElement>(null);
    const progressTextRef = useRef<HTMLSpanElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"]
    });

    const { scrollYProgress: sectionProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // Cinematic section transition
    const sectionOpacity = useTransform(sectionProgress, [0, 0.08, 0.92, 1], [0, 1, 1, 0]);
    const sectionScale = useTransform(sectionProgress, [0, 0.08, 0.92, 1], [0.85, 1, 1, 0.95]);

    const totalCards = servicesList.length;

    // Based on user instruction: exactly 0% to -80% works perfectly for 5 cards,
    // where -80% places the last (5th) 100vw card right at the left edge of the viewport.
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

    // Update pagination text directly to DOM to avoid React re-renders during high-frequency scroll events
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (progressTextRef.current) {
            const index = Math.round(clamp(latest, 0, 1) * (totalCards - 1)) + 1;
            progressTextRef.current.textContent = String(index).padStart(2, '0');
        }
    });

    return (
        <section
            ref={sectionRef}
            id="services"
            style={{ height: `${(totalCards - 1) * 100}vh` }}
            className="relative"
        >
            <motion.div
                className="sticky top-0 h-screen w-full overflow-hidden transform-gpu"
                style={{ opacity: sectionOpacity, scale: sectionScale }}
            >
                {/* Section label */}
                <div className="absolute top-6 left-8 md:left-16 z-20 flex items-center gap-4">
                    <span className="text-[var(--label-sm)] font-bold tracking-[0.3em] text-white/20 uppercase">
                        Services
                    </span>
                    <div className="h-[1px] w-8 bg-white/10" />
                    <span className="text-[0.6rem] font-mono text-white/20">
                        <span ref={progressTextRef}>01</span>/{String(totalCards).padStart(2, '0')}
                    </span>
                </div>

                {/* Horizontal slide track driven strictly by Framer Motion container */}
                <motion.div
                    style={{
                        x,
                        width: `${totalCards * 100}vw`,
                        willChange: 'transform',
                    }}
                    className="flex h-full"
                >
                    {servicesList.map((service, index) => (
                        <ServiceCard
                            key={index}
                            service={service}
                            total={totalCards}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
};