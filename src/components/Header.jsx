import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./styles.module.css";

const handleLogout = (navigate) => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  localStorage.removeItem("tokenExpiration");
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
        ASSOCIACAO DOS AUDITORES FISCAIS <br /> DE TRIBUTOS MUNICIPAIS DE ANAPOLIS - AAFTA
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
          <Link to="/usuarios">Cadastro</Link>
        </div>
        <div className={styles.links}>
          <Link to="/extratoreceita">Receitas</Link>
        </div>
        <div className={styles.links}>
          <Link to="/extratodespesa">Despesas</Link>
        </div>
        <div className={styles.links}>
          <Link to="/homeextratos">Extratos</Link>
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
