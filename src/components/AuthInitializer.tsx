import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/services/api";

interface Props {
  children: React.ReactNode;
}

export default function AuthInitializer({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const token = localStorage.getItem("token");

      if (!token) {
        if (!cancelled) setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me/");
        if (!cancelled) {
          setAuth(data, token);
        }
      } catch {
        // Token inválido ou expirado — limpa o armazenamento
        localStorage.removeItem("token");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [setAuth]); // ← setAuth é estável no Zustand, sem risco de loop

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center">
        <span className="text-purple-400 text-sm animate-pulse">
          Carregando...
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
