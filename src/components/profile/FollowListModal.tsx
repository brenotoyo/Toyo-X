import { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "@/services/api";

interface FollowUser {
  id: number;
  username: string;
  avatar: string | null;
  followers_count: number;
}

interface FollowListModalProps {
  type: "followers" | "following";
  onClose: () => void;
}

export default function FollowListModal({
  type,
  onClose,
}: FollowListModalProps) {
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(true);

  const title = type === "followers" ? "Seguidores" : "Seguindo";
  const endpoint =
    type === "followers" ? "/auth/me/followers/" : "/auth/me/following/";

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data } = await api.get(endpoint);
        if (!cancelled) setUsers(data);
      } catch (err) {
        console.error("Erro ao carregar lista:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm bg-[#0f0f1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-white font-bold text-base">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Lista */}
        <div className="flex flex-col max-h-96 overflow-y-auto">
          {loading ? (
            <p className="text-gray-500 text-sm text-center py-8">
              Carregando...
            </p>
          ) : users.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">
              {type === "followers"
                ? "Nenhum seguidor ainda."
                : "Não está seguindo ninguém."}
            </p>
          ) : (
            users.map((u) => (
              <div
                key={u.id}
                className="flex items-center gap-3 px-6 py-4 hover:bg-white/5 transition"
              >
                <img
                  src={u.avatar || "https://i.pravatar.cc/150?img=12"}
                  alt={u.username}
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/40 shrink-0"
                />
                <div className="flex flex-col">
                  <span className="text-white text-sm font-semibold">
                    {u.username}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {u.followers_count} seguidores
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
