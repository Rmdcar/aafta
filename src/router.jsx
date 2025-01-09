import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cadastro from "./pages/Cadastro/Cadastro";
import Receita from "./pages/Receitas/Receita";
import Despesa from "./pages/Despesas/Despesa";
import Extrato from "./pages/Extrato/Extrato";
import Login from "./pages/Login/Login";
import Erro from "./pages/Erro/Erro";

// Função para verificar se o usuário está autenticado
const isAuthenticated = () => {
  const token = sessionStorage.getItem('token');
  const expirationTime = sessionStorage.getItem('tokenExpiration');
  if (!token || !expirationTime) {
    return false;
  }
  const currentTime = new Date().getTime();
  return currentTime < expirationTime;
};

// Componente de Rota Protegida
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/home",
    element: <ProtectedRoute element={<Home />} />,
  },
  {
    path: "/cadastro",
    element: <ProtectedRoute element={<Cadastro />} />,
  },
  {
    path: "/receita",
    element: <ProtectedRoute element={<Receita />} />,
  },
  {
    path: "/despesa",
    element: <ProtectedRoute element={<Despesa />} />,
  },
  {
    path: "/extrato",
    element: <ProtectedRoute element={<Extrato />} />,
  },
  {
    path: "/404", 
    element: <Erro />
  },
  {
    path: "/*", // Rota para capturar todas as outras rotas não encontradas
    element: <Navigate to="/404" />, // Redireciona para a página 404
  }
]);

export default router;
