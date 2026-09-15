import { useState, useRef } from "react";
import { ImagePlus, X, Send, ImageOff } from "lucide-react";

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
    if (!content.trim() || !preview) return;
    // Futuramente: chamada à API Django
    console.log({ content, preview });
    setContent("");
    removeImage();
  }

  const remaining = 280 - content.length;

  // Condição de habilitação do botão
  const canSubmit = content.trim().length > 0 && !!preview && remaining >= 0;

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
          placeholder="O que está acontecendo? Compartilhe um momento conosco"
          maxLength={280}
          rows={3}
          className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm resize-none outline-none leading-relaxed"
        />
      </div>

      {/* Preview da imagem */}
      {preview ? (
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
      ) : (
        /* Aviso de imagem obrigatória */
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-white/10 bg-white/2">
          <ImageOff size={16} className="text-gray-600 shrink-0" />
          <p className="text-gray-600 text-xs">
            Uma imagem é obrigatória para publicar.
          </p>
        </div>
      )}

      {/* Divisor */}
      <div className="border-t border-white/5" />

      {/* Rodapé */}
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
            className={`transition ${
              preview
                ? "text-purple-400"
                : "text-gray-500 hover:text-purple-400"
            }`}
            title="Adicionar imagem"
          >
            <ImagePlus size={20} />
          </button>
        </div>

        {/* Contador + Publicar */}
        <div className="flex items-center gap-4">
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

          <button
            type="submit"
            disabled={!canSubmit}
            title={!preview ? "Adicione uma imagem para publicar" : ""}
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
