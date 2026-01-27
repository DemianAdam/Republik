import { useAuthActions } from "@convex-dev/auth/react";
import { User, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function SignIn() {
  const { signIn } = useAuthActions();
  const [isError, setIsError] = useState("");

  const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await signIn("password", formData);
    } catch {
      setIsError("Error al iniciar sesion.");
    }
  }

  return (
    // 1. Full Page Container
    <div className="w-full flex items-center justify-center p-4 min-h-[calc(100vh-100px)]">

      {/* 2. The Card Container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl border border-white/10">

        {/* 3. Background Image & Overlays */}
        <div className="absolute inset-0">
          <img
            src="/istockphoto-1466057420-2048x2048.png"
            alt="Background"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black" />
        </div>

        {/* 4. Content */}
        <div className="relative z-10 p-8 sm:p-10">

          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              ¡Bienvenido!

            </h2>
            <p className="text-gray-400 text-sm">
              Ingresa tus credenciales para acceder.
            </p>
          </div>

          <form
            className="space-y-5"
            onSubmit={handleSumbit}
          >

            {/* Email Input */}
            <div className="relative group">
              {/* Icon Wrapper: Added z-10 to ensure it sits on top */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <User className="h-5 w-5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
              </div>
              <input
                name="email"
                placeholder="Email"
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent backdrop-blur-sm transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              {/* Icon Wrapper: Added z-10 to ensure it sits on top */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
              </div>
              <input
                name="password"
                placeholder="Contraseña"
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent backdrop-blur-sm transition-all"
              />

            </div>

            {/* Hardcoded flow to 'signIn' since registration is manual */}
            <input name="flow" type="hidden" value="signIn" />
            {
              isError !== "" &&
              <div className="text-red-600 italic">{isError}</div>
            }
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full group relative flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-all duration-300 shadow-lg shadow-red-900/20"
            >
              Ingresar
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}