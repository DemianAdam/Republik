import { useNavigate } from "react-router-dom";
import { asset } from "../../../../utils/assets";

interface HeroProps {
  onCTAClick: (section: string) => void;
}

export default function Hero({ onCTAClick }: HeroProps) {

const navigate = useNavigate(); // 2. Initialize hook

  return (
    <section className="relative h-svh w-full bg-black pt-32  ">
      <img
        src={asset("istockphoto-1466057420-2048x2048.png")}
        aria-hidden="true"
        role="presentation"
        loading="eager"
        fetchpriority="high"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-red-950/60 via-black/40 to-black/90" />

      <div className="relative h-full z-10 flex flex-col items-center px-6 text-center">
        <div className="animate-fade-in-up mb-8">
          <img
            src={asset("logoRepublikTransparente.webp")}
            alt="Republik"
            className="h-39 w-48 md:h-55 md:w-72 object-contain mx-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            fetchpriority='low'
            loading='lazy'
          />
        </div>

        <h1 className="animate-fade-in-up animation-delay-200 mb-6 text-5xl md:text-7xl lg:text-7xl font-bold tracking-tight text-white">
          Donde la noche<br />cobra vida
        </h1>

        <p className="opacity-0 animate-fade-in-up animation-delay-400 mb-12 max-w-2xl text-xl md:text-2xl text-gray-200 font-light tracking-wide">
          Música, fiesta y noches inolvidables
        </p>

        <div className="animate-fade-in-up animation-delay-600 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('check-in')} // 3. Use navigate on button click
            className="group relative px-10 py-4 bg-red-600 hover:bg-red-600 text-white text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-600/50"
          >
            Anotate
            <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          </button>

          <button
            onClick={() => onCTAClick('events')}
            className="px-10 py-4 border-2 border-white/30 hover:border-white text-white text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            Eventos
          </button>
        </div>
<div className="animate-bounce mt-auto sm:mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-10 h-10 text-white/60"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>
      </div>
      



    </section>
  );
}
