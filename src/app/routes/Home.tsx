import { useScrollToRef } from '../../hooks/useScrollToRef';
import { useRef } from 'react';
import Hero from 'features/public/home/components/Hero';
import About from 'features/public/home/components/About';
import Events from 'features/public/home/components/Events';
import Gallery from 'features/public/home/components/Gallery';
import Location from 'features/public/home/components/Location';
import SocialProof from 'features/public/home/components/SocialProof';

export default function Home() {
  const aboutRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  const scrollToSection = useScrollToRef({
    about: aboutRef,
    events: eventsRef,
    location: locationRef,
  });

  return (
    <div className="relative">
      <Hero onCTAClick={scrollToSection} />
      <div ref={aboutRef}>
        <About />
      </div>
      <div ref={eventsRef}>
        <Events />
      </div>
      <Gallery />
      <div ref={locationRef}>
        <Location />
      </div>
      <SocialProof />
    </div>
  );
}