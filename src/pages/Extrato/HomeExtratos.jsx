import { Link, useNavigate } from "react-router-dom";
import Header from '../../components/Header.jsx';
import styles from "./styles.module.css";

function HomeExtratos (){
    return (
        <>
        <Header />

        <div className={styles.container}>
        <div className={styles.menu}>
          <h2 className={styles.menuItem}>
            <Link to="/extratofinanceiro">Extrato Financeiro</Link>
          </h2>
          <h2 className={styles.menuItem}>
            <Link to="/extratousuario">Extrato por Associado</Link>
          </h2>
        </div>
        </div>
        </>
    )
}

export default HomeExtratos