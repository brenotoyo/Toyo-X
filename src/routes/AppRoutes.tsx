import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoute } from "@/routes/PrivateRoute";

import Login from "@/pages/auth/Login";
import RegisterPage from "@/pages/auth/Register";
import Feed from "@/pages/feed/Feed";
import Perfil from "@/pages/perfil/Perfil";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rotas privadas — protegidas pelo token */}
        <Route element={<PrivateRoute />}>
          <Route path="/feed" element={<Feed />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>

        {/* Qualquer rota desconhecida → login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
