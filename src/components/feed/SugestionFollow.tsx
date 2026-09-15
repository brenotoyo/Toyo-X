interface SugestionUsers {
  avatar: string;
  username: string;
}

export default function Sugestion({ avatar, username }: SugestionUsers) {
  return (
    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src={avatar}
          alt={username}
          className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/50"
        />
        <span className="text-white font-semibold text-sm">{username}</span>
      </div>
      {/* Botão seguir */}
      <button
        type="submit"
        className="px-3.5 py-1 rounded-t-sm rounded-b-sm bg-purple-900  text-purple-100 text-sm font-semibold hover:bg-purple-100 hover:text-purple-900"
      >
        Seguir
      </button>
    </div>
  );
}
