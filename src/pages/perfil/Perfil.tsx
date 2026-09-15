import SideHome from "@/components/SideHome";
import EditProfileModal from "@/components/profile/EditProfileModal";
import PostModal from "@/components/profile/PostModal";
import { Grid2X2, Pencil } from "lucide-react";
import { useState } from "react";

const mockPosts = [
  {
    id: 1,
    image: "https://picsum.photos/seed/cyber1/400/400",
    text: "A cidade nunca dorme. Luzes neon refletem no asfalto molhado.",
    likes: 1200,
    comments: 83,
    shares: 40,
  },
  {
    id: 2,
    image: "https://picsum.photos/seed/cyber2/400/400",
    text: "Identidade oculta, presença inegável.",
    likes: 980,
    comments: 61,
    shares: 25,
  },
  {
    id: 3,
    image: "https://picsum.photos/seed/cyber3/400/400",
    text: "Velocidade é liberdade.",
    likes: 760,
    comments: 44,
    shares: 18,
  },
  {
    id: 4,
    image: "https://picsum.photos/seed/cyber4/400/400",
    text: "O futuro pertence a quem o constrói.",
    likes: 1540,
    comments: 102,
    shares: 67,
  },
  {
    id: 5,
    image: "https://picsum.photos/seed/cyber5/400/400",
    text: "Além do horizonte, o desconhecido aguarda.",
    likes: 890,
    comments: 57,
    shares: 31,
  },
  {
    id: 6,
    image: "https://picsum.photos/seed/cyber6/400/400",
    text: "Realidade aumentada. Experiência ampliada.",
    likes: 430,
    comments: 29,
    shares: 12,
  },
  {
    id: 7,
    image: "https://picsum.photos/seed/cyber7/400/400",
    text: "Entre circuitos e sombras, a arte emerge.",
    likes: 670,
    comments: 38,
    shares: 20,
  },
  {
    id: 8,
    image: "https://picsum.photos/seed/cyber8/400/400",
    text: "A escuridão tem sua própria beleza.",
    likes: 1100,
    comments: 74,
    shares: 48,
  },
  {
    id: 9,
    image: "https://picsum.photos/seed/cyber9/400/400",
    text: "Conexões invisíveis movem o mundo.",
    likes: 520,
    comments: 33,
    shares: 15,
  },
  {
    id: 10,
    image: "https://picsum.photos/seed/cyber10/400/400",
    text: "Tecnologia e natureza coexistem.",
    likes: 340,
    comments: 21,
    shares: 9,
  },
  {
    id: 11,
    image: "https://picsum.photos/seed/cyber11/400/400",
    text: "Cada pixel conta uma história.",
    likes: 780,
    comments: 50,
    shares: 27,
  },
  {
    id: 12,
    image: "https://picsum.photos/seed/cyber12/400/400",
    text: "O olho que tudo vê, tudo registra.",
    likes: 960,
    comments: 65,
    shares: 35,
  },
];

interface ProfileData {
  username: string;
  bio: string;
  avatar: string;
  banner: string;
}

interface SelectedPost {
  image: string;
  text: string;
  likes: number;
  comments: number;
  shares: number;
}

export default function Perfil() {
  const [showEdit, setShowEdit] = useState(false);
  const [selectedPost, setSelectedPost] = useState<SelectedPost | null>(null);
  const [profile, setProfile] = useState<ProfileData>({
    username: "Username",
    bio: "Cyber enthusiast. Tech lover. Exploring the future.",
    avatar: "https://i.pravatar.cc/150?img=12",
    banner: "",
  });

  return (
    <div className="min-h-screen bg-[#0d0d1a] flex">
      <SideHome />

      <div className="ml-56 flex-1 flex flex-col">
        {/* ── BANNER + INFO ── */}
        <div className="relative">
          <div className="w-full h-52 bg-linear-to-br from-purple-900 via-purple-700 to-fuchsia-900 overflow-hidden">
            {profile.banner && (
              <img
                src={profile.banner}
                alt="banner"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="w-full h-px bg-white/10" />

          <div className="px-10 pb-6 bg-[#0d0d1a]">
            <div className="flex items-end justify-between">
              <div className="-mt-16 shrink-0">
                <img
                  src={profile.avatar}
                  alt="avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#0d0d1a] shadow-xl"
                />
              </div>
              <button
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-2 px-6 py-2 rounded-full bg-linear-to-r from-purple-600 to-fuchsia-500 text-white text-sm font-semibold shadow-lg shadow-purple-500/30 hover:opacity-90 transition mt-2"
              >
                <Pencil size={15} />
                Editar perfil
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <h1 className="text-white text-2xl font-bold">
                {profile.username}
              </h1>
              <p className="text-gray-400 text-sm">{profile.bio}</p>
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
              onClick={() => setSelectedPost(post)}
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

      {/* ── MODAL DE EDIÇÃO ── */}
      {showEdit && (
        <EditProfileModal
          data={profile}
          onClose={() => setShowEdit(false)}
          onSave={(updated) => setProfile(updated)}
        />
      )}

      {/* ── MODAL DO POST ── */}
      {selectedPost && (
        <PostModal
          image={selectedPost.image}
          text={selectedPost.text}
          username={profile.username}
          avatar={profile.avatar}
          likes={selectedPost.likes}
          comments={selectedPost.comments}
          shares={selectedPost.shares}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}
