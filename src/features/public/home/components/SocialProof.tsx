export default function SocialProof() {
  return (
    <section className="relative bg-black py-24 px-6 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/social-proof.webp')] bg-cover bg-center opacity-40" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center space-y-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="text-6xl font-bold text-red-600">100%</div>
            <p className="text-xl text-white">Noches únicas</p>
            <p className="text-gray-400">Cada evento es una experiencia</p>
          </div>

          <div className="space-y-2">
            <div className="text-6xl font-bold text-red-600">+5K</div>
            <p className="text-xl text-white">Experiencia Republik</p>
            <p className="text-gray-400">Personas vivieron la magia</p>
          </div>

          <div className="space-y-2">
            <div className="text-6xl font-bold text-red-600">#1</div>
            <p className="text-xl text-white">La previa termina acá</p>
            <p className="text-gray-400">El mejor club de Villa Dolores</p>
          </div>
        </div>

        <div className="pt-12">
          <p className="text-3xl md:text-5xl font-light text-white italic">
            "Donde las noches cobran <span className="text-red-600 font-semibold">vida</span>"
          </p>
        </div>
      </div>
    </section>
  );
}
