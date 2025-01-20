import Header from '../../components/Header.jsx';
import Api from '../../services/Api.js';
import { FlickerAlerts, FlickerModals } from 'flicker-alerts';
import { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import styles from './styles.module.css';

function Receitaextrato() {
  const navigate = useNavigate();



  const [receitas, setReceitas] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem('token'); // Obtenha o token aqui
    Api.get("/getallcontributions", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => setReceitas(response.data))
      .catch(() => console.error("Erro ao buscar receitas."));
  }, []);



  const fetchReceitas = async () => {
    const token = sessionStorage.getItem('token'); // Obtenha o token aqui
    try {
      const response = await Api.get("/getallcontributions", { headers: { Authorization: `Bearer ${token}` } });
      setReceitas(response.data);
    } catch (error) {
      console.error("Erro ao buscar receitas:", error);
    }
  };

  const handleDelete = (id) => {
    FlickerModals.showModal({
      type: 'warning',
      title: 'Confirmação',
      message: 'Deseja realmente excluir esta receita?',
      onConfirm: async () => {
        const token = sessionStorage.getItem('token'); // Obtenha o token aqui
        try {
          await Api.delete(`/deletecontribution/${id}`, { headers: { Authorization: `Bearer ${token}` } });
          FlickerAlerts.showAlert({
            type: 'success',
            title: 'Sucesso!',
            message: 'Receita excluída com sucesso!',
            duration: 3000
          });
          fetchReceitas(); // Recarregar as receitas após a exclusão
        } catch (error) {
          console.error("Erro ao excluir receita:", error);
          FlickerAlerts.showAlert({
            type: 'danger',
            title: 'Erro!',
            message: 'Erro ao excluir receita. Tente novamente.',
            position: 'top-right',
            duration: 5000
          });
        }
      },
      onCancel: () => {
        FlickerAlerts.showAlert({
          type: "info",
          title: "Ação cancelada!",
          message: "Exclusão não realizada!",
          duration: 3000,
        });
      }
    });
  };

  const handleEdit = (receita) => {
    navigate(`/updatereceita/${receita._id}`, { state: { receita } }); // Passa os dados 
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const tokenExpiration = sessionStorage.getItem('tokenExpiration');
    const currentTime = new Date().getTime();

    if (!token || (tokenExpiration && currentTime > Number(tokenExpiration))) {
      sessionStorage.clear();
      navigate('/');
    }
  }, [navigate]);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.menu}>
          <h2 className={styles.menuItem}>
            <Link to="/extratoreceita">Todas receitas</Link>
          </h2>
          <h2 className={styles.menuItem}>
            <Link to="/receita">Cadastrar nova</Link>
          </h2>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Competência</th>
                <th>Data de recebimento</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {receitas.map((receita) => (
                <tr key={receita._id}> {/* Usando _id como chave */}
                  <td>{receita.name}</td>
                  <td>{receita.mes}/{receita.ano}</td>
                  <td>{new Date(receita.dataRecebimento).toLocaleDateString('pt-BR')}</td>
                  <td>{receita.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className={styles.actions}>
                    <button 
                      className={styles.editButton}
                      onClick={() => handleEdit(receita)} // Lógica de edição deve ser implementada
                    >
                      Editar
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDelete(receita._id)} // Passa o ID da receita
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
}

export default Receitaextrato;