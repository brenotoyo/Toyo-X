import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import RegisterPage from "@/pages/auth/Register";
import Login from "@/pages/auth/Login";
import Feed from "@/pages/feed/Feed";
import Perfil from "@/pages/perfil/Perfil";

// Telas que você criará
// import { LoginPage } from '@/features/auth/pages/LoginPage';
// import { RegisterPage } from '@/features/auth/pages/RegisterPage';
// import { FeedPage } from '@/features/feed/pages/FeedPage';
// import { ProfilePage } from '@/features/profile/pages/ProfilePage';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rotas Privadas */}
        <Route path="/feed" element={<Feed />} />
        <Route path="/search" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />

        {/* Redirecionamento padrão */}
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
