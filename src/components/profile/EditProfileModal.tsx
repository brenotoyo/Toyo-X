import { X, Camera, Lock, Eye, EyeOff } from "lucide-react";
import { useState, useRef } from "react";
import api from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";

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

type Tab = "perfil" | "senha";

export default function EditProfileModal({
  data,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [tab, setTab] = useState<Tab>("perfil");
  const [form, setForm] = useState<ProfileData>(data);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);
  const storeUser = useAuthStore((s) => s.user);

  // Campos de senha
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  function handleImage(
    e: React.ChangeEvent<HTMLInputElement>,
    field: "avatar" | "banner",
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (field === "avatar") setAvatarFile(file);
    else setBannerFile(file);
    const url = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, [field]: url }));
  }

  async function handleSubmitPerfil(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("bio", form.bio);
      if (avatarFile) formData.append("avatar", avatarFile);
      if (bannerFile) formData.append("banner", bannerFile);

      const { data: updated } = await api.patch("/auth/me/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Atualiza o Zustand store com os dados reais do backend
      if (storeUser && token) {
        setAuth(
          {
            ...storeUser,
            username: updated.username ?? storeUser.username,
            bio: updated.bio ?? storeUser.bio,
            avatar: updated.avatar ?? storeUser.avatar,
            banner: updated.banner ?? storeUser.banner,
          },
          token,
        );
      }

      onSave({
        username: updated.username ?? form.username,
        bio: updated.bio ?? form.bio,
        avatar: updated.avatar ?? form.avatar,
        banner: updated.banner ?? form.banner,
      });
      onClose();
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmitSenha(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "As senhas não coincidem." });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({
        type: "error",
        text: "A nova senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }

    setSavingPassword(true);
    try {
      await api.post("/auth/change-password/", {
        old_password: oldPassword,
        new_password: newPassword,
      });
      setPasswordMsg({ type: "success", text: "Senha alterada com sucesso!" });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Senha atual incorreta.";
      setPasswordMsg({ type: "error", text: msg });
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-[#0f0f1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* ── Cabeçalho ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-white font-bold text-base">Editar perfil</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Abas ── */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setTab("perfil")}
            className={`flex-1 py-3 text-sm font-medium transition ${
              tab === "perfil"
                ? "text-purple-400 border-b-2 border-purple-500"
                : "text-gray-500 hover:text-white"
            }`}
          >
            Perfil
          </button>
          <button
            onClick={() => setTab("senha")}
            className={`flex-1 py-3 text-sm font-medium transition ${
              tab === "senha"
                ? "text-purple-400 border-b-2 border-purple-500"
                : "text-gray-500 hover:text-white"
            }`}
          >
            Senha
          </button>
        </div>

        {/* ── ABA PERFIL ── */}
        {tab === "perfil" && (
          <form onSubmit={handleSubmitPerfil}>
            {/* Banner */}
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

            {/* Avatar */}
            <div className="px-6">
              <div className="relative -mt-10 w-20 h-20 mb-4">
                <img
                  src={form.avatar || "https://i.pravatar.cc/150?img=12"}
                  alt="avatar"
                  className="w-20 h-20 rounded-full object-cover border-4 border-[#0f0f1a]"
                />
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
                  <label className="text-gray-400 text-xs font-medium">
                    Bio
                  </label>
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
                    disabled={saving}
                    className="px-6 py-2 rounded-full bg-linear-to-r from-purple-600 to-fuchsia-500 text-white text-sm font-semibold shadow-lg shadow-purple-500/30 hover:opacity-90 transition disabled:opacity-50"
                  >
                    {saving ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* ── ABA SENHA ── */}
        {tab === "senha" && (
          <form
            onSubmit={handleSubmitSenha}
            className="px-6 py-6 flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Lock size={16} className="text-purple-400" />
              <span className="text-white text-sm font-medium">
                Alterar senha
              </span>
            </div>

            {/* Senha atual */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-400 text-xs font-medium">
                Senha atual
              </label>
              <div className="relative">
                <input
                  type={showOld ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 pr-10 text-white text-sm outline-none focus:border-purple-500/50 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowOld((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                >
                  {showOld ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Nova senha */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-400 text-xs font-medium">
                Nova senha
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 pr-10 text-white text-sm outline-none focus:border-purple-500/50 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                >
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirmar nova senha */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-400 text-xs font-medium">
                Confirmar nova senha
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 pr-10 text-white text-sm outline-none focus:border-purple-500/50 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Mensagem de feedback */}
            {passwordMsg && (
              <p
                className={`text-xs font-medium ${
                  passwordMsg.type === "success"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {passwordMsg.text}
              </p>
            )}

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
                disabled={
                  savingPassword ||
                  !oldPassword ||
                  !newPassword ||
                  !confirmPassword
                }
                className="px-6 py-2 rounded-full bg-linear-to-r from-purple-600 to-fuchsia-500 text-white text-sm font-semibold shadow-lg shadow-purple-500/30 hover:opacity-90 transition disabled:opacity-50"
              >
                {savingPassword ? "Salvando..." : "Alterar senha"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
