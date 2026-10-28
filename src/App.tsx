import { useRef, useState } from 'react';
import { useLenis } from './hooks/useLenis';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Work } from './components/Work';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { LoadingScreen } from './components/LoadingScreen';
import s from './App.module.css';
import './styles/global.css';

export default function App() {
  useLenis();
  const pageRef = useRef<HTMLDivElement>(null);
  const [showLoader, setShowLoader] = useState(true);

  return (
    <>
      {/* Skip to main content — accessibility */}
      <a href="#main" className="visually-hidden">
        Skip to main content
      </a>

      <div ref={pageRef} className={s.pageShell}>
        <Header />

        <main id="main">
          <Hero />
          <Work />
          <About />
          <Contact />
        </main>

        <Footer />
      </div>

      {showLoader && (
        <LoadingScreen
          pageRef={pageRef}
          onComplete={() => setShowLoader(false)}
        />
      )}
    </>
  );
}