import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./styles.module.css";

const handleLogout = (navigate) => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("usuario");
  sessionStorage.removeItem("tokenExpiration");
  navigate("/");
};

function Header() {
  const [menuActive, setMenuActive] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <>
      <h1 className={styles.title}>
        ASSOCIACAO DOS AUDITORES FISCAIS DE TRIBUTOS MUNICIPAIS DE ANAPOLIS -
        AAFTA
      </h1>
      <div className={styles.hamburgerMenu} onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <nav className={`${styles.navbar} ${menuActive ? styles.active : ""}`}>
        <div className={styles.links}>
          <Link to="/home">Home</Link>
        </div>
        <div className={styles.links}>
          <Link to="/cadastro">Cadastro</Link>
        </div>
        <div className={styles.links}>
          <Link to="/receita">Receitas</Link>
        </div>
        <div className={styles.links}>
          <Link to="/despesa">Despesas</Link>
        </div>
        <div className={styles.links}>
          <Link to="/extrato">Extrato</Link>
        </div>
        <div className={styles.links}>
          <Link to="/" onClick={() => handleLogout(navigate)}>
            Sair
          </Link>
        </div>
      </nav>
    </>
  );
}

export default Header;
