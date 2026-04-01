import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Preloader = () => {
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Force scroll to top on mount
        window.scrollTo(0, 0);

        let start: number;
        const duration = 1500; // 1.5 seconds

        const updateProgress = (timestamp: number) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;

            // Easing function for progress (ease-out cubic)
            const t = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - t, 3);

            const currentProgress = Math.floor(easeOut * 100);
            setProgress(currentProgress);

            if (elapsed < duration) {
                requestAnimationFrame(updateProgress);
            } else {
                setIsLoading(false);
            }
        };

        requestAnimationFrame(updateProgress);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#050505] text-white"
                    role="status"
                    aria-live="polite"
                    aria-label="Loading"
                >
                    <div className="flex flex-col items-center">
                        <span className="text-[12vw] md:text-[8vw] font-mono leading-none tracking-tighter mix-blend-difference">
                            {progress.toString().padStart(3, '0')}%
                        </span>
                        <div className="h-[1px] w-[50vw] md:w-[20vw] bg-white/20 mt-8 relative overflow-hidden">
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-[#F26522]"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
