import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// SVG logo Digdaya — path diambil langsung dari file asli.
// viewBox 131×148, tiga elemen:
//   1. Rounded capsule abu-abu  (group offset 28,41)
//   2. Lingkaran abu-abu        (di origin)
//   3. Rounded capsule oranye   (group offset 37,38)
const DigdayaIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 131 148"
        width="40"
        height="45"
        style={{ display: 'block' }}
    >
        {/* ── Grey capsule (back) — path dari clipPath ca42c3424b, di-offset (28,41) ── */}
        <path
            fill="#737373"
            transform="translate(28,41)"
            d="M 8.046875 5.164062
               C 12.070312 1.957031 17.203125 0.472656 22.316406 1.046875
               C 27.429688 1.621094 32.105469 4.203125 35.316406 8.226562
               L 81.804688 66.476562
               C 85.015625 70.496094 86.496094 75.628906 85.921875 80.742188
               C 85.347656 85.855469 82.765625 90.53125 78.746094 93.742188
               C 74.722656 96.953125 69.589844 98.433594 64.476562 97.859375
               C 59.363281 97.285156 54.6875 94.703125 51.476562 90.679688
               L 4.988281 32.433594
               C 1.777344 28.410156 0.296875 23.277344 0.871094 18.164062
               C 1.445312 13.050781 4.027344 8.375 8.046875 5.164062 Z"
        />

        {/* ── Grey circle (top-left accent) — path dari clipPath f424a07c13 ── */}
        <path
            fill="#737373"
            d="M 20.34375 0.992188
               C 9.304688 0.992188 0.355469 9.941406 0.355469 20.980469
               C 0.355469 32.019531 9.304688 40.96875 20.34375 40.96875
               C 31.382812 40.96875 40.332031 32.019531 40.332031 20.980469
               C 40.332031 9.941406 31.382812 0.992188 20.34375 0.992188 Z"
        />

        {/* ── Orange capsule (front) — path dari clipPath aa7a0d3885, di-offset (37,38) ── */}
        <path
            fill="#ff751f"
            transform="translate(37,38)"
            d="M 7.414062 4.425781
               C 11.4375 1.214844 16.570312 -0.265625 21.683594 0.308594
               C 26.796875 0.882812 31.472656 3.464844 34.683594 7.488281
               L 81.171875 65.734375
               C 84.382812 69.757812 85.863281 74.890625 85.289062 80.003906
               C 84.714844 85.117188 82.132812 89.792969 78.113281 93.003906
               C 74.089844 96.214844 68.957031 97.695312 63.84375 97.121094
               C 58.730469 96.546875 54.054688 93.964844 50.84375 89.941406
               L 4.355469 31.695312
               C 1.144531 27.671875 -0.335938 22.539062 0.238281 17.425781
               C 0.8125 12.3125 3.394531 7.636719 7.414062 4.425781 Z"
        />
    </svg>
);

export const CustomCursor = () => {
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
        if (isTouchDevice) return;

        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX - 6);
            mouseY.set(e.clientY - 6);
        };

        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, [mouseX, mouseY]);

    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
        return null;
    }

    return (
        <motion.div
            className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:block"
            style={{
                x: cursorX,
                y: cursorY,
            }}
        >
            <DigdayaIcon />
        </motion.div>
    );
};