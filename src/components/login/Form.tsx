import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/services/api";

export default function FormLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login/", { username, password });
      setAuth(data.user, data.access);
      navigate("/feed");
    } catch {
      setError("Usuário ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl p-8">
      <h1 className="text-4xl font-bold text-white text-center mb-8 pb-4 border-b-2 border-white/5">
        Toyo-<span className="text-purple-500">X</span>
      </h1>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {/* Erro */}
        {error && (
          <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
            {error}
          </p>
        )}

        {/* Username */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="username"
            className="ml-1 text-white text-sm font-medium"
          >
            Usuário
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 transition"
          />
          <div className="flex gap-2 ml-1">
            <input
              id="check"
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            <label htmlFor="check" className="text-white text-sm">
              Ver senha
            </label>
          </div>
        </div>

        {/* Botão */}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-full bg-linear-to-r from-purple-600 to-fuchsia-500 py-2 text-white font-bold text-lg shadow-lg shadow-purple-500/40 hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

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
