import SideHome from "@/components/SideHome";
import { Grid2X2, Pencil } from "lucide-react";

// Mock de posts do perfil — depois vem da API
const mockPosts = [
  { id: 1, image: "https://picsum.photos/seed/cyber1/400/400" },
  { id: 2, image: "https://picsum.photos/seed/cyber2/400/400" },
  { id: 3, image: "https://picsum.photos/seed/cyber3/400/400" },
  { id: 4, image: "https://picsum.photos/seed/cyber4/400/400" },
  { id: 5, image: "https://picsum.photos/seed/cyber5/400/400" },
  { id: 6, image: "https://picsum.photos/seed/cyber6/400/400" },
  { id: 7, image: "https://picsum.photos/seed/cyber7/400/400" },
  { id: 8, image: "https://picsum.photos/seed/cyber8/400/400" },
  { id: 9, image: "https://picsum.photos/seed/cyber9/400/400" },
  { id: 10, image: "https://picsum.photos/seed/cyber10/400/400" },
  { id: 11, image: "https://picsum.photos/seed/cyber11/400/400" },
  { id: 12, image: "https://picsum.photos/seed/cyber12/400/400" },
];

export default function Perfil() {
  return (
    <div className="min-h-screen bg-[#0d0d1a] flex">
      {/* Sidebar fixa */}
      <SideHome />

      {/* Conteúdo principal */}
      <div className="ml-56 flex-1 flex flex-col">
        {/* ── BANNER + INFO DO PERFIL ── */}
        <div className="relative">
          {/* Banner */}
          <div className="w-full h-52 bg-linear-to-br from-purple-900 via-purple-700 to-fuchsia-900" />

          {/* Linha separadora */}
          <div className="w-full h-px bg-white/10" />

          {/* Área de info — avatar sobrepõe o banner */}
          <div className="px-10 pb-6 bg-[#0d0d1a]">
            {/* Avatar + ações */}
            <div className="flex items-end justify-between">
              {/* Avatar sobreposto ao banner */}
              <div className="-mt-16 shrink-0">
                <img
                  src="https://i.pravatar.cc/150?img=12"
                  alt="avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#0d0d1a] shadow-xl"
                />
              </div>

              {/* Botão editar */}
              <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-linear-to-r from-purple-600 to-fuchsia-500 text-white text-sm font-semibold shadow-lg shadow-purple-500/30 hover:opacity-90 transition mt-2">
                <Pencil size={15} />
                Editar perfil
              </button>
            </div>

            {/* Username + Bio + Stats */}
            <div className="mt-4 flex flex-col gap-2">
              <h1 className="text-white text-2xl font-bold">Username</h1>
              <p className="text-gray-400 text-sm">
                Cyber enthusiast. Tech lover. Exploring the future.
              </p>

              {/* Stats */}
              <div className="flex items-center gap-6 mt-2">
                <div className="flex items-center gap-1">
                  <span className="text-white font-bold text-sm">2.3K</span>
                  <span className="text-gray-500 text-sm">Seguidores</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-white font-bold text-sm">485</span>
                  <span className="text-gray-500 text-sm">Posts</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── ABAS ── */}
        <div className="flex items-center gap-1 px-10 border-b border-white/10">
          <button className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-purple-400 border-b-2 border-purple-500 transition">
            <Grid2X2 size={16} />
            Posts
          </button>
        </div>

        {/* ── GRID DE POSTS ── */}
        <div className="grid grid-cols-5 gap-1 p-1">
          {mockPosts.map((post) => (
            <div
              key={post.id}
              className="aspect-square overflow-hidden cursor-pointer group relative"
            >
              <img
                src={post.image}
                alt={`post-${post.id}`}
                className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-75 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
