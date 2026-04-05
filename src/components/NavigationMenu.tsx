import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const navLinks = [
    { label: 'About', href: '/about', num: '01', sub: 'Who we are' },
    { label: 'Projects', href: '/projects', num: '02', sub: 'Our work' },
    { label: 'Services', href: '/services', num: '03', sub: 'What we do' },
    { label: 'Contact', href: '/contact', num: '04', sub: 'Get in touch' },
];

const socials = ['Instagram', 'LinkedIn', 'Behance'];

// ─────────────────────────────────────────────
// MAGNETIC CURSOR
// ─────────────────────────────────────────────
const useMagnetic = (strength = 0.35) => {
    const ref = useRef<HTMLAnchorElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 180, damping: 18 });
    const springY = useSpring(y, { stiffness: 180, damping: 18 });

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const handleMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            x.set((e.clientX - cx) * strength);
            y.set((e.clientY - cy) * strength);
        };
        const handleLeave = () => { x.set(0); y.set(0); };
        el.addEventListener('mousemove', handleMove);
        el.addEventListener('mouseleave', handleLeave);
        return () => {
            el.removeEventListener('mousemove', handleMove);
            el.removeEventListener('mouseleave', handleLeave);
        };
    }, [x, y, strength]);

    return { ref, springX, springY };
};

// ─────────────────────────────────────────────
// SINGLE NAV ITEM
// ─────────────────────────────────────────────
const NavItem = ({
    link,
    index,
    onClose,
    isHovered,
    isActive,
    onHover,
    onLeave,
}: {
    link: typeof navLinks[0];
    index: number;
    onClose: () => void;
    isHovered: boolean;
    isActive: boolean;
    onHover: () => void;
    onLeave: () => void;
}) => {
    const { ref, springX, springY } = useMagnetic(0.28);

    return (
        <motion.div
            custom={index}
            variants={{
                hidden: { y: 80, opacity: 0, rotateX: -15, filter: 'blur(6px)' },
                visible: (i: number) => ({
                    y: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)',
                    transition: {
                        duration: 1.1,
                        delay: 0.25 + i * 0.08,
                        ease: [0.16, 1, 0.3, 1],
                    },
                }),
                exit: (i: number) => ({
                    y: -30, opacity: 0,
                    transition: { duration: 0.35, delay: i * 0.03 },
                }),
            }}
            className="relative"
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            style={{ perspective: '800px' }}
        >
            <motion.div
                style={{ x: springX, y: springY }}
                className="relative"
            >
                <Link
                    ref={ref}
                    to={link.href}
                    onClick={onClose}
                    className="group flex items-baseline gap-5 cursor-pointer select-none"
                >
                    {/* Active indicator */}
                    {isActive && (
                        <motion.div
                            layoutId="nav-active"
                            className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 w-1.5 h-6 md:h-8 bg-[#F26522]"
                            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                        />
                    )}

                    {/* Index number */}
                    <motion.span
                        animate={{ opacity: isHovered || isActive ? 1 : 0.22, x: isHovered ? 0 : -4 }}
                        transition={{ duration: 0.3 }}
                        className="text-[0.62rem] font-mono tracking-[0.18em] text-[#F26522] hidden md:block w-6 shrink-0"
                    >
                        {link.num}
                    </motion.span>

                    {/* Main label */}
                    <span className="relative overflow-hidden block">
                        {/* Default text */}
                        <motion.span
                            animate={{ y: isHovered ? '-105%' : '0%' }}
                            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
                            className="block text-[13vw] md:text-[6.5vw] font-black uppercase leading-[0.88] tracking-[-0.035em]"
                            style={{
                                fontFamily: 'var(--font-nero)',
                                color: isActive ? '#F26522' : isHovered ? 'transparent' : 'rgba(255,255,255,0.88)',
                                transition: 'color 0.3s',
                            }}
                        >
                            {link.label}
                        </motion.span>
                        {/* Hover text — orange outlined */}
                        <motion.span
                            animate={{ y: isHovered ? '0%' : '105%' }}
                            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
                            className="absolute inset-0 block text-[13vw] md:text-[6.5vw] font-black uppercase leading-[0.88] tracking-[-0.035em]"
                            style={{
                                fontFamily: 'var(--font-nero)',
                                color: 'transparent',
                                WebkitTextStroke: '1.5px rgba(242,101,34,0.85)',
                            }}
                        >
                            {link.label}
                        </motion.span>
                    </span>

                    {/* Sub label */}
                    <motion.span
                        animate={{ opacity: isHovered ? 0.55 : (isActive ? 0.4 : 0), x: isHovered ? 0 : 10 }}
                        transition={{ duration: 0.35 }}
                        className="text-[0.62rem] font-mono tracking-[0.14em] text-white/50 uppercase hidden md:block"
                    >
                        {isActive ? '● Current' : link.sub}
                    </motion.span>
                </Link>
            </motion.div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────
// GLITCH LINES DECORATION
// ─────────────────────────────────────────────
const GlitchLines = ({ visible }: { visible: boolean }) => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
            <motion.div
                key={i}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={visible ? {
                    scaleX: [0, 1, 0.7, 1],
                    opacity: [0, 0.06, 0.03, 0.05],
                    transition: { delay: 0.4 + i * 0.12, duration: 1.4, ease: 'easeInOut' },
                } : { scaleX: 0, opacity: 0 }}
                className="absolute left-0 w-full"
                style={{
                    top: `${15 + i * 18}%`,
                    height: '1px',
                    background: i % 2 === 0
                        ? 'linear-gradient(90deg, transparent 0%, rgba(242,101,34,0.4) 30%, transparent 70%)'
                        : 'linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.3) 50%, transparent 80%)',
                    transformOrigin: 'left center',
                }}
            />
        ))}
    </div>
);

// ─────────────────────────────────────────────
// CORNER ORNAMENT
// ─────────────────────────────────────────────
const CornerBracket = ({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) => {
    const posClass = {
        tl: 'top-6 left-6 md:top-10 md:left-10',
        tr: 'top-6 right-6 md:top-10 md:right-10 rotate-90',
        bl: 'bottom-6 left-6 md:bottom-10 md:left-10 -rotate-90',
        br: 'bottom-6 right-6 md:bottom-10 md:right-10 rotate-180',
    }[pos];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 0.25, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className={`absolute ${posClass} pointer-events-none`}
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M0 24 L0 0 L24 0" stroke="rgba(242,101,34,0.7)" strokeWidth="1.5" fill="none" />
            </svg>
        </motion.div>
    );
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export const NavigationMenu = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [anyHovered, setAnyHovered] = useState(false);
    const location = useLocation();

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    key="nav-overlay"
                    initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
                    animate={{
                        clipPath: 'inset(0% 0% 0% 0%)',
                        transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
                    }}
                    exit={{
                        clipPath: 'inset(100% 0% 0% 0%)',
                        transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
                    }}
                    className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
                    style={{ background: 'var(--bg-base)' }}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Navigation menu"
                >
                    {/* ── Noise texture overlay ── */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
                            opacity: 0.6,
                        }}
                    />

                    {/* ── Orange radial glow ── */}
                    <div
                        className="absolute pointer-events-none"
                        style={{
                            bottom: '-10%', right: '-5%',
                            width: '50vw', height: '50vw',
                            background: 'radial-gradient(circle, rgba(242,101,34,0.07) 0%, transparent 65%)',
                        }}
                    />
                    <div
                        className="absolute pointer-events-none"
                        style={{
                            top: '10%', left: '-10%',
                            width: '35vw', height: '35vw',
                            background: 'radial-gradient(circle, rgba(242,101,34,0.04) 0%, transparent 65%)',
                        }}
                    />

                    {/* ── Animated scan lines ── */}
                    <GlitchLines visible={isOpen} />

                    {/* ── Corner brackets ── */}
                    <CornerBracket pos="tl" />
                    <CornerBracket pos="tr" />
                    <CornerBracket pos="bl" />
                    <CornerBracket pos="br" />

                    {/* ── Background giant ghost text ── */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                        <motion.span
                            initial={{ y: '80%', opacity: 0 }}
                            animate={{
                                y: '8%', opacity: 1,
                                transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 },
                            }}
                            exit={{ y: '-30%', opacity: 0, transition: { duration: 0.5 } }}
                            className="text-[38vw] md:text-[28vw] font-black uppercase leading-[0.75] select-none"
                            style={{
                                fontFamily: 'var(--font-nero)',
                                color: 'transparent',
                                WebkitTextStroke: '1px rgba(255,255,255,0.028)',
                            }}
                        >
                            NAV
                        </motion.span>
                    </div>

                    {/* ── Vertical index line (desktop) ── */}
                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1, transition: { duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] } }}
                        exit={{ scaleY: 0 }}
                        className="absolute left-[8vw] top-[15%] bottom-[15%] w-[1px] hidden lg:block pointer-events-none"
                        style={{
                            background: 'linear-gradient(180deg, transparent 0%, rgba(242,101,34,0.25) 30%, rgba(242,101,34,0.25) 70%, transparent 100%)',
                            transformOrigin: 'top',
                        }}
                    />

                    {/* ── Top bar ── */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.6 } }}
                        exit={{ opacity: 0 }}
                        className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 md:px-12 lg:px-16 py-6 md:py-8"
                    >
                        <span
                            className="text-[0.6rem] font-mono tracking-[0.28em] uppercase"
                            style={{ color: 'rgba(255,255,255,0.18)' }}
                        >
                            DIGDAYA
                        </span>
                        <span
                            className="text-[0.6rem] font-mono tracking-[0.28em] uppercase"
                            style={{ color: 'rgba(255,255,255,0.18)' }}
                        >
                            Nav / Menu
                        </span>
                    </motion.div>

                    {/* ── Main nav links ── */}
                    <div className="flex-1 flex items-center justify-center md:justify-start px-6 md:px-[12vw] lg:px-[14vw]">
                        <motion.nav
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="flex flex-col items-start gap-1 md:gap-2"
                            style={{ perspective: '900px' }}
                        >
                            {navLinks.map((link, i) => (
                                <NavItem
                                    key={link.label}
                                    link={link}
                                    index={i}
                                    onClose={onClose}
                                    isHovered={hoveredIndex === i}
                                    isActive={location.pathname === link.href}
                                    onHover={() => { setHoveredIndex(i); setAnyHovered(true); }}
                                    onLeave={() => { setHoveredIndex(null); setAnyHovered(false); }}
                                />
                            ))}
                        </motion.nav>
                    </div>

                    {/* ── Bottom bar ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.7, duration: 0.7 } }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-6 md:px-12 lg:px-16 py-7 md:py-9"
                    >
                        {/* Contact info */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[0.58rem] font-mono text-white/20 tracking-[0.2em] uppercase">
                                hello@digdaya.id
                            </span>
                            <div className="flex items-center gap-3">
                                <div className="h-[1px] w-5" style={{ background: 'rgba(242,101,34,0.4)' }} />
                                <span className="text-[0.58rem] font-mono text-white/14 tracking-wider">
                                    Jakarta, Indonesia
                                </span>
                            </div>
                        </div>

                        {/* Socials */}
                        <div className="flex items-center gap-5 md:gap-7">
                            {socials.map((s, i) => (
                                <motion.a
                                    key={s}
                                    href="#"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, transition: { delay: 0.8 + i * 0.07 } }}
                                    whileHover={{ color: '#F26522' }}
                                    className="text-[0.58rem] font-mono tracking-[0.18em] uppercase transition-colors duration-300"
                                    style={{ color: 'rgba(255,255,255,0.22)' }}
                                >
                                    {s}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* ── Hover accent line (tracks which item is hovered) ── */}
                    <motion.div
                        animate={{
                            opacity: anyHovered ? 1 : 0,
                            scaleX: anyHovered ? 1 : 0.3,
                        }}
                        transition={{ duration: 0.3 }}
                        className="absolute bottom-[18%] left-0 right-0 h-[1px] pointer-events-none hidden md:block"
                        style={{
                            background: 'linear-gradient(90deg, transparent 0%, rgba(242,101,34,0.18) 20%, rgba(242,101,34,0.35) 50%, rgba(242,101,34,0.18) 80%, transparent 100%)',
                            transformOrigin: 'center',
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};