import { Leaf, Music, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <section className="relative bg-black py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-700 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              La noche nace en<br />
              <span className="text-red-500">Mina Clavero</span>
            </h2>

            <p className="text-xl text-gray-300 leading-relaxed">
              Natura es más que una discoteca. Es una experiencia única donde la energía de la naturaleza
              se fusiona con la vibra de las mejores noches.
            </p>

            <p className="text-lg text-gray-400 leading-relaxed">
              DJs de primer nivel, fiestas temáticas inolvidables y un ambiente que no encontrarás
              en ningún otro lugar de Córdoba. Las noches de verano cobran vida en Natura.
            </p>

            <div className="pt-6 grid grid-cols-3 gap-6">
              <div className="text-center">
                <Music className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400">DJs</p>
              </div>
              <div className="text-center">
                <Leaf className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Naturaleza</p>
              </div>
              <div className="text-center">
                <Sparkles className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Experiencia</p>
              </div>
            </div>
          </div>

          <div className="relative h-[500px] rounded-2xl overflow-hidden group">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload='none'
              className="w-full h-full object-cover"
            >
              <source src="/About/djInit.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-red-950/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
