import { Clock, ArrowRight } from 'lucide-react';

const events = [
  {
    date: '16 ENE',
    day: 'Viernes',
    title: 'Modo Diablo',
    dj: 'DJ Jere Velasco',
    time: '00:00 HS',
    image: '/Events/evento-1.webp',
    video: '/Events/evento-1.mp4',
    offset: 'object-[50%_30%]'
  },
  {
    date: '25 DIC',
    day: 'Jueves',
    title: 'Navidad',
    dj: 'Celebra Navidad en Natura',
    time: '00:00 HS',
    image: '/Events/evento-2.webp',
    video: '/Events/evento-2.mp4',
    offset: 'object-[50%_58%]'
  },
  {
    date: '06 ENE',
    day: 'Domingos',
    title: 'Old School Reggaeton',
    dj: '2x1 EN TRAGOS',
    time: '00:00 HS',
    image: '/Events/evento-3.webp',
    video: '/Events/evento-3.mp4',
    offset: 'object-[50%_30%]'
  },
];

export default function Events() {
  return (
    <section id="events" className="relative bg-gradient-to-b from-black via-red-950/20 to-black py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Grilla <span className="text-red-500">Enero</span> 2026
          </h2>
          <p className="text-xl text-gray-400">¡Las mejores noches te esperan!</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-b from-red-900/20 to-black border border-red-800/30 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all duration-500 hover:scale-105"
            >
              <div className="relative h-64 overflow-hidden">

                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload='none'
                  className={`w-full h-full object-cover ${event.offset}`}
                >
                  <source src={event.video} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                <div className="absolute top-4 right-4 bg-red-500 text-black px-4 py-2 rounded-full font-bold text-sm">
                  {event.date}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-red-500 text-sm font-semibold mb-1">{event.day}</p>
                  <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                  <p className="text-gray-400">{event.dj}</p>
                </div>

                <div className="flex items-center text-gray-400 text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  {event.time}
                </div>

                <button className="w-full mt-4 bg-red-600 hover:bg-red-600 text-white py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center group-hover:gap-2">
                  Mas info
                  <ArrowRight className="w-0 group-hover:w-5 transition-all duration-300 opacity-0 group-hover:opacity-100" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
