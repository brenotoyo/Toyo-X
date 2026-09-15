import { useState, useRef } from "react";
import { ImagePlus, X, Send } from "lucide-react";

export default function NewPostForm() {
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    // Aqui vai a chamada à API Django futuramente
    console.log({ content, preview });
    setContent("");
    removeImage();
  }

  const remaining = 280 - content.length;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-4xl rounded-2xl bg-white/5 border border-white/10 p-5 flex flex-col gap-4 transition-all focus-within:border-purple-500/40"
    >
      {/* Avatar + Textarea */}
      <div className="flex gap-3">
        <img
          src="https://i.pravatar.cc/150?img=12"
          alt="Meu avatar"
          className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/50 shrink-0"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="O que há de novo ?"
          maxLength={280}
          rows={3}
          className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm resize-none outline-none leading-relaxed"
        />
      </div>

      {/* Preview da imagem */}
      {preview && (
        <div className="relative rounded-xl overflow-hidden">
          <img
            src={preview}
            alt="preview"
            className="w-full max-h-64 object-cover rounded-xl"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Divisor */}
      <div className="border-t border-white/5" />

      {/* Rodapé: ações + contador + botão */}
      <div className="flex items-center justify-between">
        {/* Botão de imagem */}
        <div className="flex items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImage}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-gray-500 hover:text-purple-400 transition"
            title="Adicionar imagem"
          >
            <ImagePlus size={20} />
          </button>
        </div>

        {/* Contador + Publicar */}
        <div className="flex items-center gap-4">
          {/* Contador de caracteres */}
          <span
            className={`text-xs font-medium transition-colors ${
              remaining <= 20
                ? remaining <= 0
                  ? "text-red-500"
                  : "text-yellow-400"
                : "text-gray-500"
            }`}
          >
            {remaining}
          </span>

          {/* Botão publicar */}
          <button
            type="submit"
            disabled={!content.trim() || remaining < 0}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-linear-to-r from-purple-600 to-fuchsia-500 text-white text-sm font-semibold shadow-lg shadow-purple-500/30 hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={15} />
            Publicar
          </button>
        </div>
      </div>
    </form>
  );
}
