import { createBrowserRouter } from "react-router-dom"
import Home from "./pages/Home/Home";
import Cadastro from "./pages/Cadastro/Cadastro";
import Receita from "./pages/Receitas/Receita";
import Despesa from "./pages/Despesas/Despesa";
import Extrato from "./pages/Extrato/Extrato";
import Login from "./pages/Login/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>,
  },
  {
    path: "/home",
    element: <Home/>,
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
  }

])

export default router;