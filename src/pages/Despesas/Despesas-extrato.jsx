import Header from '../../components/Header.jsx';
import Api from '../../services/Api.js';
import { FlickerAlerts, FlickerModals } from 'flicker-alerts';
import { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import styles from './styles.module.css';
import { format } from "date-fns"; // Importações do date-fns
import { ptBR } from "date-fns/locale"; // Localização para português do Brasil

function Despesaextrato() {
  const navigate = useNavigate();
  const [despesas, setDespesas] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    const token = localStorage.getItem('token'); // Obtenha o token aqui
    const fetchDespesas = async () => {
      try {
        const response = await Api.get("/getallexpenses", { headers: { Authorization: `Bearer ${token}` } });
        setDespesas(response.data);
      } catch (error) {
        console.error("Erro ao buscar despesas:", error);
      } finally {
        setLoading(false); // Define loading como false após a requisição
      }
    };

    fetchDespesas();
  }, []);

  const handleDelete = (id) => {
    FlickerModals.showModal({
      type: 'warning',
      title: 'Confirmação',
      message: 'Deseja realmente excluir esta despesa?',
      onConfirm: async () => {
        const token = localStorage.getItem('token'); // Obtenha o token aqui
        try {
          await Api.delete(`/deleteexpense/${id}`, { headers: { Authorization: `Bearer ${token}` } });
          FlickerAlerts.showAlert({
            type: 'success',
            title: 'Sucesso!',
            message: 'Despesa excluída com sucesso!',
            duration: 3000
          });
          // Recarregar as despesas após a exclusão
          const response = await Api.get("/getallexpenses", { headers: { Authorization: `Bearer ${token}` } });
          setDespesas(response.data);
        } catch (error) {
          console.error("Erro ao excluir despesa:", error);
          FlickerAlerts.showAlert({
            type: 'danger',
            title: 'Erro!',
            message: 'Erro ao excluir despesa. Tente novamente.',
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

  const handleEdit = (despesa) => {
    navigate(`/updatedespesa/${despesa._id}`, { state: { despesa } }); // Passa os dados 
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

  // Função para converter uma string de data no formato YYYY-MM-DD para uma data local
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
            <Link to="/extratodespesa">Todas despesas</Link>
          </h2>
          <h2 className={styles.menuItem}>
            <Link to="/despesa">Cadastrar nova</Link>
          </h2>
        </div>
        <div className={styles.tableContainer}>
          {loading ? ( // Exibe a mensagem de carregamento
            <p>Carregando...</p>
          ) : (
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th>Descrição</th>
                  <th>Competência</th>
                  <th>Data de pagamento</th>
                  <th>Valor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {despesas.map((despesa) => (
                  <tr key={despesa._id}> {/* Usando _id como chave */}
                    <td>{despesa.categoria}</td>
                    <td>{despesa.descricao}</td>
                    <td>{despesa.mes}/{despesa.ano}</td>
                    <td>{formatarData(despesa.dataPagamento)}</td>
                    <td>{despesa.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className={styles.actions}>
                      <button 
                        className={styles.editButton}
                        onClick={() => handleEdit(despesa)} 
                      >
                        Editar
                      </button>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => handleDelete(despesa._id)} // Passa o ID da despesa
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default Despesaextrato;