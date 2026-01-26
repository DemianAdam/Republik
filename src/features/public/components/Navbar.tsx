import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const isContactPage = location.pathname === '/contact';

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav

      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 py-4 flex items-center justify-between border-b
        ${scrolled
          ? 'bg-black/60 backdrop-blur-md border-white/10'
          : 'bg-transparent border-transparent'
        }
      `}
    >

      <Link to="/" className="flex items-center gap-3 group">
        <img
          src="/logo-natura.webp"
          alt="Natura"
          className="h-10 w-10 rounded-full border border-white/20 object-cover group-hover:scale-105 transition-transform duration-300"
          fetchpriority="high"
          loading="eager"
          decoding="async"

        />

      </Link>


      {!isContactPage && (
        <Link
          to="/contact"
          className="px-6 py-2 bg-white text-black font-semibold rounded-full text-sm hover:bg-green-600 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-green-500/50"
        >
          Contacto
        </Link>
      )}
    </nav>
  );
}