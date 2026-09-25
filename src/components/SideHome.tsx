import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  Bell,
  User,
  LogOut,
  ArrowLeft,
  X,
  Trash2,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "@/services/api";

interface SearchUser {
  id: number;
  username: string;
  avatar: string | null;
  followers_count: number;
  is_following: boolean;
}

interface NotificationSender {
  id: number;
  username: string;
  avatar: string | null;
}

interface Notification {
  id: number;
  sender: NotificationSender;
  type: "like" | "comment" | "follow";
  post: number | null;
  is_read: boolean;
  created_at: string;
}

const navItems = [
  { label: "Home", icon: Home, to: "/feed" },
  { label: "Perfil", icon: User, to: "/perfil" },
];

type Panel = "main" | "notifications" | "search";

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

function notificationText(type: Notification["type"]): string {
  if (type === "like") return "curtiu seu post.";
  if (type === "comment") return "comentou no seu post.";
  return "começou a te seguir.";
}

export default function SideHome() {
  const [panel, setPanel] = useState<Panel>("main");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [followingIds, setFollowingIds] = useState<Set<number>>(new Set());

  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Busca notificações ao abrir o painel
  useEffect(() => {
    if (panel !== "notifications") return;

    let cancelled = false;

    async function loadNotifications() {
      if (!cancelled) setLoadingNotifications(true);
      try {
        const { data } = await api.get("/notifications/");
        if (!cancelled) setNotifications(data);
      } catch (err) {
        console.error("Erro ao buscar notificações:", err);
      } finally {
        if (!cancelled) setLoadingNotifications(false);
      }
    }

    loadNotifications();
    return () => {
      cancelled = true;
    };
  }, [panel]);

  // Marca como lidas ao abrir o painel
  useEffect(() => {
    if (panel !== "notifications") return;
    if (unreadCount === 0) return;

    async function markRead() {
      try {
        await api.post("/notifications/read/");
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      } catch (err) {
        console.error("Erro ao marcar notificações:", err);
      }
    }

    // Aguarda 1s antes de marcar como lidas
    const timer = setTimeout(markRead, 1000);
    return () => clearTimeout(timer);
  }, [panel, unreadCount]);

  // Busca notificações não lidas ao montar (para o badge)
  useEffect(() => {
    let cancelled = false;

    async function loadUnread() {
      try {
        const { data } = await api.get("/notifications/");
        if (!cancelled) setNotifications(data);
      } catch (err) {
        console.error("Erro ao buscar notificações:", err);
      }
    }

    loadUnread();
    return () => {
      cancelled = true;
    };
  }, []);

  // Busca usuários na API quando query muda
  useEffect(() => {
    let cancelled = false;

    async function search() {
      if (!query.trim()) {
        if (!cancelled) {
          setResults([]);
          setSearching(false);
        }
        return;
      }

      if (!cancelled) setSearching(true);

      try {
        const { data } = await api.get(
          `/auth/search/?q=${encodeURIComponent(query)}`,
        );
        if (!cancelled) {
          setResults(data);
          const ids = new Set<number>(
            data
              .filter((u: SearchUser) => u.is_following)
              .map((u: SearchUser) => u.id),
          );
          setFollowingIds(ids);
        }
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }

    search();
    return () => {
      cancelled = true;
    };
  }, [query]);

  async function handleFollow(userId: number) {
    try {
      const { data } = await api.post(`/auth/${userId}/follow/`);
      setFollowingIds((prev) => {
        const next = new Set(prev);
        if (data.following) next.add(userId);
        else next.delete(userId);
        return next;
      });
      setResults((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                followers_count: data.followers_count,
                is_following: data.following,
              }
            : u,
        ),
      );
    } catch (err) {
      console.error("Erro ao seguir:", err);
    }
  }

  function clearNotifications() {
    setNotifications([]);
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  function closePanel() {
    setPanel("main");
    setQuery("");
    setResults([]);
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-56 bg-[#0f0f1a] flex flex-col px-4 py-6 z-50 border-r border-r-gray-50/15">
      {/* ── PAINEL PRINCIPAL ── */}
      {panel === "main" && (
        <>
          <div className="mb-10 px-2">
            <span className="text-white text-2xl font-bold tracking-wide">
              Toyo-<span className="text-purple-500">X</span>
            </span>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map(({ label, icon: Icon, to }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${
                    isActive
                      ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon size={20} />
                {label}
              </NavLink>
            ))}

            <button
              onClick={() => setPanel("search")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-gray-400 hover:bg-white/5 hover:text-white text-left"
            >
              <Search size={20} />
              Pesquisar
            </button>

            <button
              onClick={() => setPanel("notifications")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-gray-400 hover:bg-white/5 hover:text-white text-left"
            >
              <div className="relative">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              Notificações
            </button>
          </nav>

          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-gray-400 hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut size={20} />
              Sair
            </button>
          </div>
        </>
      )}

      {/* ── PAINEL DE PESQUISA ── */}
      {panel === "search" && (
        <>
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-white font-semibold text-base">
              Pesquisar
            </span>
            <button
              onClick={closePanel}
              className="text-gray-500 hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>

          <div className="relative mb-4">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              autoFocus
              type="text"
              placeholder="Buscar usuários..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500/50 transition"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1">
            {query.trim() === "" ? (
              <div className="flex flex-col items-center justify-center flex-1 gap-2 text-center">
                <Search size={32} className="text-gray-700" />
                <p className="text-gray-600 text-xs">Digite para buscar</p>
              </div>
            ) : searching ? (
              <p className="text-gray-600 text-xs text-center mt-4">
                Buscando...
              </p>
            ) : results.length > 0 ? (
              results.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition"
                >
                  <img
                    src={u.avatar || "https://i.pravatar.cc/150?img=12"}
                    alt={u.username}
                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-purple-500/40"
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-white text-xs font-semibold truncate">
                      {u.username}
                    </span>
                    <span className="text-gray-500 text-[11px]">
                      {u.followers_count} seguidores
                    </span>
                  </div>
                  <button
                    onClick={() => handleFollow(u.id)}
                    className={`shrink-0 text-[11px] font-semibold px-2 py-1 rounded-full transition
                      ${
                        followingIds.has(u.id)
                          ? "bg-white/10 text-gray-400 hover:bg-red-500/20 hover:text-red-400"
                          : "bg-purple-600/80 text-white hover:bg-purple-500"
                      }`}
                  >
                    {followingIds.has(u.id) ? "Seguindo" : "Seguir"}
                  </button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 gap-2 text-center">
                <p className="text-gray-600 text-xs">
                  Nenhum usuário encontrado
                </p>
              </div>
            )}
          </div>

          <button
            onClick={closePanel}
            className="mt-auto flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
        </>
      )}

      {/* ── PAINEL DE NOTIFICAÇÕES ── */}
      {panel === "notifications" && (
        <>
          <div className="flex items-center justify-between mb-6 px-2">
            <span className="text-white font-semibold text-base">
              Notificações
            </span>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  title="Limpar notificações"
                  className="text-gray-500 hover:text-red-400 transition"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <button
                onClick={closePanel}
                className="text-gray-500 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1">
            {loadingNotifications ? (
              <p className="text-gray-600 text-xs text-center mt-4">
                Carregando...
              </p>
            ) : notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 p-3 rounded-xl transition cursor-pointer
                    ${n.is_read ? "hover:bg-white/5" : "bg-purple-500/10 hover:bg-purple-500/15"}`}
                >
                  <img
                    src={n.sender.avatar || "https://i.pravatar.cc/150?img=12"}
                    alt={n.sender.username}
                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-purple-500/40"
                  />
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-300 text-xs leading-snug">
                      <span className="text-white font-semibold">
                        {n.sender.username}
                      </span>{" "}
                      {notificationText(n.type)}
                    </p>
                    <span className="text-gray-600 text-[11px]">
                      {timeAgo(n.created_at)} atrás
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 gap-2 text-center">
                <Bell size={32} className="text-gray-700" />
                <p className="text-gray-600 text-xs">Nenhuma notificação</p>
              </div>
            )}
          </div>

          <button
            onClick={closePanel}
            className="mt-auto flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
        </>
      )}
    </aside>
  );
}
