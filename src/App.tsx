import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { VideoReel } from './components/VideoReel';
import { Services } from './components/Services';
import { Vision } from './components/Vision';
import { Footer } from './components/Footer';
import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';

function App() {
  const lenisRef = useRef<Lenis | null>(null);

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

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <>
      <Preloader />
      <CustomCursor />
      <div className="min-h-screen text-stark-white w-full overflow-x-clip relative selection:bg-tech-orange selection:text-white bg-[#090909]">
        <Header />
        <main id="main">
          <Hero />
          <VideoReel />
          <Services />
          <Vision />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
