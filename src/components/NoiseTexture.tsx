import { useRef, useEffect } from 'react';

/**
 * Subtle film grain texture — finer, less aggressive.
 * Uses smaller, denser noise with soft blending.
 */
export const NoiseTexture = ({
    opacity = 0.035,
    className = '',
}: {
    opacity?: number;
    className?: string;
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Higher res = finer grain
        const w = 512;
        const h = 512;
        canvas.width = w;
        canvas.height = h;

        const imageData = ctx.createImageData(w, h);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            // Bias toward midtones for subtlety
            const val = 100 + Math.random() * 80;
            data[i] = val;
            data[i + 1] = val;
            data[i + 2] = val;
            data[i + 3] = 255;
        }

        ctx.putImageData(imageData, 0, 0);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
            style={{
                opacity,
                mixBlendMode: 'soft-light',
                imageRendering: 'auto',
            }}
        />
    );
};
