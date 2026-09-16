import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function FormLogin() {
  const [showPassord, setShowPassord] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Futuramente: chamar API Django
    // const { user, token } = await api.post("/auth/login", { email, password });

    // Mock temporário para testar o fluxo
    setAuth(
      {
        id: 1,
        username: "Username",
        name: "User Name",
        bio: "Cyber enthusiast.",
        avatar: "https://i.pravatar.cc/150?img=12",
        banner: "",
      },
      "mock-token-123",
    );

    navigate("/feed");
  }

  // ...resto do formulário com onSubmit={handleSubmit}

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl p-8">
      {/* Título */}
      <h1 className="text-4xl font-bold text-white text-center mb-8 pb-4 border-b-2 border-white/5">
        Toyo-<span className="text-purple-500">X</span>
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Email */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="ml-1 text-white text-sm font-medium"
          >
            User | email
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 transition"
          />
        </div>

        {/* Senha */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="senha"
            className="ml-1 text-white text-sm font-medium"
          >
            Senha
          </label>
          <input
            id="senha"
            type={showPassord ? "text" : "password"}
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 transition"
          />
          <div className="flex gap-2 ml-1 ">
            <input
              id="check"
              type="checkbox"
              checked={showPassord}
              onChange={(e) => setShowPassord(e.target.checked)}
            />
            <label htmlFor="check" className="text-white text-sm">
              Ver senha
            </label>
          </div>
        </div>

        {/* Botão Criar Conta */}
        <button
          type="submit"
          className="mt-4 w-full rounded-full bg-linear-to-r from-purple-600 to-fuchsia-500 py-2 text-white font-bold text-lg shadow-lg shadow-purple-500/40 hover:opacity-90 transition"
        >
          Entrar
        </button>

        {/* Link já tenho conta */}
        <a
          href="/register"
          className="text-center text-purple-300 text-sm font-medium hover:underline mt-1"
        >
          Criar conta
        </a>
      </form>
    </div>
  );
}
