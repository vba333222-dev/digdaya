import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValueEvent, useScroll, AnimatePresence } from 'framer-motion';
import { NavigationMenu } from './NavigationMenu';

/**
 * Logo icon SVG — paths extracted directly from the official Digdaya SVG source file.
 * Drawing order: grey pill (back) → grey circle → orange pill (front)
 */
const LogoIcon = ({ className = '' }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 5 126 115"
        fill="none"
        className={className}
    >
        {/* Grey pill (behind) */}
        <path
            fill="#737373"
            d="M 107.4375 10.269531 C 111.871094 12.882812 115.085938 17.144531 116.378906 22.128906 C 117.667969 27.109375 116.925781 32.398438 114.316406 36.832031 L 76.507812 101.058594 C 73.898438 105.492188 69.632812 108.710938 64.652344 110 C 59.671875 111.289062 54.382812 110.546875 49.945312 107.9375 C 45.511719 105.328125 42.296875 101.0625 41.007812 96.082031 C 39.71875 91.097656 40.457031 85.808594 43.070312 81.375 L 80.875 17.148438 C 83.484375 12.714844 87.75 9.5 92.730469 8.210938 C 97.710938 6.917969 103.003906 7.660156 107.4375 10.269531 Z"
        />
        {/* Grey circle (upper-left dot) */}
        <circle cx="22.09" cy="34.48" r="19.99" fill="#737373" />
        {/* Orange pill (front, overlapping) */}
        <path
            fill="#ff751f"
            d="M 113.917969 16.75 C 118.351562 19.363281 121.566406 23.625 122.855469 28.609375 C 124.148438 33.589844 123.40625 38.878906 120.796875 43.3125 L 82.988281 107.539062 C 80.378906 111.972656 76.113281 115.191406 71.132812 116.480469 C 66.152344 117.769531 60.863281 117.027344 56.425781 114.417969 C 51.992188 111.808594 48.777344 107.542969 47.488281 102.5625 C 46.195312 97.578125 46.9375 92.289062 49.550781 87.855469 L 87.355469 23.628906 C 89.964844 19.195312 94.230469 15.980469 99.210938 14.6875 C 104.191406 13.398438 109.484375 14.140625 113.917969 16.75 Z"
        />
    </svg>
);

export const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const lastScrollY = useRef(0);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, 'change', (latest) => {
        const direction = latest > lastScrollY.current ? 'down' : 'up';
        const delta = Math.abs(latest - lastScrollY.current);

        if (delta > 5) {
            setHidden(direction === 'down' && latest > 120);
            lastScrollY.current = latest;
        }

        setScrolled(latest > 80);
    });

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    return (
        <>
            <motion.header
                initial={{ y: 0, opacity: 0 }}
                animate={{
                    y: hidden ? -100 : 0,
                    opacity: 1,
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed top-0 left-0 w-full z-[110] py-4 md:py-5 px-6 md:px-12 lg:px-16 flex justify-between items-center pointer-events-none transition-colors duration-500 ${(scrolled || menuOpen)
                    ? 'backdrop-blur-xl bg-[#050505]/70 border-b border-white/[0.04]'
                    : 'bg-transparent'
                    }`}
                style={{ mixBlendMode: (scrolled || menuOpen) ? 'normal' : 'difference' }}
            >
                {/* Brand Logo */}
                <a
                    href="/"
                    aria-label="Digdaya Teknokraf — Home"
                    className="flex items-center gap-2 pointer-events-auto cursor-none group no-underline text-white"
                >
                    {/* Icon — height matches "digdaya" text height */}
                    <LogoIcon className="h-[1.4rem] md:h-[1.8rem] w-auto flex-shrink-0" />

                    {/* Text block */}
                    <div className="flex flex-col leading-none">
                        <span
                            className="text-[1.4rem] md:text-[1.8rem] font-bold font-codec lowercase text-white"
                            style={{ lineHeight: '1', letterSpacing: '-0.02em' }}
                        >
                            digdaya
                        </span>
                        {/* TEKNOKRAF — 69.2/247 = 0.28× ratio, letters span digdaya width */}
                        <div className="flex justify-between w-full mt-[2px] md:mt-[3px]">
                            {'TEKNOKRAF'.split('').map((c, i) => (
                                <span
                                    key={i}
                                    className="text-[0.39rem] md:text-[0.5rem] font-semibold text-[#ea6001] font-montserrat uppercase"
                                >
                                    {c}
                                </span>
                            ))}
                        </div>
                    </div>
                </a>

                {/* Right side nav items */}
                {/* Right side nav items */}
                <div className="flex items-center pointer-events-auto">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="relative w-12 h-12 flex flex-col items-end justify-center gap-[6px] text-white transition-colors duration-300 cursor-none group"
                        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    >
                        <motion.span
                            animate={{
                                rotate: menuOpen ? -45 : 0,
                                y: menuOpen ? 8 : 0,
                                backgroundColor: menuOpen ? '#F26522' : 'currentColor'
                            }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="w-8 h-[2px] block origin-center"
                        />
                        <motion.span
                            animate={{
                                width: menuOpen ? 0 : 32,
                                opacity: menuOpen ? 0 : 1,
                                backgroundColor: menuOpen ? '#F26522' : 'currentColor'
                            }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="h-[2px] block"
                        />
                        <motion.span
                            animate={{
                                rotate: menuOpen ? 45 : 0,
                                y: menuOpen ? -8 : 0,
                                width: menuOpen ? 32 : 16,
                                backgroundColor: menuOpen ? '#F26522' : 'currentColor'
                            }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="h-[2px] block group-hover:w-8 transition-all duration-300 origin-center"
                        />
                    </button>
                </div>
            </motion.header>

            <NavigationMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </>
    );
};
