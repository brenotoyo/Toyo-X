import {
  Heart,
  MessageCircle,
  Repeat2,
  MoreHorizontal,
  Send,
  Trash2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
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

interface PostCardProps {
  id: number;
  avatar: string;
  username: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  likedByMe?: boolean;
  isOwner?: boolean;
  onDelete?: (id: number) => void;
}

export default function PostCard({
  id,
  avatar,
  username,
  content,
  image,
  likes,
  comments,
  likedByMe = false,
  isOwner = false,
  onDelete,
}: PostCardProps) {
  const [liked, setLiked] = useState(likedByMe);
  const [likeCount, setLikeCount] = useState(likes);
  const [commentCount, setCommentCount] = useState(comments);
  const [showComments, setShowComments] = useState(false);
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [sending, setSending] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLike() {
    try {
      const { data } = await api.post(`/posts/${id}/like/`);
      setLiked(data.liked);
      setLikeCount(data.likes_count);
    } catch (err) {
      console.error("Erro ao curtir:", err);
    }
  }

  async function toggleComments() {
    if (showComments) {
      setShowComments(false);
      return;
    }

    setShowComments(true);

    if (commentList.length === 0) {
      setLoadingComments(true);
      try {
        const { data } = await api.get(`/posts/${id}/comments/`);
        setCommentList(data);
      } catch (err) {
        console.error("Erro ao carregar comentários:", err);
      } finally {
        setLoadingComments(false);
      }
    }
  }

  async function handleSendComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim() || sending) return;

    setSending(true);
    try {
      const { data } = await api.post(`/posts/${id}/comments/`, {
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

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.delete(`/posts/${id}/`);
      onDelete?.(id);
    } catch (err) {
      console.error("Erro ao deletar post:", err);
      setDeleting(false);
    }
  }

  return (
    <div className="w-4xl rounded-2xl bg-white/5 border border-white/10 p-5 flex flex-col gap-4 hover:border-purple-500/30 transition-all">
      {/* ── CABEÇALHO ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt={username}
            className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/50"
          />
          <span className="text-white font-semibold text-sm">{username}</span>
        </div>

        {/* Menu de opções — só aparece se for dono do post */}
        {isOwner && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="text-gray-500 hover:text-white transition"
            >
              <MoreHorizontal size={20} />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-8 w-36 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl z-10 overflow-hidden">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
                >
                  <Trash2 size={15} />
                  {deleting ? "Deletando..." : "Deletar post"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Se não for dono, mantém o botão mas sem ação */}
        {!isOwner && (
          <button className="text-gray-500 hover:text-white transition">
            <MoreHorizontal size={20} />
          </button>
        )}
      </div>

      {/* ── CONTEÚDO ── */}
      <p className="text-gray-300 text-sm leading-relaxed">{content}</p>

      {image && (
        <img
          src={image}
          alt="post"
          className="w-full rounded-xl object-cover max-h-80"
        />
      )}

      {/* ── AÇÕES ── */}
      <div className="flex items-center gap-6 pt-1 border-t border-white/5">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 text-sm transition-all ${
            liked ? "text-pink-500" : "text-gray-500 hover:text-pink-400"
          }`}
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
          <span>{likeCount.toLocaleString()}</span>
        </button>

        <button
          onClick={toggleComments}
          className={`flex items-center gap-2 text-sm transition-all ${
            showComments
              ? "text-purple-400"
              : "text-gray-500 hover:text-purple-400"
          }`}
        >
          <MessageCircle size={18} />
          <span>{commentCount.toLocaleString()}</span>
        </button>

        <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-400 transition-all">
          <Repeat2 size={18} />
          <span>{0}</span>
        </button>
      </div>

      {/* ── COMENTÁRIOS ── */}
      {showComments && (
        <div className="flex flex-col gap-3 pt-2 border-t border-white/5">
          <form
            onSubmit={handleSendComment}
            className="flex items-center gap-2"
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

          {loadingComments ? (
            <p className="text-gray-600 text-xs text-center py-2">
              Carregando comentários...
            </p>
          ) : commentList.length === 0 ? (
            <p className="text-gray-600 text-xs text-center py-2">
              Nenhum comentário ainda. Seja o primeiro!
            </p>
          ) : (
            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
              {commentList.map((c) => (
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
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
