import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// --- 3D Object ---
const AbstractShape = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { gl } = useThree();
    const canvasRef = useRef(gl.domElement);
    const inView = useInView(canvasRef);

    useFrame((state, delta) => {
        if (!meshRef.current || !inView) return;
        const targetX = (state.pointer.y * Math.PI) / 4;
        const targetY = (state.pointer.x * Math.PI) / 4;
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetX, 0.05);
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetY, 0.05);
        meshRef.current.rotation.z += delta * 0.15;
    });
    return (
        <mesh ref={meshRef}>
            <icosahedronGeometry args={[2.5, 0]} />
            <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
    );
};

// --- Character Stagger Animation ---
const AnimatedLine = ({
    text,
    delay = 0,
    className = '',
    style = {},
}: {
    text: string;
    delay?: number;
    className?: string;
    style?: React.CSSProperties;
}) => {
    const chars = text.split('');
    return (
        <span className={`block overflow-hidden ${className}`} style={style}>
            <span className="sr-only">{text}</span>
            <motion.span
                className="flex"
                aria-hidden="true"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {},
                    visible: {
                        transition: {
                            staggerChildren: 0.03,
                            delayChildren: delay,
                        },
                    },
                }}
            >
                {chars.map((char, i) => (
                    <motion.span
                        key={i}
                        className="inline-block"
                        style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
                        variants={{
                            hidden: { y: '120%', opacity: 0 },
                            visible: {
                                y: '0%',
                                opacity: 1,
                                transition: {
                                    duration: 0.8,
                                    ease: [0.16, 1, 0.3, 1],
                                },
                            },
                        }}
                    >
                        {char}
                    </motion.span>
                ))}
            </motion.span>
        </span>
    );
};

export const Hero = () => {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const textY = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);
    const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const objScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
    const objOpacity = useTransform(scrollYProgress, [0, 0.95], [1, 0]);
    const objY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const sectionOpacity = useTransform(scrollYProgress, [0, 0.98], [1, 0]);

    return (
        <motion.section
            ref={containerRef}
            style={{ opacity: sectionOpacity }}
            className="h-[120vh] w-full bg-[#000000] text-white flex items-center relative"
        >
            {/* Skip to content (a11y) */}
            <a href="#services" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-[#F26522] focus:text-white focus:px-4 focus:py-2 focus:text-sm">
                Skip to content
            </a>
            {/* Two-column layout */}
            <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 items-center h-full px-6 md:px-12 lg:px-20">

                {/* LEFT: 3D Object */}
                <motion.div
                    style={{ scale: objScale, opacity: objOpacity, y: objY }}
                    className="relative w-full h-[50vh] md:h-[80vh] pointer-events-auto"
                >
                    <Canvas camera={{ position: [0, 0, 7], fov: 45 }} style={{ background: 'transparent' }}>
                        <AbstractShape />
                    </Canvas>
                </motion.div>

                {/* RIGHT: Text — left aligned */}
                <motion.div
                    style={{ y: textY, opacity: textOpacity }}
                    className="flex flex-col justify-center pointer-events-none md:pl-8 lg:pl-12"
                >
                    {/* "ENGINEERING" — outline stroke white */}
                    <AnimatedLine
                        text="ENGINEERING"
                        delay={0.3}
                        className="text-[11vw] md:text-[5vw] font-black leading-[0.9] tracking-[-0.02em] uppercase"
                        style={{
                            fontFamily: 'var(--font-nero)',
                            color: 'transparent',
                            WebkitTextStroke: '1.5px rgba(255,255,255,0.35)',
                        }}
                    />

                    {/* "THE DIGITAL &" — outline stroke orange */}
                    <AnimatedLine
                        text="THE DIGITAL &"
                        delay={0.5}
                        className="text-[11vw] md:text-[5vw] font-black leading-[0.9] tracking-[-0.02em] uppercase mt-1"
                        style={{
                            fontFamily: 'var(--font-nero)',
                            color: 'transparent',
                            WebkitTextStroke: '1.5px rgba(242,101,34,0.5)',
                        }}
                    />

                    {/* "PHYSICAL" — outline stroke orange, larger */}
                    <AnimatedLine
                        text="PHYSICAL"
                        delay={0.65}
                        className="text-[15vw] md:text-[7vw] font-black leading-[0.85] tracking-[-0.04em] uppercase"
                        style={{
                            fontFamily: 'var(--font-nero)',
                            color: 'transparent',
                            WebkitTextStroke: '1.5px rgba(242,101,34,0.5)',
                        }}
                    />

                    {/* "FRONTIER" — outline stroke white */}
                    <AnimatedLine
                        text="FRONTIER"
                        delay={0.8}
                        className="text-[11vw] md:text-[5.5vw] font-black leading-[0.9] tracking-[-0.02em] uppercase mt-1"
                        style={{
                            fontFamily: 'var(--font-nero)',
                            color: 'transparent',
                            WebkitTextStroke: '1.5px rgba(255,255,255,0.35)',
                        }}
                    />
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
            >
                <span className="text-[0.55rem] font-mono tracking-[0.3em] text-white/25 uppercase">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-[1px] h-6 bg-gradient-to-b from-[#F26522]/60 to-transparent"
                />
            </motion.div>
        </motion.section>
    );
};
