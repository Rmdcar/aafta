import Header from '../../components/Header.jsx';
import Api from '../../services/Api.js';
import { FlickerAlerts, FlickerModals } from 'flicker-alerts';
import { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import styles from './styles.module.css';
import { format } from "date-fns"; // Importações do date-fns
import { ptBR } from "date-fns/locale"; // Localização para português do Brasil

function Receitaextrato() {
  const navigate = useNavigate();
  const [receitas, setReceitas] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchReceitas = async () => {
      try {
        const response = await Api.get("/getallcontributions", { headers: { Authorization: `Bearer ${token}` } });
        setReceitas(response.data);
      } catch (error) {
        console.error("Erro ao buscar receitas:", error);
      } finally {
        setLoading(false); // Define loading como false após a requisição
      }
    };

    fetchReceitas();
  }, []);

  const handleDelete = (id) => {
    FlickerModals.showModal({
      type: 'warning',
      title: 'Confirmação',
      message: 'Deseja realmente excluir esta receita?',
      onConfirm: async () => {
        const token = localStorage.getItem('token');
        try {
          await Api.delete(`/deletecontribution/${id}`, { headers: { Authorization: `Bearer ${token}` } });
          FlickerAlerts.showAlert({
            type: 'success',
            title: 'Sucesso!',
            message: 'Receita excluída com sucesso!',
            duration: 3000
          });
          // Recarregar as receitas após a exclusão
          const response = await Api.get("/getallcontributions", { headers: { Authorization: `Bearer ${token}` } });
          setReceitas(response.data);
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
    const token = localStorage.getItem('token');
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    const currentTime = new Date().getTime();

    if (!token || (tokenExpiration && currentTime > Number(tokenExpiration))) {
      localStorage.clear();
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

  const parseDateAsLocal = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day); // Mês é base 0 no JavaScript
  };

  // Função para formatar a data no formato brasileiro (DD/MM/YYYY) usando date-fns
  const formatarData = (data) => {
    try {
      const localDate = parseDateAsLocal(data.split("T")[0]); // Converte para data local
      return format(localDate, "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Data inválida";
    }
  };

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
          {loading ? ( // Exibe a mensagem de carregamento
            <p>Carregando...</p>
          ) : (
            <>
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
                      <td>{formatarData(receita.dataRecebimento)}</td>
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
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Receitaextrato;