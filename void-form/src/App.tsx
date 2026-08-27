import React, { useEffect, useState } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { NavigationHUD } from './components/NavigationHUD';
import { CustomCursor } from './components/CustomCursor';
import { HeroSection } from './components/HeroSection';
import { VoidSection } from './components/VoidSection';
import { DistortionGallerySection } from './components/DistortionGallerySection';
import { ProjectsSection } from './components/ProjectsSection';
import { ManifestoSection } from './components/ManifestoSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { tickerService } from './core/ticker-service';
import { cursorEngine } from './core/cursor-engine';

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Initialize Unified Master Ticker and Lenis Smooth Scrolling
    tickerService.init();

    // 2. Register Cursor update loop inside master ticker
    const removeCursorTicker = tickerService.add((_time, delta) => {
      cursorEngine.update(delta);
    });

    return () => {
      removeCursorTicker();
      tickerService.destroy();
      cursorEngine.destroy();
    };
  }, []);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    const lenis = tickerService.getLenis();
    if (el && lenis) {
      lenis.scrollTo(el, { offset: -20, duration: 1.4 });
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#060709] text-[#EDE8DE] selection:bg-[#FF3B00] selection:text-black">
      {/* Custom Physics Cursor */}
      <CustomCursor />

      {/* Loading Genesis Screen */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Studio Navigation & Telemetry HUD */}
      <NavigationHUD onNavigate={handleNavigate} />

      {/* Main Experience Layout */}
      <main className="relative z-10 w-full overflow-hidden">
        <HeroSection />
        <VoidSection />
        <DistortionGallerySection />
        <ProjectsSection />
        <ManifestoSection />
        <AboutSection />
        <ContactSection />
      </main>
    </div>
  );
};

export default App;
