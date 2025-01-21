import Header from '../../components/Header.jsx';
import Api from '../../services/Api.js';
import { FlickerAlerts, FlickerModals } from 'flicker-alerts';
import { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import styles from './styles.module.css';

function Receitaextrato() {
  const navigate = useNavigate();
  const [receitas, setReceitas] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    Api.get("/getallcontributions", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => setReceitas(response.data))
      .catch(() => console.error("Erro ao buscar receitas."));
  }, []);

  const fetchReceitas = async () => {
    const token = sessionStorage.getItem('token');
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
        const token = sessionStorage.getItem('token');
        try {
          await Api.delete(`/deletecontribution/${id}`, { headers: { Authorization: `Bearer ${token}` } });
          FlickerAlerts.showAlert({
            type: 'success',
            title: 'Sucesso!',
            message: 'Receita excluída com sucesso!',
            duration: 3000
          });
          fetchReceitas();
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
    navigate(`/updatereceita/${receita._id}`, { state: { receita } });
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

  const handleFilterChange = (ev) => {
    setFilter(ev.target.value);
  };

  // Ordena as receitas pela data de recebimento (do mais antigo para o mais novo)
  const sortedReceitas = receitas.sort((a, b) => new Date(a.dataRecebimento) - new Date(b.dataRecebimento));

  // Filtra as receitas com base no texto digitado
  const filteredReceitas = sortedReceitas.filter(receita => receita.name.toLowerCase().includes(filter.toLowerCase()));

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
          <div className={styles.filterContainer}>
            <label className={styles.filterLabel}>Filtrar por Nome:</label>
            <input 
              type="text" 
              value={filter} 
              onChange={handleFilterChange} 
              className={styles.filterInput} 
              placeholder="Digite para filtrar"
            />
          </div>
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
              {filteredReceitas.map((receita) => (
                <tr key={receita._id}>
                  <td>{receita.name}</td>
                  <td>{receita.mes}/{receita.ano}</td>
                  <td>{new Date(receita.dataRecebimento).toLocaleDateString('pt-BR')}</td>
                  <td>{receita.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className={styles.actions}>
                    <button 
                      className={styles.editButton}
                      onClick={() => handleEdit(receita)}
                    >
                      Editar
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDelete(receita._id)}
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
