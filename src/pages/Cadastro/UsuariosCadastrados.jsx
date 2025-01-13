import Header from "../../components/Header.jsx";
import Api from "../../services/Api.js";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const UsuariosCadastrados = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    Api.get("/getAllUsers")
      .then((response) => {
        setUsers(response.data);
      })
      .catch(() => {
        console.error("Erro ao buscar usuários.");
      });
  }, []);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.menu}>
          <h2 className={styles.menuItem}>
            <Link to="/usuarios">Todos usuários</Link>
          </h2>
          <h2 className={styles.menuItem}>
            <Link to="/cadastro">Cadastrar Novo</Link>
          </h2>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className={styles.actions}>
                    <button className={styles.editButton}>Editar</button>
                    <button className={styles.deleteButton}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UsuariosCadastrados;
