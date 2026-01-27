import { MapPin, Navigation } from 'lucide-react';

export default function Location() {
  return (
    <section id="location" className="relative bg-gradient-to-b from-black via-red-950/30 to-black-950/30 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-6xl font-bold text-white">
              Dónde <span className="text-red-600">estamos</span>
            </h2>

            <div className="flex items-start gap-4 text-gray-300">
              <MapPin className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-xl font-semibold text-white mb-2">Villa Dolores</p>
                <p className="text-lg">Córdoba, Argentina</p>
              </div>
            </div>

            <p className="text-lg text-gray-400 leading-relaxed">
              En el corazón de las sierras cordobesas, Republik se convierte en el epicentro
              de las mejores noches. Un lugar único donde la fiesta y la música se encuentran.
            </p>

            <button className="flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105">
              <Navigation className="w-5 h-5" />
              Cómo llegar
            </button>
          </div>

          <div className="relative h-[400px] rounded-2xl overflow-hidden border border-red-800/30">
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-black/10 z-10" />
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13313.907553900615!2d-65.162160410397!3d-31.95168268736582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x942cd54f5e2bd901%3A0xf3f83e803fb1e645!2sRepublik!5e0!3m2!1ses!2sar!4v1769476097620!5m2!1ses!2sar"
              width="100%"
              height="100%"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="contrast-100 brightness-95"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
