import { Navigate, Outlet } from "react-router-dom";

export function PrivateRoute() {
  // Futuramente: verificar token JWT vindo do Django
  const token = localStorage.getItem("token");

  return token ? <Outlet /> : <Navigate to="/" replace />;
}
