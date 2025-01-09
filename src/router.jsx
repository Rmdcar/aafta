import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cadastro from "./pages/Cadastro/Cadastro";
import Receita from "./pages/Receitas/Receita";
import Despesa from "./pages/Despesas/Despesa";
import Extrato from "./pages/Extrato/Extrato";
import Login from "./pages/Login/Login";
import Erro from "./pages/Erro/Erro";

// Função para verificar se o usuário está autenticado


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/home",
    element: <Home /> 
  },
  {
    path: "/cadastro",
    element: <Cadastro />
  },
  {
    path: "/receita",
    element: <Receita /> 
  },
  {
    path: "/despesa",
    element: <Despesa />
  },
  {
    path: "/extrato",
    element: <Extrato />
  },
  {
    path: "/*", // Rota para capturar todas as outras rotas não encontradas
    element: <Erro/>, // Redireciona para a página 404
  }
]);

export default router;
