import { useEffect, useState } from "react";
import SideHome from "@/components/SideHome";
import PostCard from "@/components/feed/PostCard";
import NewPostForm from "@/components/feed/NewPostForm";
import api from "@/services/api";

interface Post {
  id: number;
  author: {
    id: number;
    username: string;
    avatar: string | null;
  };
  content: string;
  image: string;
  likes_count: number;
  comments_count: number;
  liked_by_me: boolean;
  created_at: string;
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchPosts() {
    try {
      const { data } = await api.get("/posts/");
      setPosts(data);
    } catch (err) {
      console.error("Erro ao buscar posts:", err);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data } = await api.get("/posts/");
        if (!cancelled) setPosts(data);
      } catch (err) {
        console.error("Erro ao buscar posts:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d1a] flex">
      <SideHome />

      <div className="ml-56 flex-1 flex gap-6 p-6">
        <main className="flex-2 flex flex-col gap-4 items-center">
          <NewPostForm onPostCreated={fetchPosts} />

          {loading ? (
            <p className="text-gray-500 text-sm mt-6">Carregando posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-500 text-sm mt-6">
              Nenhum post ainda. Siga alguém para ver posts aqui!
            </p>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                avatar={post.author.avatar ?? "https://i.pravatar.cc/150?img=1"}
                username={post.author.username}
                content={post.content}
                image={post.image}
                likes={post.likes_count}
                comments={post.comments_count}
                likedByMe={post.liked_by_me}
              />
            ))
          )}
        </main>

        <aside className="flex-1 flex flex-col gap-4">
          <p className="text-white">Conteúdo direito...</p>
        </aside>
      </div>
    </div>
  );
}
