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
import { useState } from "react";

const initialNotifications = [
  {
    id: 1,
    avatar: "https://i.pravatar.cc/150?img=1",
    text: "AlexKnight curtiu seu post.",
    time: "2min",
  },
  {
    id: 2,
    avatar: "https://i.pravatar.cc/150?img=5",
    text: "LunaStar começou a te seguir.",
    time: "10min",
  },
  {
    id: 3,
    avatar: "https://i.pravatar.cc/150?img=9",
    text: "NeoGamer comentou no seu post.",
    time: "30min",
  },
  {
    id: 4,
    avatar: "https://i.pravatar.cc/150?img=3",
    text: "CyberJade curtiu seu comentário.",
    time: "1h",
  },
  {
    id: 5,
    avatar: "https://i.pravatar.cc/150?img=7",
    text: "SynthWave mencionou você em um post.",
    time: "3h",
  },
];

// Mock de usuários — depois vem da API Django
const mockUsers = [
  {
    id: 1,
    avatar: "https://i.pravatar.cc/150?img=1",
    username: "AlexKnight",
    name: "Alex Knight",
  },
  {
    id: 2,
    avatar: "https://i.pravatar.cc/150?img=5",
    username: "LunaStar",
    name: "Luna Star",
  },
  {
    id: 3,
    avatar: "https://i.pravatar.cc/150?img=9",
    username: "NeoGamer",
    name: "Neo Gamer",
  },
  {
    id: 4,
    avatar: "https://i.pravatar.cc/150?img=3",
    username: "CyberJade",
    name: "Cyber Jade",
  },
  {
    id: 5,
    avatar: "https://i.pravatar.cc/150?img=7",
    username: "SynthWave",
    name: "Synth Wave",
  },
  {
    id: 6,
    avatar: "https://i.pravatar.cc/150?img=11",
    username: "DarkNova",
    name: "Dark Nova",
  },
];

const navItems = [
  { label: "Home", icon: Home, to: "/feed" },
  { label: "Perfil", icon: User, to: "/perfil" },
];

type Panel = "main" | "notifications" | "search";

export default function SideHome() {
  const [panel, setPanel] = useState<Panel>("main");
  const [notifications, setNotifications] = useState(initialNotifications);
  const [query, setQuery] = useState("");

  // Filtra usuários pelo que foi digitado
  const results = query.trim()
    ? mockUsers.filter(
        (u) =>
          u.username.toLowerCase().includes(query.toLowerCase()) ||
          u.name.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  function clearNotifications() {
    setNotifications([]);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  function closePanel() {
    setPanel("main");
    setQuery("");
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-56 bg-[#0f0f1a] flex flex-col px-4 py-6 z-50 border-r border-r-gray-50/15">
      {/* ── PAINEL PRINCIPAL ── */}
      {panel === "main" && (
        <>
          {/* Logo */}
          <div className="mb-10 px-2">
            <span className="text-white text-2xl font-bold tracking-wide">
              Toyo-<span className="text-purple-500">X</span>
            </span>
          </div>

          {/* Navegação */}
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

            {/* Pesquisar */}
            <button
              onClick={() => setPanel("search")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-gray-400 hover:bg-white/5 hover:text-white text-left"
            >
              <Search size={20} />
              Pesquisar
            </button>

            {/* Notificações com badge */}
            <button
              onClick={() => setPanel("notifications")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-gray-400 hover:bg-white/5 hover:text-white text-left"
            >
              <div className="relative">
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                    {notifications.length}
                  </span>
                )}
              </div>
              Notificações
            </button>
          </nav>

          {/* Logout no rodapé */}
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
          {/* Cabeçalho */}
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

          {/* Input de busca */}
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

          {/* Resultados */}
          <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1">
            {query.trim() === "" ? (
              <div className="flex flex-col items-center justify-center flex-1 gap-2 text-center">
                <Search size={32} className="text-gray-700" />
                <p className="text-gray-600 text-xs">Digite para buscar</p>
              </div>
            ) : results.length > 0 ? (
              results.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition cursor-pointer"
                >
                  <img
                    src={u.avatar}
                    alt={u.username}
                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-purple-500/40"
                  />
                  <div className="flex flex-col">
                    <span className="text-white text-xs font-semibold">
                      {u.username}
                    </span>
                    <span className="text-gray-500 text-[11px]">{u.name}</span>
                  </div>
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

          {/* Voltar */}
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
          {/* Cabeçalho */}
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

          {/* Lista */}
          <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition cursor-pointer"
                >
                  <img
                    src={n.avatar}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-purple-500/40"
                  />
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-300 text-xs leading-snug">
                      {n.text}
                    </p>
                    <span className="text-gray-600 text-[11px]">
                      {n.time} atrás
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

          {/* Voltar */}
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
