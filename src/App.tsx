import { useEffect, createContext, useContext, useRef, useState } from 'react';
import Lenis from 'lenis';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Vision } from './components/Vision';
import { Footer } from './components/Footer';

// Share the Lenis scroll value globally so components can read it
export const ScrollContext = createContext<{ scrollY: number }>({ scrollY: 0 });
export const useScrollY = () => useContext(ScrollContext);

function App() {
  const [scrollY, setScrollY] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  // Lenis Smooth Scroll Setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Expose scroll position on every frame
    lenis.on('scroll', (e: { animatedScroll: number }) => {
      setScrollY(e.animatedScroll);
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <ScrollContext.Provider value={{ scrollY }}>
      <div className="min-h-screen text-stark-white w-full overflow-x-clip relative selection:bg-tech-orange selection:text-white bg-[#090909]">
        <Header />
        <Hero />
        <Services />
        <Vision />
        <Footer />
      </div>
    </ScrollContext.Provider>
  );
}

export default App;
