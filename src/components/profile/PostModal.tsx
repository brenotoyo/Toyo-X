import { X, Heart, MessageCircle, Repeat2, Send } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/services/api";

interface CommentUser {
  id: number;
  username: string;
  avatar: string | null;
}

interface Comment {
  id: number;
  user: CommentUser;
  text: string;
  created_at: string;
}

interface PostModalProps {
  postId: number;
  image: string;
  text: string;
  username: string;
  avatar: string;
  likes: number;
  comments: number;
  shares: number;
  likedByMe?: boolean;
  onClose: () => void;
}

export default function PostModal({
  postId,
  image,
  text,
  username,
  avatar,
  likes,
  comments,
  shares,
  likedByMe = false,
  onClose,
}: PostModalProps) {
  const [liked, setLiked] = useState(likedByMe);
  const [likeCount, setLikeCount] = useState(likes);
  const [commentCount, setCommentCount] = useState(comments);
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [sending, setSending] = useState(false);

  // Carrega comentários ao abrir o modal
  useEffect(() => {
    let cancelled = false;

    async function loadComments() {
      try {
        const { data } = await api.get(`/posts/${postId}/comments/`);
        if (!cancelled) setCommentList(data);
      } catch (err) {
        console.error("Erro ao carregar comentários:", err);
      } finally {
        if (!cancelled) setLoadingComments(false);
      }
    }

    loadComments();
    return () => {
      cancelled = true;
    };
  }, [postId]);

  async function handleLike() {
    try {
      const { data } = await api.post(`/posts/${postId}/like/`);
      setLiked(data.liked);
      setLikeCount(data.likes_count);
    } catch (err) {
      console.error("Erro ao curtir:", err);
    }
  }

  async function handleSendComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim() || sending) return;

    setSending(true);
    try {
      const { data } = await api.post(`/posts/${postId}/comments/`, {
        text: commentText,
      });
      setCommentList((prev) => [...prev, data]);
      setCommentCount((prev) => prev + 1);
      setCommentText("");
    } catch (err) {
      console.error("Erro ao comentar:", err);
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
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
          <div className="px-5 py-4 border-b border-white/5 shrink-0">
            <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
          </div>

          {/* Lista de comentários */}
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
            {loadingComments ? (
              <p className="text-gray-600 text-xs text-center">
                Carregando comentários...
              </p>
            ) : commentList.length === 0 ? (
              <p className="text-gray-600 text-xs text-center">
                Nenhum comentário ainda. Seja o primeiro!
              </p>
            ) : (
              commentList.map((c) => (
                <div key={c.id} className="flex items-start gap-3">
                  <img
                    src={c.user.avatar || "https://i.pravatar.cc/150?img=12"}
                    alt={c.user.username}
                    className="w-7 h-7 rounded-full object-cover border border-purple-500/40 shrink-0"
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-white text-xs font-semibold">
                      {c.user.username}
                    </span>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {c.text}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Ações */}
          <div className="flex items-center gap-6 px-5 py-3 border-t border-white/10 shrink-0">
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
              <span>{commentCount.toLocaleString()}</span>
            </button>

            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-400 transition-all">
              <Repeat2 size={18} />
              <span>{shares.toLocaleString()}</span>
            </button>
          </div>

          {/* Input de comentário */}
          <form
            onSubmit={handleSendComment}
            className="flex items-center gap-2 px-5 py-3 border-t border-white/10 shrink-0"
          >
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Escreva um comentário..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500/50 transition"
            />
            <button
              type="submit"
              disabled={!commentText.trim() || sending}
              className="p-2 rounded-xl bg-purple-600/80 text-white hover:bg-purple-500 transition disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
