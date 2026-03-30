import { useRef, useEffect, useState } from 'react';
import { useScrollY } from '../App';
import gsap from 'gsap';

const servicesList = [
    {
        num: '01',
        title: 'HARDWARE &\nINFRA',
        items: ['Semiconductor', 'Computer Assembly', 'Special Machinery', 'Measuring Instruments'],
        accent: '#F26522',
        description: 'Building the physical backbone of modern technology infrastructure.',
    },
    {
        num: '02',
        title: 'CONNECTIVITY',
        items: ['Wireless & Satellite', 'IoT Consulting'],
        accent: '#FFFFFF',
        description: 'Bridging the gap between devices, networks and people.',
    },
    {
        num: '03',
        title: 'SECURITY &\nTRUST',
        items: ['InfoSec Consulting', 'Digital Identity', 'Electronic Certificates'],
        accent: '#F26522',
        description: 'Fortifying digital ecosystems with unbreakable trust layers.',
    },
    {
        num: '04',
        title: 'SOFTWARE &\nTECH',
        items: ['Blockchain', 'Immersive Media (VR/AR)', 'Data Processing', 'Hosting', 'Web Portals'],
        accent: '#FFFFFF',
        description: 'Crafting intelligent systems that power the next generation.',
    },
    {
        num: '05',
        title: 'CREATIVE\nCONSULTING',
        items: ['Engineering Consulting', 'Multimedia Services', 'Advertising'],
        accent: '#F26522',
        description: 'Where strategic vision meets creative execution.',
    },
];

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

// --- Service Card with aggressive scroll animations ---
const ServiceCard = ({
    service,
    index,
    progress,
}: {
    service: (typeof servicesList)[0];
    index: number;
    progress: number;
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const numRef = useRef<HTMLDivElement>(null);
    const compRef = useRef<HTMLDivElement>(null);
    const dividerRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);

    const total = servicesList.length;
    const isOrange = service.accent === '#F26522';

    // Each card occupies a segment of the total progress
    const cardSegment = 1 / (total - 1);
    const cardCenter = index * cardSegment;

    // enterT: 0 when card is far right, 1 when card is centered
    const enterT = clamp((progress - (cardCenter - cardSegment)) / cardSegment, 0, 1);
    // exitT: 0 when card is centered, 1 when card is far left
    const exitT = clamp((progress - cardCenter) / cardSegment, 0, 1);

    const isVisible = enterT > 0 && exitT < 1;

    useEffect(() => {
        if (!cardRef.current) return;

        const title = titleRef.current;
        const desc = descRef.current;
        const num = numRef.current;
        const comp = compRef.current;
        const divider = dividerRef.current;
        const bar = barRef.current;

        if (!isVisible) {
            // Reset to hidden state
            if (title) gsap.set(title, { y: 120, opacity: 0, scale: 0.8, rotateX: 25 });
            if (desc) gsap.set(desc, { y: 60, opacity: 0, x: -30 });
            if (num) gsap.set(num, { scale: 0.5, opacity: 0, rotate: -15 });
            if (divider) gsap.set(divider, { scaleY: 0 });
            if (bar) gsap.set(bar, { scaleX: 0 });
            if (comp) {
                const items = comp.querySelectorAll('li');
                gsap.set(items, { y: 50, opacity: 0, x: 40 });
                gsap.set(comp.querySelector('.comp-label'), { opacity: 0, x: 20 });
            }
            return;
        }

        // Aggressive entrance animations
        const enterEase = 'power4.out';
        const enterDuration = 0.1; // Near-instant since we're driving by scroll

        // Title: dramatic slide up with 3D tilt
        if (title) {
            const titleY = (1 - enterT) * 120;
            const titleScale = 0.8 + enterT * 0.2;
            const titleRotate = (1 - enterT) * 25;
            const titleOpacity = enterT;
            // Exit: slide left and fade
            const exitX = exitT * -150;
            const exitOpacity = 1 - exitT * 0.6;

            gsap.set(title, {
                y: titleY,
                opacity: titleOpacity * exitOpacity,
                scale: titleScale,
                rotateX: titleRotate,
                x: exitX,
            });
        }

        // Description: slide in from left
        if (desc) {
            const descEnter = clamp((enterT - 0.2) / 0.8, 0, 1);
            gsap.set(desc, {
                y: (1 - descEnter) * 60,
                x: (1 - descEnter) * -30 + exitT * -80,
                opacity: descEnter * (1 - exitT * 0.7),
            });
        }

        // Background number: scale + rotate in
        if (num) {
            const numEnter = clamp((enterT - 0.1) / 0.6, 0, 1);
            gsap.set(num, {
                scale: 0.5 + numEnter * 0.5,
                opacity: numEnter * (1 - exitT * 0.5),
                rotate: (1 - numEnter) * -15 + exitT * 10,
            });
        }

        // Divider: grow from top
        if (divider) {
            const divEnter = clamp((enterT - 0.15) / 0.6, 0, 1);
            gsap.set(divider, { scaleY: divEnter });
        }

        // Progress bar
        if (bar) {
            gsap.set(bar, { scaleX: enterT });
        }

        // Competency items: stagger slide in from right
        if (comp) {
            const items = comp.querySelectorAll('li');
            const label = comp.querySelector('.comp-label');

            const labelEnter = clamp((enterT - 0.15) / 0.5, 0, 1);
            if (label) {
                gsap.set(label, {
                    opacity: labelEnter,
                    x: (1 - labelEnter) * 20,
                });
            }

            items.forEach((item, i) => {
                const itemEnter = clamp((enterT - 0.2 - i * 0.06) / 0.4, 0, 1);
                const itemExit = exitT;
                gsap.set(item, {
                    y: (1 - itemEnter) * 50,
                    x: (1 - itemEnter) * 40 + itemExit * -30,
                    opacity: itemEnter * (1 - itemExit * 0.5),
                });
            });
        }
    }, [enterT, exitT, isVisible]);

    // Progress bar fill
    const cardProgress = clamp(progress * (total - 1) - index + 1, 0, 1);

    return (
        <div
            ref={cardRef}
            className="h-full flex flex-col relative"
            style={{
                minWidth: '100vw',
                width: '100vw',
                background: isOrange ? '#0A0A0A' : '#0F0F0F',
                perspective: '1200px',
            }}
        >
            {/* Giant background number */}
            <div
                ref={numRef}
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
            >
                {service.num}
            </div>

            {/* Top bar */}
            <div className="w-full px-8 md:px-16 py-6 flex items-center justify-between relative">
                <div className="flex items-center gap-6">
                    <span
                        className="text-[1.1rem] font-mono font-bold tracking-wider"
                        style={{ color: service.accent }}
                    >
                        {service.num}
                    </span>
                    <div className="h-[1px] w-12 bg-white/10" />
                    <span className="text-[0.65rem] font-bold tracking-[0.25em] text-white/30 uppercase">
                        Service Category
                    </span>
                </div>
                <span className="text-[0.65rem] font-mono text-white/20 tracking-wider">
                    {service.num}/{String(servicesList.length).padStart(2, '0')}
                </span>
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/5" />
            </div>

            {/* Main content area */}
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-12 relative">
                {/* Left: Title area */}
                <div className="md:col-span-7 flex flex-col justify-center px-8 md:px-16 py-12" style={{ perspective: '800px' }}>
                    <h2
                        ref={titleRef}
                        className="text-[14vw] md:text-[7vw] font-black leading-[0.82] tracking-tight uppercase whitespace-pre-line m-0"
                        style={{
                            fontFamily: 'var(--font-nero)',
                            color: isOrange ? '#F26522' : '#FFFFFF',
                            transformOrigin: 'left center',
                            willChange: 'transform, opacity',
                        }}
                    >
                        {service.title}
                    </h2>

                    <p
                        ref={descRef}
                        className="text-sm md:text-base font-light leading-relaxed mt-8 max-w-[480px]"
                        style={{
                            color: 'rgba(255,255,255,0.35)',
                            fontFamily: 'var(--font-body)',
                            willChange: 'transform, opacity',
                        }}
                    >
                        {service.description}
                    </p>
                </div>

                {/* Vertical divider */}
                <div className="hidden md:block md:col-span-1 relative">
                    <div
                        ref={dividerRef}
                        className="absolute left-1/2 top-8 bottom-8 w-[1px] bg-white/5 origin-top"
                    />
                </div>

                {/* Right: Competencies */}
                <div ref={compRef} className="md:col-span-4 flex flex-col justify-center px-8 md:px-4 py-12">
                    <span
                        className="comp-label text-[0.6rem] font-bold tracking-[0.3em] uppercase mb-8"
                        style={{ color: service.accent, opacity: 0.7 }}
                    >
                        Core Competencies
                    </span>

                    <ul className="flex flex-col gap-0">
                        {service.items.map((item, i) => (
                            <li
                                key={i}
                                className="group flex items-center gap-4 py-4 cursor-pointer"
                                style={{
                                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                                    willChange: 'transform, opacity',
                                }}
                            >
                                <span
                                    className="text-[0.6rem] font-mono transition-all duration-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                                    style={{ color: service.accent }}
                                >
                                    →
                                </span>
                                <span className="text-sm md:text-[0.95rem] font-medium tracking-wide text-white/40 group-hover:text-white transition-colors duration-300">
                                    {item}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Bottom progress bar */}
            <div className="w-full px-8 md:px-16 pb-8">
                <div className="w-full h-[2px] bg-white/5 relative overflow-hidden">
                    <div
                        ref={barRef}
                        className="absolute left-0 top-0 h-full origin-left"
                        style={{
                            width: '100%',
                            background: isOrange
                                ? 'linear-gradient(90deg, rgba(242,101,34,0) 0%, #F26522 100%)'
                                : 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 100%)',
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export const Services = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollY } = useScrollY();
    const [translateX, setTranslateX] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!sectionRef.current) return;

        const sectionTop = sectionRef.current.offsetTop;
        const sectionHeight = sectionRef.current.offsetHeight;
        const vh = window.innerHeight;
        const scrollableRange = sectionHeight - vh;

        const scrolledInto = scrollY - sectionTop;

        if (scrolledInto < 0 || scrollableRange <= 0) {
            setTranslateX(0);
            setProgress(0);
            return;
        }

        const p = clamp(scrolledInto / scrollableRange, 0, 1);
        const vw = window.innerWidth;
        const maxTranslate = (servicesList.length - 1) * vw;

        setTranslateX(-p * maxTranslate);
        setProgress(p);
    }, [scrollY]);

    return (
        <section
            ref={sectionRef}
            style={{ height: `${servicesList.length * 100}vh` }}
            className="relative"
        >
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {/* Section label */}
                <div className="absolute top-6 left-8 md:left-16 z-20 flex items-center gap-4">
                    <span className="text-[0.6rem] font-bold tracking-[0.3em] text-white/20 uppercase">
                        Services
                    </span>
                    <div className="h-[1px] w-8 bg-white/10" />
                    <span className="text-[0.6rem] font-mono text-white/20">
                        {String(Math.round(progress * (servicesList.length - 1)) + 1).padStart(2, '0')}/{String(servicesList.length).padStart(2, '0')}
                    </span>
                </div>

                {/* Horizontal slide track */}
                <div
                    style={{
                        transform: `translate3d(${translateX}px, 0, 0)`,
                        willChange: 'transform',
                    }}
                    className="flex h-full"
                >
                    {servicesList.map((service, index) => (
                        <ServiceCard
                            key={index}
                            service={service}
                            index={index}
                            progress={progress}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};