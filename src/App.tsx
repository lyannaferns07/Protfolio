import { useLenis } from './hooks/useLenis';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Work } from './components/Work';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import './styles/global.css';

export default function App() {
  useLenis();

  return (
    <>
      {/* Skip to main content — accessibility */}
      <a href="#main" className="visually-hidden">
        Skip to main content
      </a>

      <Header />

      <main id="main">
        <Hero />
        <Work />
        <About />
        <Contact />
      </main>

      <Footer />
    </>
  );
}