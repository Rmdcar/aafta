import { Link } from "react-router-dom";


function Header() {
  return (
    <>
      <h1>
        ASSOCIACAO DOS AUDITORES FISCAIS DE TRIBUTOS MUNICIPAIS DE ANAPOLIS -
        AAFTA
      </h1>
      <nav>
      <div>
          <Link to="/">Home</Link>
        </div>
        <div>
          <Link to="/cadastro">Cadastro</Link>
        </div>
        <div>
          <Link to="/receita">Receitas</Link>
        </div>
        <div>
          <Link to="/despesa">Despesas</Link>
          <div>
            <Link to="/extrato">Extrato</Link>
          </div>
        </div>
      </nav>
    </>
  );
}
export default Header;
