import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/services/api";

export default function FormRegister() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.password2) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/register/", form);
      setAuth(data.user, data.access);
      navigate("/feed");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data;
        setError(
          typeof msg === "object"
            ? JSON.stringify(msg)
            : (msg ?? "Erro ao criar conta."),
        );
      } else {
        setError("Erro ao criar conta.");
      }
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
        {error && (
          <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
            {error}
          </p>
        )}

        {/* Nome */}
        <div className="flex flex-col gap-2">
          <label className="ml-1 text-white text-sm font-medium">Nome</label>
          <input
            name="first_name"
            type="text"
            onChange={handleChange}
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-white outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 transition"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="ml-1 text-white text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            onChange={handleChange}
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-white outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 transition"
          />
        </div>

        {/* Username */}
        <div className="flex flex-col gap-2">
          <label className="ml-1 text-white text-sm font-medium">
            Nome de Usuário
          </label>
          <input
            name="username"
            type="text"
            onChange={handleChange}
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-white outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 transition"
          />
        </div>

        {/* Senha */}
        <div className="flex flex-col gap-2">
          <label className="ml-1 text-white text-sm font-medium">Senha</label>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            onChange={handleChange}
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-white outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 transition"
          />
        </div>

        {/* Confirmar senha */}
        <div className="flex flex-col gap-2">
          <label className="ml-1 text-white text-sm font-medium">
            Confirmar Senha
          </label>
          <input
            name="password2"
            type={showPassword ? "text" : "password"}
            onChange={handleChange}
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-white outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 transition"
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

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-full bg-linear-to-r from-purple-600 to-fuchsia-500 py-2 text-white font-bold text-lg shadow-lg shadow-purple-500/40 hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Criando conta..." : "Criar conta"}
        </button>

        <a
          href="/"
          className="text-center text-purple-300 text-sm font-medium hover:underline mt-1"
        >
          Já tenho conta
        </a>
      </form>
    </div>
  );
}
