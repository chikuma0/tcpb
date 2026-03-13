import { useEffect, useState } from 'react';
import Hero from './sections/Hero';
import HiddenGenealogy from './sections/HiddenGenealogy';
import TheModel from './sections/TheModel';
import HowItWorks from './sections/HowItWorks';
import TheEcosystem from './sections/TheEcosystem';
import TokyoFootprint from './sections/TokyoFootprint';
import TheNumbers from './sections/TheNumbers';
import WhyThisMatters from './sections/WhyThisMatters';

const sections = [
  { id: 'hero', label: 'トップ' },
  { id: 'genealogy', label: '系譜' },
  { id: 'model', label: 'しくみ' },
  { id: 'how-it-works', label: '流れ' },
  { id: 'ecosystem', label: 'つながり' },
  { id: 'footprint', label: '地図' },
  { id: 'numbers', label: '実績' },
  { id: 'why', label: '意義' },
];

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? window.scrollY / total : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-bg-secondary">
      <div
        className="h-full bg-accent transition-[width] duration-100"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}

function SectionNav() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
            history.replaceState(null, '', `#${id}`);
          }
        },
        { threshold: 0.3 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2" aria-label="Section navigation">
      {sections.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          className="group flex items-center gap-2 justify-end"
          aria-label={label}
          aria-current={activeSection === id ? 'true' : undefined}
        >
          <span className={`text-xs transition-opacity ${
            activeSection === id ? 'opacity-100 text-accent' : 'opacity-0 group-hover:opacity-100 text-text-muted'
          }`}>
            {label}
          </span>
          <span className={`w-2 h-2 rounded-full transition-all ${
            activeSection === id ? 'bg-accent scale-125' : 'bg-text-muted/30 group-hover:bg-text-muted/60'
          }`} />
        </a>
      ))}
    </nav>
  );
}

export default function App() {
  useEffect(() => {
    // Handle initial hash navigation
    const hash = window.location.hash.slice(1);
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, []);

  return (
    <>
      <ScrollProgress />
      <SectionNav />
      <main>
        <Hero />
        <HiddenGenealogy />
        <TheModel />
        <HowItWorks />
        <TheEcosystem />
        <TokyoFootprint />
        <TheNumbers />
        <WhyThisMatters />
      </main>
    </>
  );
}
