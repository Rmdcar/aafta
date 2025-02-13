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
import Receitaextrato from "./pages/Receitas/Receitas-extrato";
import Updatereceita from "./pages/Receitas/Updatereceita";
import Despesaextrato from "./pages/Despesas/Despesas-extrato"
import Updatedespesas from "./pages/Despesas/Updatedespesas";
import HomeExtratos from "./pages/Extrato/HomeExtratos";
import ExtratoUser from "./pages/Extrato/ExtratoUser";
import ExtratoUsuario from "./pages/Extrato/Extratousuario";


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
    path: "/extratoreceita",
    element: <Receitaextrato />,
  },
  {
    path: "/updatereceita/:id",
    element: <Updatereceita />,
  },
  {
    path: "/despesa",
    element: <Despesa />,
  },
  {
    path: "/extratodespesa",
    element: <Despesaextrato />,
  },
  {
    path: "/updatedespesa/:id",
    element: <Updatedespesas />,
  },
  {
    path: "/homeextratos",
    element: <HomeExtratos/>
  },
  {
    path: "/extratofinanceiro",
    element: <Extrato />,
  },
  {path: "/extratousuario",
  element: <ExtratoUser />,
},
{
  path: "/extratousuario/:id",
  element:<ExtratoUsuario />
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
