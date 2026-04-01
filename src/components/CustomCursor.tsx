import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        // Disable custom cursor on touch devices
        const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
        if (isTouchDevice) return;

        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX - 8);
            mouseY.set(e.clientY - 8);
        };
        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, [mouseX, mouseY]);

    // Don't render on touch devices
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
        return null;
    }

    return (
        <motion.div
            className="fixed top-0 left-0 w-4 h-4 rounded-full bg-[#F26522] z-[9999] pointer-events-none hidden md:block"
            style={{
                x: cursorX,
                y: cursorY,
                mixBlendMode: 'difference'
            }}
        />
    );
};
