import { useEffect, useState } from "react";
import SideHome from "@/components/SideHome";
import EditProfileModal from "@/components/profile/EditProfileModal";
import PostModal from "@/components/profile/PostModal";
import FollowListModal from "@/components/profile/FollowListModal";
import { Grid2X2, Pencil, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/services/api";

interface ProfileData {
  username: string;
  bio: string;
  avatar: string;
  banner: string;
}

interface Post {
  id: number;
  image: string;
  content: string;
  likes_count: number;
  comments_count: number;
}

interface SelectedPost {
  postId: number;
  image: string;
  text: string;
  likes: number;
  comments: number;
  shares: number;
  likedByMe: boolean;
}

type FollowModal = "followers" | "following" | null;

export default function Perfil() {
  const user = useAuthStore((s) => s.user);

  const [profile, setProfile] = useState<ProfileData>({
    username: user?.username ?? "",
    bio: user?.bio ?? "",
    avatar: user?.avatar ?? "",
    banner: user?.banner ?? "",
  });

  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedPost, setSelectedPost] = useState<SelectedPost | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [followModal, setFollowModal] = useState<FollowModal>(null);
  const [followersCount, setFollowersCount] = useState(
    user?.followers_count ?? 0,
  );

  // Busca dados do perfil
  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const { data } = await api.get("/auth/me/");
        if (!cancelled) {
          setProfile({
            username: data.username ?? "",
            bio: data.bio ?? "",
            avatar: data.avatar ?? "",
            banner: data.banner ?? "",
          });
          setFollowersCount(data.followers_count ?? 0);
        }
      } catch (err) {
        console.error("Erro ao buscar perfil:", err);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  // Busca posts do usuário
  useEffect(() => {
    let cancelled = false;

    async function loadPosts() {
      try {
        const { data } = await api.get("/posts/mine/");
        if (!cancelled) setPosts(data);
      } catch (err) {
        console.error("Erro ao buscar posts:", err);
      } finally {
        if (!cancelled) setLoadingPosts(false);
      }
    }

    loadPosts();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDeletePost(postId: number) {
    setDeletingId(postId);
    try {
      await api.delete(`/posts/${postId}/`);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      console.error("Erro ao deletar post:", err);
    } finally {
      setDeletingId(null);
    }
  }

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
                  src={profile.avatar || "https://i.pravatar.cc/150?img=12"}
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

              {/* ── Contagens clicáveis ── */}
              <div className="flex items-center gap-6 mt-2">
                <button
                  onClick={() => setFollowModal("followers")}
                  className="flex items-center gap-1 hover:opacity-80 transition"
                >
                  <span className="text-white font-bold text-sm">
                    {followersCount}
                  </span>
                  <span className="text-gray-500 text-sm">Seguidores</span>
                </button>

                <button
                  onClick={() => setFollowModal("following")}
                  className="flex items-center gap-1 hover:opacity-80 transition"
                >
                  <span className="text-white font-bold text-sm">
                    {user?.following_count ?? 0}
                  </span>
                  <span className="text-gray-500 text-sm">Seguindo</span>
                </button>

                <div className="flex items-center gap-1">
                  <span className="text-white font-bold text-sm">
                    {posts.length}
                  </span>
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
        {loadingPosts ? (
          <p className="text-gray-500 text-sm p-6">Carregando posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500 text-sm p-6">Nenhum post ainda.</p>
        ) : (
          <div className="grid grid-cols-5 gap-1 p-1">
            {posts.map((post) => (
              <div
                key={post.id}
                className="aspect-square overflow-hidden cursor-pointer group relative"
              >
                <img
                  src={post.image}
                  alt={`post-${post.id}`}
                  onClick={() =>
                    setSelectedPost({
                      postId: post.id,
                      image: post.image,
                      text: post.content,
                      likes: post.likes_count,
                      comments: post.comments_count,
                      shares: 0,
                      likedByMe: false,
                    })
                  }
                  className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-75 transition-all duration-300"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePost(post.id);
                  }}
                  disabled={deletingId === post.id}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-red-400 opacity-0 group-hover:opacity-100 transition hover:bg-red-500/30 disabled:opacity-50"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
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
          postId={selectedPost.postId}
          image={selectedPost.image}
          text={selectedPost.text}
          username={profile.username}
          avatar={profile.avatar || "https://i.pravatar.cc/150?img=12"}
          likes={selectedPost.likes}
          comments={selectedPost.comments}
          shares={selectedPost.shares}
          likedByMe={selectedPost.likedByMe}
          onClose={() => setSelectedPost(null)}
        />
      )}

      {/* ── MODAL SEGUIDORES/SEGUINDO ── */}
      {followModal && (
        <FollowListModal
          type={followModal}
          onClose={() => setFollowModal(null)}
        />
      )}
    </div>
  );
}
