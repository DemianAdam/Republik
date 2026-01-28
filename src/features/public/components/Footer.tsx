import { Instagram, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom'; // 🟢 FIX: Import from react-router-dom
import { asset } from '../../../utils/assets';

export default function Footer() {
  const location = useLocation();

  // Helper to scroll to top if clicking "Reservas" or logo
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🟢 FIX: Function to handle cross-page hash navigation
  const handleScrollLink = (e: React.MouseEvent, hash: string) => {
    // If we are NOT on the home page, standard Link behavior works (goes to /#events)
    // But if we want to be extra safe, we can force it:
    if (location.pathname !== '/') {
        // Let the Link tag do its job, but ensure the import is correct
        return; 
    }
    
    // If we ARE on the home page already, just scroll
    e.preventDefault();
    const id = hash.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-black border-t border-red-900/30 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 items-start mb-12">
          
          {/* Logo Column */}
          <div className="space-y-4">
            <Link to="/" onClick={scrollToTop}>
                <img
                src={asset("logoRepublikTransparente.webp")}
                alt="Republik"
                className="h-20 w-36 object-contain cursor-pointer"
                />
            </Link>
            <p className="text-gray-400">
              El night club que fusiona fiesta y música en el corazón de Villa Dolores.
            </p>
          </div>

          {/* Links Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Enlaces</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                {/* 🟢 FIX: to="/#events" with correct import ensures it goes to Home */}
                <Link 
                  to="/#events" 
                  onClick={(e) => handleScrollLink(e, '#events')}
                  className="hover:text-red-600 transition-colors cursor-pointer"
                >
                  Eventos
                </Link>
              </li>
              <li>
                <Link 
                  to="/#location" 
                  onClick={(e) => handleScrollLink(e, '#location')}
                  className="hover:text-red-600 transition-colors cursor-pointer"
                >
                  Ubicación
                </Link>
              </li>
              <li>
                <Link to="/contacto" onClick={scrollToTop} className="hover:text-red-600 transition-colors">
                  Reservas
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Seguinos</h3>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/republik.vd/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-red-900/30 hover:bg-red-600 text-white transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://chat.whatsapp.com/KjplHDPoKvY6vm9ZBA3Jcn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-red-900/30 hover:bg-red-600 text-white transition-all duration-300 hover:scale-110"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>

            <div className="mt-6 text-gray-400 text-sm">
              <p>+18 años</p>
              <p className="mt-1">Se requiere DNI</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-red-900/30 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Republik Night Club - Villa Dolores, Córdoba</p>
        </div>
      </div>
    </footer>
  );
}