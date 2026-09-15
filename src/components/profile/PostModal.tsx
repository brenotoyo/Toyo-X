import { X, Heart, MessageCircle, Repeat2 } from "lucide-react";
import { useState } from "react";

interface PostModalProps {
  image: string;
  text: string;
  username: string;
  avatar: string;
  likes: number;
  comments: number;
  shares: number;
  onClose: () => void;
}

export default function PostModal({
  image,
  text,
  username,
  avatar,
  likes,
  comments,
  shares,
  onClose,
}: PostModalProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  function handleLike() {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  }

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal */}
      <div className="flex w-full max-w-4xl max-h-[90vh] bg-[#0f0f1a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {/* ── Lado esquerdo: Imagem ── */}
        <div className="flex-[1.2] bg-black flex items-center justify-center">
          <img
            src={image}
            alt="post"
            className="w-full h-full object-cover max-h-[90vh]"
          />
        </div>

        {/* ── Lado direito: Conteúdo ── */}
        <div className="flex-[0.8] flex flex-col">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <img
                src={avatar}
                alt={username}
                className="w-9 h-9 rounded-full object-cover border-2 border-purple-500/50"
              />
              <span className="text-white font-semibold text-sm">
                {username}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Texto do post */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-6 px-5 py-4 border-t border-white/10 shrink-0">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 text-sm transition-all ${
                liked ? "text-pink-500" : "text-gray-500 hover:text-pink-400"
              }`}
            >
              <Heart size={18} fill={liked ? "currentColor" : "none"} />
              <span>{likeCount.toLocaleString()}</span>
            </button>

            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple-400 transition-all">
              <MessageCircle size={18} />
              <span>{comments.toLocaleString()}</span>
            </button>

            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-400 transition-all">
              <Repeat2 size={18} />
              <span>{shares.toLocaleString()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
