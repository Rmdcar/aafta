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
        <h1>Usuários Cadastrados</h1>
        <h2 className={styles.addUserButton}>
          <Link to="/cadastro">Cadastrar Novo</Link>
        </h2>
        <div className={styles.userHeader}>
          <h2>Nome</h2>
          <h2>Email</h2>
        </div>
        <ul className={styles.userList}>
          {users.map((user) => (
            <li key={user.id}>
              <div>{user.name}</div>
              <div>{user.email}</div>
              <div className={styles.actions}>
                <button className={styles.editButton}>Editar</button>
                <button className={styles.deleteButton}>Excluir</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default UsuariosCadastrados;