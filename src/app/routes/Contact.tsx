import { api } from 'convex/_generated/api';
import { useMutation } from 'convex/react';
import { ChevronLeft } from 'lucide-react';
import { lazy } from 'react';
import { Link } from 'react-router-dom';
const Mail = lazy(() => import('lucide-react').then(m => ({ default: m.Mail })));
const Phone = lazy(() => import('lucide-react').then(m => ({ default: m.Phone })));
const MapPin = lazy(() => import('lucide-react').then(m => ({ default: m.MapPin })));

export default function Contact() {
  const sendEmail = useMutation(api.contact.mutations.sendTestEmail);

  const handleSumbit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    sendEmail({
      name: name,
      lastName: lastName,
      email: email,
      message: message
    });
  }
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black flex flex-col justify-center">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: 'url("/leaves-background.webp")',
          backgroundAttachment: 'fixed'
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-950/60 via-black/40 to-black/90" />

      <div className="relative z-10 w-full pt-20 px-6 pb-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left Column: Info & Title */}
          <div>
            {/* NEW: Back Button */}
            <Link
              to="/"
              className="inline-flex items-center text-gray-400 hover:text-green-500 transition-colors mb-8 group"
            >
              <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Volver al inicio</span>
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Contacto <span className="text-green-500">Natura</span>
            </h1>
            <p className="text-gray-200 text-lg mb-8 font-light leading-relaxed">
              Reserva tu mesa VIP, consulta por eventos privados o simplemente déjanos tu mensaje. La noche te espera.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-gray-200 group">
                <div className="p-3 bg-green-900/40 border border-green-500/20 rounded-full text-green-400 backdrop-blur-md group-hover:bg-green-500 group-hover:text-black transition-all duration-300">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="font-medium group-hover:text-green-400 transition-colors">+54 9 3544 12-3456</span>
              </div>
              <div className="flex items-center gap-4 text-gray-200 group">
                <div className="p-3 bg-green-900/40 border border-green-500/20 rounded-full text-green-400 backdrop-blur-md group-hover:bg-green-500 group-hover:text-black transition-all duration-300">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="font-medium group-hover:text-green-400 transition-colors">reservas@natura.com</span>
              </div>
              <div className="flex items-center gap-4 text-gray-200 group">
                <div className="p-3 bg-green-900/40 border border-green-500/20 rounded-full text-green-400 backdrop-blur-md group-hover:bg-green-500 group-hover:text-black transition-all duration-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="font-medium group-hover:text-green-400 transition-colors">Av. Costanera 1234, Mina Clavero</span>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <form onSubmit={handleSumbit} className="bg-black/40 p-8 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-green-500 uppercase tracking-wider ml-1">Nombre</label>
                <input name='name' type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-green-500 focus:bg-white/10 outline-none transition-all placeholder:text-gray-500/50" placeholder="Tu nombre" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-green-500 uppercase tracking-wider ml-1">Apellido</label>
                <input name='lastName' type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-green-500 focus:bg-white/10 outline-none transition-all placeholder:text-gray-500/50" placeholder="Tu apellido" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-green-500 uppercase tracking-wider ml-1">Email</label>
              <input name='email' type="email" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-green-500 focus:bg-white/10 outline-none transition-all placeholder:text-gray-500/50" placeholder="ejemplo@email.com" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-green-500 uppercase tracking-wider ml-1">Mensaje</label>
              <textarea name='message' rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-green-500 focus:bg-white/10 outline-none transition-all placeholder:text-gray-500/50 resize-none" placeholder="¿En qué podemos ayudarte?"></textarea>
            </div>

            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-green-500/25 hover:scale-[1.02] active:scale-[0.98]">
              Enviar Mensaje
            </button>

          </form>
        </div>
      </div>
    </section>
  );
}