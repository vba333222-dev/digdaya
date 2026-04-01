import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Vision', href: '#vision' },
    { label: 'Contact', href: '#contact' },
];

const menuVariants = {
    hidden: { clipPath: 'inset(0% 0% 100% 0%)' },
    visible: {
        clipPath: 'inset(0% 0% 0% 0%)',
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as [number, number, number, number], staggerChildren: 0.1, delayChildren: 0.3 },
    },
    exit: {
        clipPath: 'inset(100% 0% 0% 0%)',
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] },
    },
};

const linkVariants = {
    hidden: { y: 100, opacity: 0, rotateX: -20 },
    visible: {
        y: 0, opacity: 1, rotateX: 0,
        transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
    exit: {
        y: -40, opacity: 0, rotateX: 10,
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
};

export const NavigationMenu = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="nav-overlay"
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
                    style={{ background: '#050505' }}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Navigation menu"
                >


                    {/* Background giant text */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                        <motion.span
                            variants={{
                                hidden: { y: '100%', opacity: 0 },
                                visible: {
                                    y: 0, opacity: 1,
                                    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
                                },
                                exit: {
                                    y: '-50%', opacity: 0,
                                    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
                                }
                            }}
                            className="text-[30vw] font-black uppercase leading-[0.8]"
                            style={{
                                fontFamily: 'var(--font-nero)',
                                color: 'transparent',
                                WebkitTextStroke: '1px rgba(242,101,34,0.04)',
                            }}
                        >
                            MENU
                        </motion.span>
                    </div>

                    {/* Nav Links */}
                    <nav className="relative z-10 flex flex-col items-center gap-4 md:gap-6" style={{ perspective: '600px' }}>
                        {navLinks.map((link) => (
                            <motion.a
                                key={link.label}
                                href={link.href}
                                variants={linkVariants}
                                onClick={onClose}
                                className="group relative text-[12vw] md:text-[6vw] font-black uppercase leading-[0.9] tracking-[-0.03em] text-white/90 hover:text-[#F26522] transition-colors duration-500"
                                style={{ fontFamily: 'var(--font-nero)', transformOrigin: 'center bottom' }}
                            >
                                {link.label}
                                <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-[0.6rem] font-mono text-[#F26522] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    →
                                </span>
                            </motion.a>
                        ))}
                    </nav>

                    {/* Bottom info */}
                    <motion.div
                        variants={linkVariants}
                        className="absolute bottom-8 left-8 md:left-16 flex items-center gap-4"
                    >
                        <span className="text-[0.6rem] font-mono text-white/20 tracking-wider uppercase">
                            hello@digdaya.id
                        </span>
                        <div className="h-[1px] w-8 bg-white/10" />
                        <span className="text-[0.6rem] font-mono text-white/15 tracking-wider">
                            Jakarta, ID
                        </span>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
