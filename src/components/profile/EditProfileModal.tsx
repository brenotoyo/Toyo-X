import { X, Camera } from "lucide-react";
import { useState, useRef } from "react";

interface ProfileData {
  username: string;
  bio: string;
  avatar: string;
  banner: string;
}

interface EditProfileModalProps {
  data: ProfileData;
  onClose: () => void;
  onSave: (updated: ProfileData) => void;
}

export default function EditProfileModal({
  data,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [form, setForm] = useState<ProfileData>(data);
  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  function handleImage(
    e: React.ChangeEvent<HTMLInputElement>,
    field: "avatar" | "banner",
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, [field]: url }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Futuramente: chamada à API Django
    onSave(form);
    onClose();
  }

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal */}
      <div className="w-full max-w-lg bg-[#0f0f1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-white font-bold text-base">Editar perfil</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ── Banner ── */}
          <div
            className="relative h-32 bg-linear-to-br from-purple-900 via-purple-700 to-fuchsia-900 cursor-pointer group"
            onClick={() => bannerRef.current?.click()}
          >
            {form.banner && (
              <img
                src={form.banner}
                alt="banner"
                className="w-full h-full object-cover"
              />
            )}
            {/* Overlay hover */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
              <Camera size={24} className="text-white" />
            </div>
            <input
              ref={bannerRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImage(e, "banner")}
            />
          </div>

          {/* ── Avatar ── */}
          <div className="px-6">
            <div className="relative -mt-10 w-20 h-20 mb-4">
              <img
                src={form.avatar}
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover border-4 border-[#0f0f1a]"
              />
              {/* Botão trocar avatar */}
              <button
                type="button"
                onClick={() => avatarRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 hover:opacity-100 transition"
              >
                <Camera size={18} className="text-white" />
              </button>
              <input
                ref={avatarRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImage(e, "avatar")}
              />
            </div>

            {/* ── Campos ── */}
            <div className="flex flex-col gap-4 pb-6">
              {/* Username */}
              <div className="flex flex-col gap-1">
                <label className="text-gray-400 text-xs font-medium">
                  Nome de usuário
                </label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, username: e.target.value }))
                  }
                  maxLength={30}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-purple-500/50 transition"
                />
                <span className="text-gray-600 text-[11px] text-right">
                  {form.username.length}/30
                </span>
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-1">
                <label className="text-gray-400 text-xs font-medium">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  maxLength={150}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-purple-500/50 transition resize-none"
                />
                <span className="text-gray-600 text-[11px] text-right">
                  {form.bio.length}/150
                </span>
              </div>

              {/* Botões */}
              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-full text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-linear-to-r from-purple-600 to-fuchsia-500 text-white text-sm font-semibold shadow-lg shadow-purple-500/30 hover:opacity-90 transition"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
