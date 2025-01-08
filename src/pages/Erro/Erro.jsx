import styles from "./styles.module.css";
import { Link } from "react-router-dom";

const Erro = ()=> {
    return(
        <>

        <div>
        <h1>
          ASSOCIAÇÃO DOS AUDITORES FISCAIS DE TRIBUTOS MUNICIPAIS DE ANÁPOLIS - AAFTA
        </h1>
        </div>


        <div>
        <h1 className={styles.mensagem}>Ooppps....página não encontrada</h1>
        </div>


        <div className={styles.links}>
          <Link to="/">
            Voltar
          </Link>
        </div>
        </>
    )
}
export default Erro