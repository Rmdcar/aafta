import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cadastro from "./pages/Cadastro/Cadastro";
import Receita from "./pages/Receitas/Receita";
import Despesa from "./pages/Despesas/Despesa";
import Extrato from "./pages/Extrato/Extrato";
import Login from "./pages/Login/Login";
import Erro from "./pages/Erro/Erro";
import UsuariosCadastrados from "./pages/Cadastro/UsuariosCadastrados"
import UpdateUser from "./pages/Cadastro/UpdateUser"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/cadastro",
    element: <Cadastro />,
  },
  {
    path: "/receita",
    element: <Receita />,
  },
  {
    path: "/despesa",
    element: <Despesa />,
  },
  {
    path: "/extrato",
    element: <Extrato />,
  },
  // Redireciona rotas inexistentes explicitamente
  {
    path: "*",
    element: <Navigate to="/erro" />,
  },
  {
    path: "/erro",
    element: <Erro />,
  },
  {
    path: '/usuarios',
    element: <UsuariosCadastrados/>
  },
  {
    path: '/updateuser/:id',
    element: <UpdateUser/>
  }
]);

export default router;
