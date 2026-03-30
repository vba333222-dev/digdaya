import { motion } from 'framer-motion';

export const Header = () => {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 w-full z-50 py-6 px-8 md:px-16 flex justify-between items-center mix-blend-difference text-white pointer-events-none"
        >
            {/* Brand Logo */}
            <div className="flex items-center gap-3 pointer-events-auto cursor-pointer group">
                <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0 flex items-center justify-center mt-1">
                    {/* Circle */}
                    <div className="absolute top-[25%] left-[5%] w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-industrial-grey group-hover:bg-stark-white transition-colors duration-500"></div>
                    {/* Grey Pill */}
                    <div className="absolute top-[25%] left-[30%] w-3 h-9 md:w-3.5 md:h-10 rounded-full bg-industrial-grey rotate-[35deg] group-hover:bg-stark-white transition-colors duration-500"></div>
                    {/* Orange Pill */}
                    <div className="absolute top-[20%] left-[50%] w-3 h-9 md:w-3.5 md:h-10 rounded-full bg-tech-orange rotate-[35deg]"></div>
                </div>
                <div className="flex flex-col uppercase leading-none">
                    <span className="text-4xl md:text-5xl font-bold font-codec lowercase tracking-normal">digdaya</span>
                    <div className="flex justify-between w-full text-[0.55rem] md:text-[0.7rem] font-bold text-tech-orange font-montserrat mt-1 md:mt-1.5">
                        {'TEKNOKRAF'.split('').map((c, i) => <span key={i}>{c}</span>)}
                    </div>
                </div>
            </div>

            {/* Nav Menu Button Placeholder */}
            <button className="pointer-events-auto text-sm uppercase tracking-widest hover:text-tech-orange transition-colors duration-300">
                Menu
            </button>
        </motion.header>
    );
};
