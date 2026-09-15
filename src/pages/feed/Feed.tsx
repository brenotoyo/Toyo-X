import SideHome from "@/components/SideHome";
import PostCard from "@/components/feed/PostCard";
import NewPostForm from "@/components/feed/NewPostForm";
import Sugestion from "@/components/feed/SugestionFollow";

// Dados mockados para testar
const mockPosts = [
  {
    id: 1,
    avatar: "https://i.pravatar.cc/150?img=1",
    username: "AlexKnight",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "https://picsum.photos/seed/space1/800/400",
    likes: 1200,
    comments: 230,
    shares: 75,
  },
  {
    id: 2,
    avatar: "https://i.pravatar.cc/150?img=5",
    username: "LunaStar",
    content: "Post sem imagem — só texto mesmo.",
    likes: 987,
    comments: 180,
    shares: 42,
  },
  {
    id: 3,
    avatar: "https://i.pravatar.cc/150?img=9",
    username: "AlexKnight",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "https://picsum.photos/seed/astro/800/400",
    likes: 1200,
    comments: 230,
    shares: 75,
  },
];

const mockSugestion = [
  {
    id: 1,
    avatar: "https://i.pravatar.cc/150?img=3",
    username: "Deltrano",
  },
  {
    id: 2,
    avatar: "https://i.pravatar.cc/150?img=4",
    username: "Beltrano",
  },
  {
    id: 3,
    avatar: "https://i.pravatar.cc/150?img=7",
    username: "Outromano",
  },
  {
    id: 4,
    avatar: "https://i.pravatar.cc/150?img=2",
    username: "Vegano",
  },
  {
    id: 5,
    avatar: "https://i.pravatar.cc/150?img=6",
    username: "Mutano",
  },
];

export default function Feed() {
  return (
    <div className="min-h-screen bg-[#0d0d1a] flex">
      {/* Sidebar fixa */}
      <SideHome />

      {/* Conteúdo do feed */}
      <div className="ml-72 flex-1 flex gap-6 p-6">
        {/* Coluna de posts */}
        <main className="flex-3 flex flex-col gap-4 items-center">
          {/* Formulário de novo post */}
          <NewPostForm />
          {mockPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </main>

        {/* Coluna direita */}
        <aside className="flex-1 flex flex-col gap-4">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 flex flex-col gap-4">
            <h3 className="text-white">Usuários sugeridos</h3>
            {/* Container de usuários sugeridos */}
            <div className="flex flex-col gap-3">
              {mockSugestion.map((sug) => (
                <Sugestion key={sug.id} {...sug} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
