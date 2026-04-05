import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue } from 'framer-motion';
import { NoiseTexture } from './NoiseTexture';

const servicesList = [
    {
        num: '01',
        title: 'HARDWARE &\nINFRA',
        items: ['Semiconductor', 'Computer Assembly', 'Special Machinery', 'Measuring Instruments'],
        accent: '#F26522',
        description: 'Building the physical backbone of modern technology infrastructure.',
        imageId: 'r9oezyka89xjs8gnnnoc'
    },
    {
        num: '02',
        title: 'CONNECTIVITY',
        items: ['Wireless & Satellite', 'IoT Consulting'],
        accent: '#FFFFFF',
        description: 'Bridging the gap between devices, networks and people.',
        imageId: 'uhhynxanvd8avfeeajj3'
    },
    {
        num: '03',
        title: 'SECURITY &\nTRUST',
        items: ['InfoSec Consulting', 'Digital Identity', 'Electronic Certificates'],
        accent: '#F26522',
        description: 'Fortifying digital ecosystems with unbreakable trust layers.',
        imageId: 'hloc1zsblucjgfchd0e9'
    },
    {
        num: '04',
        title: 'SOFTWARE &\nTECH',
        items: ['Blockchain', 'Immersive Media (VR/AR)', 'Data Processing', 'Hosting', 'Web Portals'],
        accent: '#FFFFFF',
        description: 'Crafting intelligent systems that power the next generation.',
        imageId: 'f0hps0zc22jtls7c9mz5'
    },
    {
        num: '05',
        title: 'CREATIVE\nCONSULTING',
        items: ['Engineering Consulting', 'Multimedia Services', 'Advertising'],
        accent: '#F26522',
        description: 'Where strategic vision meets creative execution.',
        imageId: 'hlj4trbjlz53ivtgyuvs'
    },
];

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const CompetencyItem = ({
    item,
    index,
    start,
    center,
    end,
    segment,
    accent,
    scrollYProgress
}: {
    item: string;
    index: number;
    start: number;
    center: number;
    end: number;
    segment: number;
    accent: string;
    scrollYProgress: MotionValue<number>;
}) => {
    const itemStart = start + (0.2 + index * 0.06) * segment;

    const getSafeTransform = (inputs: number[], outputs: number[]) => {
        const safeIn: number[] = [];
        const safeOut: number[] = [];
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i] >= 0 && inputs[i] <= 1) {
                safeIn.push(inputs[i]);
                safeOut.push(outputs[i]);
            }
        }
        if (safeIn.length === 1) {
            if (safeIn[0] < 0.5) safeIn.push(1), safeOut.push(safeOut[0]);
            else safeIn.unshift(0), safeOut.unshift(safeOut[0]);
        } else if (safeIn.length === 0) {
            safeIn.push(0, 1);
            safeOut.push(outputs[1], outputs[1]);
        }
        return useTransform(scrollYProgress, safeIn, safeOut);
    };

    const itemY = getSafeTransform([itemStart, center, end], [50, 0, 0]);
    const itemX = getSafeTransform([itemStart, center, end], [40, 0, -30]);
    const itemOpacity = getSafeTransform([itemStart, center, end], [0, 1, 0.5]);

    return (
        <motion.li
            className="group flex items-center gap-4 py-3 md:py-4 cursor-pointer relative overflow-hidden"
            style={{
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                willChange: 'transform, opacity',
                y: itemY,
                x: itemX,
                opacity: itemOpacity,
            }}
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


// --- Service Card with aggressive scroll animations powered by Framer Motion ---
const ServiceCard = ({
    service,
    index,
    total,
    scrollYProgress,
}: {
    service: (typeof servicesList)[0];
    index: number;
    total: number;
    scrollYProgress: MotionValue<number>;
}) => {
    const isOrange = service.accent === '#F26522';

    // Each card occupies a segment of the total progress
    const segment = 1 / (total - 1);

    // The exact scroll points where this card enters, centers, and exits the viewport
    const start = (index - 1) * segment;
    const center = index * segment;
    const end = (index + 1) * segment;

    // --- Transforms mapped from scrollYProgress ---
    // Safely clamp the ranges so WAAPI doesn't crash on offsets outside [0, 1]
    const getSafeTransform = (inputs: number[], outputs: number[]) => {
        const safeIn: number[] = [];
        const safeOut: number[] = [];
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i] >= 0 && inputs[i] <= 1) {
                safeIn.push(inputs[i]);
                safeOut.push(outputs[i]);
            }
        }
        if (safeIn.length === 1) {
            if (safeIn[0] < 0.5) safeIn.push(1), safeOut.push(safeOut[0]);
            else safeIn.unshift(0), safeOut.unshift(safeOut[0]);
        } else if (safeIn.length === 0) {
            safeIn.push(0, 1);
            safeOut.push(outputs[1], outputs[1]);
        }
        return useTransform(scrollYProgress, safeIn, safeOut);
    };

    // Title: dramatic slide up with 3D tilt
    const titleY = getSafeTransform([start, center, end], [120, 0, 0]);
    const titleScale = getSafeTransform([start, center, end], [0.8, 1, 1]);
    const titleRotateX = getSafeTransform([start, center, end], [25, 0, 0]);
    const titleX = getSafeTransform([start, center, end], [0, 0, -150]);
    const titleOpacity = getSafeTransform([start, center, end], [0, 1, 0.4]);

    // Description: slide in from left (starts later)
    const descStart = start + 0.2 * segment;
    const descY = getSafeTransform([descStart, center, end], [60, 0, 0]);
    const descX = getSafeTransform([descStart, center, end], [-30, 0, -80]);
    const descOpacity = getSafeTransform([descStart, center, end], [0, 1, 0.3]);

    // Background number: scale + rotate in (starts earlier)
    const numStart = start + 0.1 * segment;
    const numScale = getSafeTransform([numStart, center, end], [0.5, 1, 1]);
    const numOpacity = getSafeTransform([numStart, center, end], [0, 1, 0.5]);
    const numRotate = getSafeTransform([numStart, center, end], [-15, 0, 10]);

    // Vertical divider: grow from top
    const divStart = start + 0.15 * segment;
    const dividerScaleY = getSafeTransform([divStart, center, end], [0, 1, 1]);

    // Progress bar fill (local to the card)
    const barScaleX = getSafeTransform([start, center, end], [0, 1, 1]);

    // Competencies label
    const labelOpacity = getSafeTransform([divStart, center, end], [0, 1, 1]);
    const labelX = getSafeTransform([divStart, center, end], [20, 0, 0]);

    return (
        <div
            className="h-full flex flex-col relative"
            style={{
                minWidth: '100vw',
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
                    scale: numScale,
                    opacity: numOpacity,
                    rotate: numRotate,
                }}
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
                            y: titleY,
                            scale: titleScale,
                            rotateX: titleRotateX,
                            x: titleX,
                            opacity: titleOpacity,
                        }}
                    >
                        {service.title}
                    </motion.h2>

                    <motion.p
                        className="relative z-10 text-sm md:text-base font-medium leading-relaxed mt-8 max-w-[480px] drop-shadow-[0_4px_10px_rgba(0,0,0,1)]"
                        style={{
                            color: 'rgba(255,255,255,0.7)',
                            fontFamily: 'var(--font-body)',
                            willChange: 'transform, opacity',
                            y: descY,
                            x: descX,
                            opacity: descOpacity,
                        }}
                    >
                        {service.description}
                    </motion.p>
                </div>

                {/* Vertical divider */}
                <div className="hidden md:block md:col-span-1 relative">
                    <motion.div
                        className="absolute left-1/2 top-8 bottom-8 w-[1px] bg-white/5 origin-top"
                        style={{ scaleY: dividerScaleY }}
                    />
                </div>

                {/* Right: Competencies */}
                <div className="md:col-span-4 flex flex-col justify-center px-8 md:px-4 py-12">
                    <motion.span
                        className="comp-label text-[var(--label-sm)] font-bold tracking-[0.3em] uppercase mb-8"
                        style={{
                            color: service.accent,
                            opacity: labelOpacity,
                            x: labelX
                        }}
                    >
                        Core Competencies
                    </motion.span>

                    <ul className="flex flex-col gap-0">
                        {service.items.map((item, i) => (
                            <CompetencyItem
                                key={i}
                                item={item}
                                index={i}
                                start={start}
                                center={center}
                                end={end}
                                segment={segment}
                                accent={service.accent}
                                scrollYProgress={scrollYProgress}
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
                            scaleX: barScaleX,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export const Services = () => {
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

    // Directly derive horizontal translation from scroll position
    const totalVw = (totalCards - 1) * 100;
    const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${totalVw}vw`]);

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
                        willChange: 'transform',
                    }}
                    className="flex h-full"
                >
                    {servicesList.map((service, index) => (
                        <ServiceCard
                            key={index}
                            service={service}
                            index={index}
                            total={totalCards}
                            scrollYProgress={scrollYProgress}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
};