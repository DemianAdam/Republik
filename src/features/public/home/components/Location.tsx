import { MapPin, Navigation } from 'lucide-react';

export default function Location() {
  return (
    <section id="location" className="relative bg-gradient-to-b from-black via-green-950/30 to-black-950/30 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-6xl font-bold text-white">
              Dónde <span className="text-green-500">estamos</span>
            </h2>

            <div className="flex items-start gap-4 text-gray-300">
              <MapPin className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <p className="text-xl font-semibold text-white mb-2">Mina Clavero</p>
                <p className="text-lg">Córdoba, Argentina</p>
              </div>
            </div>

            <p className="text-lg text-gray-400 leading-relaxed">
              En el corazón de las sierras cordobesas, Natura se convierte en el epicentro
              de las mejores noches. Un lugar único donde la naturaleza y la música se encuentran.
            </p>

            <button className="flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105">
              <Navigation className="w-5 h-5" />
              Cómo llegar
            </button>
          </div>

          <div className="relative h-[400px] rounded-2xl overflow-hidden border border-green-800/30">
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-black/40 z-10" />
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3393.7146352565733!2d-65.00402079999998!3d-31.7236893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x942d2679cc7953e7%3A0xc2092e284b4119f9!2sNatura%20Disco!5e0!3m2!1ses!2sar!4v1767744528983!5m2!1ses!2sar"
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
