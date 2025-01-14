import Header from "../../components/Header.jsx";
import Api from "../../services/Api.js";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import { FlickerAlerts, FlickerModals } from 'flicker-alerts';

const UsuariosCadastrados = () => {
  const [users, setUsers] = useState([]);

  const handleDelete = async (userId) => {
    try {
      FlickerModals.showModal({
        type: 'delete',
        title: 'Confirmação',
        message: 'Deseja realmente excluir este usuário?',
        onConfirm: async () => {
          try {
            const res = await Api.delete(`/deleteUser/${userId}`); // Passa o ID do usuário na URL
            if (res.data.erro) {
              console.log(res.data.erro); // Exibe a mensagem de erro, se houver
            } else {
              FlickerAlerts.showAlert({
                type: 'success',
                title: 'Sucesso!',
                message: 'Usuário deletado com sucesso!',
                duration: 3000
              });
              // Atualiza a lista de usuários após a exclusão
              setUsers(users.filter(user => user._id !== userId)); // Filtro pelo campo _id
            }
          } catch (error) {
            console.error('Erro ao deletar:', error);
          }
        },
        onCancel: () => {
          FlickerAlerts.showAlert({
            type: 'info',
            title: 'Ação cancelada!',
            message: 'Usuário não deletado!',
            duration: 3000
          });        }
      });
    } catch (error) {
      console.error('Erro ao abrir o modal:', error);
    }
  };

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
                <tr key={user._id}> {/* Usando _id como chave */}
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className={styles.actions}>
                    <button className={styles.editButton}>Editar</button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDelete(user._id) } // Passa o ID do usuário
                    >
                      Excluir
                    </button>
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
