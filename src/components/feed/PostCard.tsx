import { Heart, MessageCircle, Repeat2, MoreHorizontal } from "lucide-react";
import { useState } from "react";

interface PostCardProps {
  avatar: string;
  username: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
}

export default function PostCard({
  avatar,
  username,
  content,
  image,
  likes,
  comments,
  shares,
}: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  function handleLike() {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  }

  return (
    <div className="w-4xl rounded-2xl bg-white/5 border border-white/10 p-5 flex flex-col gap-4 hover:border-purple-500/30 transition-all">
      {/* Cabeçalho: avatar + nome + menu */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt={username}
            className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/50"
          />
          <span className="text-white font-semibold text-sm">{username}</span>
        </div>
        <button className="text-gray-500 hover:text-white transition">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Texto do post */}
      <p className="text-gray-300 text-sm leading-relaxed">{content}</p>

      {/* Imagem do post (opcional) */}
      {image && (
        <img
          src={image}
          alt="post"
          className="w-full rounded-xl object-cover max-h-80"
        />
      )}

      {/* Ações */}
      <div className="flex items-center gap-6 pt-1 border-t border-white/5">
        {/* Curtir */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 text-sm transition-all ${
            liked ? "text-pink-500" : "text-gray-500 hover:text-pink-400"
          }`}
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
          <span>{likeCount.toLocaleString()}</span>
        </button>

        {/* Comentar */}
        <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple-400 transition-all">
          <MessageCircle size={18} />
          <span>{comments.toLocaleString()}</span>
        </button>

        {/* Compartilhar */}
        <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-400 transition-all">
          <Repeat2 size={18} />
          <span>{shares.toLocaleString()}</span>
        </button>
      </div>
    </div>
  );
}
