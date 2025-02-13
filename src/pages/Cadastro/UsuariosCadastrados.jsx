import Header from "../../components/Header.jsx";
import Api from "../../services/Api.js";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import styles from "./styles.module.css";
import { FlickerAlerts, FlickerModals } from 'flicker-alerts';

const UsuariosCadastrados = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); 

  const handleDelete = async (userId) => {
    try {
      FlickerModals.showModal({
        type: 'delete',
        title: 'Confirmação',
        message: 'Deseja realmente excluir este usuário?',
        onConfirm: async () => {
          try {
            const res = await Api.delete(`/deleteUser/${userId}`);
            if (res.data.erro) {
              console.log(res.data.erro);
            } else {
              FlickerAlerts.showAlert({
                type: 'success',
                title: 'Sucesso!',
                message: 'Usuário deletado com sucesso!',
                duration: 3000
              });
              setUsers(users.filter(user => user._id !== userId));
            }
          } catch (error) {
            console.error('Erro ao deletar:', error);
            FlickerAlerts.showAlert({
              type: 'error',
              title: 'Erro!',
              message: 'Ocorreu um erro ao deletar o usuário.',
              duration: 3000
            });
          }
        },
        onCancel: () => {
          FlickerAlerts.showAlert({
            type: 'info',
            title: 'Ação cancelada!',
            message: 'Usuário não deletado!',
            duration: 3000
          });
        }
      });
    } catch (error) {
      console.error('Erro ao abrir o modal:', error);
    }
  };

  const handleEdit = (user) => {
    navigate(`/updateuser/${user._id}`, { state: { user } });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      const tokenExpiration = localStorage.getItem("tokenExpiration");
      const currentTime = new Date().getTime();

      if (!token || (tokenExpiration && currentTime > Number(tokenExpiration))) {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
        navigate("/");
        return;
      }

      try {
        const response = await Api.get("/getAllUsers");
        setUsers(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        FlickerAlerts.showAlert({
          type: 'error',
          title: 'Erro!',
          message: 'Ocorreu um erro ao buscar os usuários.',
          duration: 3000
        });
      }
    };

    fetchUsers();
  }, [navigate]);

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
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className={styles.actions}>
                    <button 
                      className={styles.editButton}
                      onClick={() => handleEdit(user)}
                    >
                      Editar
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDelete(user._id)}
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