import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { Header } from './Header';
import { Footer } from './Footer';
import { Preloader } from './Preloader';
import { CustomCursor } from './CustomCursor';

export function Layout() {
    const lenisRef = useRef<Lenis | null>(null);
    const location = useLocation();

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.8,
            easing: (t) => 1 - Math.pow(1 - t, 4), // quartOut for elegant cinematic scroll
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 0.9,
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => lenis.destroy();
    }, []);

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
        if (lenisRef.current) {
            lenisRef.current.scrollTo(0, { immediate: true });
        }
    }, [location.pathname]);

    return (
        <>
            <Preloader />
            <CustomCursor />
            {/* Skip to content — accessible keyboard navigation */}
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-[#F26522] focus:text-white focus:px-4 focus:py-2 focus:text-sm focus:rounded"
            >
                Skip to content
            </a>
            <div className="min-h-screen text-stark-white w-full overflow-x-clip relative selection:bg-tech-orange selection:text-white bg-[var(--bg-base)]">
                <Header />
                <main id="main" className="min-h-screen">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </>
    );
}

