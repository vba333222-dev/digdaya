import { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { NoiseTexture } from '../components/NoiseTexture';
import { SEO } from '../components/SEO';
import { useContent } from '../admin/ContentContext';
import type { Project } from '../admin/siteContent';

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
// Type alias for component props
type ProjectItem = Project;

const Reveal = ({
    children, delay = 0, y = 32, className = '',
}: {
    children: React.ReactNode; delay?: number; y?: number; className?: string;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-60px 0px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y, filter: 'blur(3px)' }}
            animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

const SplitReveal = ({ text, delay = 0, className = '', style = {} }: {
    text: string; delay?: number; className?: string; style?: React.CSSProperties;
}) => {
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

// ─────────────────────────────────────────────
// CUSTOM CURSOR FOLLOWER
// ─────────────────────────────────────────────
const CursorFollower = ({ visible, label }: { visible: boolean; label: string }) => {
    const x = useMotionValue(-100);
    const y = useMotionValue(-100);
    const springX = useSpring(x, { stiffness: 120, damping: 14 });
    const springY = useSpring(y, { stiffness: 120, damping: 14 });

    useEffect(() => {
        const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
        window.addEventListener('mousemove', move);
        return () => window.removeEventListener('mousemove', move);
    }, [x, y]);

    return (
        <motion.div
            style={{ left: springX, top: springY, translateX: '-50%', translateY: '-50%' }}
            animate={{ scale: visible ? 1 : 0, opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-[200] pointer-events-none"
        >
            <div
                className="flex items-center justify-center rounded-full text-[0.5rem] font-mono tracking-[0.18em] uppercase"
                style={{
                    width: 72, height: 72,
                    background: ORANGE,
                    color: '#000',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                }}
            >
                {label}
            </div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────
// HOVER PREVIEW CARD (follows mouse on desktop)
// ─────────────────────────────────────────────
const PreviewBubble = ({
    project, visible,
}: {
    project: ProjectItem | null;
    visible: boolean;
}) => {
    const x = useMotionValue(-300);
    const y = useMotionValue(-300);
    const springX = useSpring(x, { stiffness: 90, damping: 16 });
    const springY = useSpring(y, { stiffness: 90, damping: 16 });

    useEffect(() => {
        const move = (e: MouseEvent) => {
            x.set(e.clientX + 28);
            y.set(e.clientY - 100);
        };
        window.addEventListener('mousemove', move);
        return () => window.removeEventListener('mousemove', move);
    }, [x, y]);

    if (!project) return null;

    return (
        <motion.div
            animate={{ scale: visible ? 1 : 0.85, opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-[150] pointer-events-none hidden md:flex flex-col overflow-hidden"
            style={{
                width: 260,
                left: springX,
                top: springY,
                border: '1px solid rgba(255,255,255,0.08)',
                background: project.accent,
            } as any}
        >
            {/* Color fill area */}
            <div
                className="w-full flex items-end justify-start p-4"
                style={{
                    height: 160,
                    background: `linear-gradient(135deg, ${project.accent} 0%, ${project.accentText}22 100%)`,
                }}
            >
                <span
                    className="text-[2.5rem] font-black leading-none"
                    style={{ fontFamily: 'var(--font-nero)', color: `${project.accentText}60` }}
                >
                    {project.id}
                </span>
            </div>
            {/* Meta */}
            <div className="p-4 flex flex-col gap-1" style={{ background: '#0d0d0d' }}>
                <span
                    className="text-[0.58rem] font-mono tracking-[0.18em] uppercase"
                    style={{ color: project.accentText }}
                >
                    {project.category}
                </span>
                <span
                    className="text-[0.78rem] font-mono leading-[1.6]"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                    {project.desc.slice(0, 64)}…
                </span>
            </div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────
// PROJECT ROW (list layout)
// ─────────────────────────────────────────────
const ProjectRow = ({
    project,
    index,
    onHover,
    onLeave,
}: {
    project: ProjectItem;
    index: number;
    onHover: () => void;
    onLeave: () => void;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-40px 0px' });
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => { setHovered(true); onHover(); }}
            onMouseLeave={() => { setHovered(false); onLeave(); }}
            className="group relative border-b"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
        >
            {/* Hover bg fill */}
            <motion.div
                animate={{ scaleX: hovered ? 1 : 0 }}
                transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `linear-gradient(90deg, ${project.accentText}08 0%, transparent 60%)`,
                    transformOrigin: 'left center',
                }}
            />

            <div className="relative z-10 flex items-center gap-4 md:gap-8 py-6 md:py-7 px-0">
                {/* Index */}
                <motion.span
                    animate={{ color: hovered ? project.accentText : 'rgba(255,255,255,0.2)' }}
                    transition={{ duration: 0.3 }}
                    className="text-[0.58rem] font-mono tracking-[0.2em] shrink-0 w-7 hidden md:block"
                >
                    {project.id}
                </motion.span>

                {/* Title */}
                <div className="flex-1 min-w-0">
                    <motion.h3
                        animate={{ x: hovered ? 6 : 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[6.5vw] md:text-[2.8vw] font-black uppercase tracking-[-0.025em] leading-none truncate"
                        style={{
                            fontFamily: 'var(--font-nero)',
                            color: hovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.72)',
                        }}
                    >
                        {project.title}
                        {project.featured && (
                            <span
                                className="ml-3 text-[0.45rem] font-mono tracking-[0.2em] uppercase align-middle border px-2 py-0.5"
                                style={{ color: ORANGE, borderColor: `${ORANGE}50`, verticalAlign: 'middle' }}
                            >
                                Featured
                            </span>
                        )}
                    </motion.h3>
                </div>

                {/* Tags — hidden on mobile */}
                <div className="hidden lg:flex items-center gap-2 shrink-0">
                    {project.tags.slice(0, 2).map((tag) => (
                        <motion.span
                            key={tag}
                            animate={{ opacity: hovered ? 0.7 : 0.3 }}
                            className="text-[0.5rem] font-mono tracking-[0.16em] uppercase border px-2 py-1"
                            style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.55)' }}
                        >
                            {tag}
                        </motion.span>
                    ))}
                </div>

                {/* Category */}
                <motion.span
                    animate={{ color: hovered ? project.accentText : 'rgba(255,255,255,0.28)' }}
                    transition={{ duration: 0.3 }}
                    className="text-[0.55rem] font-mono tracking-[0.2em] uppercase shrink-0 hidden md:block w-20 text-right"
                >
                    {project.category}
                </motion.span>

                {/* Year */}
                <span
                    className="text-[0.55rem] font-mono shrink-0"
                    style={{ color: 'rgba(255,255,255,0.2)' }}
                >
                    {project.year}
                </span>

                {/* Arrow */}
                <motion.span
                    animate={{ x: hovered ? 0 : -6, opacity: hovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm shrink-0"
                    style={{ color: ORANGE }}
                >
                    →
                </motion.span>
            </div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────
// FEATURED CARD (grid item)
// ─────────────────────────────────────────────
const FeaturedCard = ({ project, index }: { project: ProjectItem; index: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-40px 0px' });
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 36 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative overflow-hidden flex flex-col"
            style={{
                border: '1px solid rgba(255,255,255,0.07)',
                background: project.accent,
                aspectRatio: index === 0 ? '16/9' : '4/3',
            }}
        >
            {/* Gradient fill */}
            <div
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(135deg, ${project.accent} 0%, ${project.accentText}18 100%)`,
                }}
            />

            {/* Giant ghost number */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <motion.span
                    animate={{ scale: hovered ? 1.06 : 1, opacity: hovered ? 0.12 : 0.06 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[22vw] md:text-[14vw] font-black leading-none"
                    style={{ fontFamily: 'var(--font-nero)', color: project.accentText }}
                >
                    {project.id}
                </motion.span>
            </div>

            {/* Hover fill overlay */}
            <motion.div
                animate={{ opacity: hovered ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
                style={{ background: `${project.accentText}08` }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-7">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <span
                            className="text-[0.5rem] font-mono tracking-[0.22em] uppercase border px-2 py-0.5"
                            style={{ color: project.accentText, borderColor: `${project.accentText}40` }}
                        >
                            {project.category}
                        </span>
                        <span className="text-[0.5rem] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
                            {project.year}
                        </span>
                    </div>

                    <motion.h3
                        animate={{ y: hovered ? -3 : 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[5vw] md:text-[1.8vw] font-black uppercase tracking-[-0.025em] leading-[0.92]"
                        style={{ fontFamily: 'var(--font-nero)', color: 'rgba(255,255,255,0.9)' }}
                    >
                        {project.title}
                    </motion.h3>

                    <motion.p
                        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
                        transition={{ duration: 0.4 }}
                        className="text-[0.65rem] font-mono leading-[1.75] max-w-sm"
                        style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                        {project.desc}
                    </motion.p>
                </div>
            </div>

            {/* Top-right arrow */}
            <motion.div
                animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 5, y: hovered ? 0 : -5 }}
                transition={{ duration: 0.35 }}
                className="absolute top-5 right-5 text-sm"
                style={{ color: project.accentText }}
            >
                ↗
            </motion.div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
const ORANGE = '#F26522';

export function Projects() {
    const { content } = useContent();
    const projects = content.projects;
    const CATEGORIES = useMemo(() => ['All', ...Array.from(new Set(projects.map(p => p.category)))], [projects]);
    const [activeFilter, setActiveFilter] = useState('All');
    const [cursorVisible, setCursorVisible] = useState(false);
    const [hoveredProject, setHoveredProject] = useState<ProjectItem | null>(null);
    const [previewVisible, setPreviewVisible] = useState(false);

    const filteredProjects = activeFilter === 'All'
        ? projects
        : projects.filter((p) => p.category === activeFilter);

    const featuredProjects = projects.filter((p) => p.featured);

    return (
        <div className="relative bg-[var(--bg-base)] text-white min-h-screen overflow-x-hidden">
            <SEO title="Projects" description="Explore Digdaya Teknokraf's portfolio — hardware, connectivity, security, and software projects shipped since 2019." />
            <NoiseTexture />

            {/* Custom cursor */}
            <CursorFollower visible={cursorVisible} label="View" />

            {/* Preview bubble */}
            <PreviewBubble project={hoveredProject} visible={previewVisible} />

            {/* ══════════════════════════════════════
                HERO
            ══════════════════════════════════════ */}
            <section className="relative pt-32 pb-0 px-6 md:px-12 lg:px-16 overflow-hidden">
                {/* Ambient glow */}
                <div
                    className="absolute pointer-events-none"
                    style={{
                        top: '0%', left: '-10%',
                        width: '50vw', height: '50vw',
                        background: `radial-gradient(circle, rgba(242,101,34,0.06) 0%, transparent 65%)`,
                    }}
                />

                <div className="max-w-[1400px] mx-auto">
                    {/* Label */}
                    <Reveal delay={0} className="flex items-center gap-3 mb-8">
                        <div className="h-[1px] w-5" style={{ background: ORANGE, opacity: 0.5 }} />
                        <span className="text-[0.58rem] font-mono tracking-[0.28em] uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            Selected Work
                        </span>
                    </Reveal>

                    {/* Headline */}
                    <div className="flex flex-col gap-0 mb-2">
                        <SplitReveal
                            text="OUR"
                            delay={0.2}
                            className="text-[18vw] md:text-[11vw] font-black leading-[0.82] tracking-[-0.04em] uppercase"
                            style={{ fontFamily: 'var(--font-nero)', color: 'rgba(255,255,255,0.9)' }}
                        />
                        <div className="flex items-end gap-6 flex-wrap">
                            <SplitReveal
                                text="PROJECTS"
                                delay={0.35}
                                className="text-[18vw] md:text-[11vw] font-black leading-[0.82] tracking-[-0.04em] uppercase"
                                style={{ fontFamily: 'var(--font-nero)', color: 'transparent', WebkitTextStroke: `1.5px rgba(242,101,34,0.55)` }}
                            />
                            <Reveal delay={0.7} className="pb-2 md:pb-3 hidden md:block">
                                <span
                                    className="text-[0.62rem] font-mono tracking-[0.15em] uppercase"
                                    style={{ color: 'rgba(255,255,255,0.25)' }}
                                >
                                    {projects.length} cases
                                </span>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                FEATURED GRID
            ══════════════════════════════════════ */}
            <section className="relative px-6 md:px-12 lg:px-16 pt-16 md:pt-20 pb-8">
                <div className="max-w-[1400px] mx-auto">
                    <Reveal delay={0} className="flex items-center gap-3 mb-8">
                        <span className="text-[0.58rem] font-mono tracking-[0.28em] uppercase" style={{ color: ORANGE, opacity: 0.7 }}>
                            Featured
                        </span>
                        <div className="h-[1px] flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
                    </Reveal>

                    <div
                        className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
                        onMouseEnter={() => setCursorVisible(true)}
                        onMouseLeave={() => setCursorVisible(false)}
                    >
                        {featuredProjects.map((project, i) => (
                            <FeaturedCard key={project.id} project={project} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                FILTER TABS
            ══════════════════════════════════════ */}
            <section className="px-6 md:px-12 lg:px-16 pt-16 md:pt-20">
                <div className="max-w-[1400px] mx-auto">
                    <div
                        className="flex items-center border-b pb-0 gap-0 overflow-x-auto"
                        style={{ borderColor: 'rgba(255,255,255,0.07)' }}
                    >
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className="relative shrink-0 px-5 md:px-7 py-4 text-[0.58rem] font-mono tracking-[0.2em] uppercase transition-colors duration-300 outline-none"
                                style={{ color: activeFilter === cat ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.28)' }}
                            >
                                {cat}
                                {activeFilter === cat && (
                                    <motion.div
                                        layoutId="filter-underline"
                                        className="absolute bottom-0 left-0 right-0 h-[1.5px]"
                                        style={{ background: ORANGE }}
                                        transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                                    />
                                )}
                            </button>
                        ))}

                        <div className="flex-1" />
                        <span className="text-[0.5rem] font-mono shrink-0 pr-1 pb-4" style={{ color: 'rgba(255,255,255,0.18)' }}>
                            {filteredProjects.length} result{filteredProjects.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                PROJECT LIST
            ══════════════════════════════════════ */}
            <section
                className="px-6 md:px-12 lg:px-16 pb-28 md:pb-40"
                onMouseEnter={() => setCursorVisible(true)}
                onMouseLeave={() => { setCursorVisible(false); setPreviewVisible(false); setHoveredProject(null); }}
            >
                <div className="max-w-[1400px] mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeFilter}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {filteredProjects.map((project, i) => (
                                <ProjectRow
                                    key={project.id}
                                    project={project}
                                    index={i}
                                    onHover={() => { setHoveredProject(project); setPreviewVisible(true); }}
                                    onLeave={() => { setPreviewVisible(false); }}
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {filteredProjects.length === 0 && (
                        <div className="py-20 text-center">
                            <span className="text-[0.65rem] font-mono tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
                                No projects in this category
                            </span>
                        </div>
                    )}
                </div>
            </section>

            {/* ══════════════════════════════════════
                BOTTOM CTA
            ══════════════════════════════════════ */}
            <section
                className="relative px-6 md:px-12 lg:px-16 py-20 md:py-28 overflow-hidden"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#0a0a0a' }}
            >
                <div
                    className="absolute pointer-events-none"
                    style={{
                        bottom: '-30%', right: '-5%',
                        width: '45vw', height: '45vw',
                        background: `radial-gradient(circle, rgba(242,101,34,0.06) 0%, transparent 65%)`,
                    }}
                />
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
                    <Reveal delay={0}>
                        <div className="flex flex-col gap-2">
                            <span className="text-[0.58rem] font-mono tracking-[0.25em] uppercase" style={{ color: ORANGE, opacity: 0.7 }}>
                                Next Step
                            </span>
                            <p
                                className="text-[5vw] md:text-[2.2vw] font-black uppercase leading-[0.92] tracking-[-0.025em]"
                                style={{ fontFamily: 'var(--font-nero)', color: 'rgba(255,255,255,0.85)' }}
                            >
                                Your project<br />
                                <span style={{ color: 'transparent', WebkitTextStroke: `1px ${ORANGE}70` }}>
                                    could be here.
                                </span>
                            </p>
                        </div>
                    </Reveal>

                    <Reveal delay={0.15}>
                        <motion.a
                            href="/contact"
                            whileHover={{ backgroundColor: ORANGE, color: '#000', scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ duration: 0.25 }}
                            className="flex items-center gap-3 px-8 py-4 border text-[0.6rem] font-mono tracking-[0.22em] uppercase"
                            style={{ borderColor: `${ORANGE}50`, color: 'rgba(255,255,255,0.7)', background: 'transparent' }}
                        >
                            Start a Project
                            <span>→</span>
                        </motion.a>
                    </Reveal>
                </div>
            </section>
        </div>
    );
}