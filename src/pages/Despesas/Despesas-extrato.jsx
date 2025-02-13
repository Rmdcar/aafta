import Header from '../../components/Header.jsx';
import Api from '../../services/Api.js';
import { FlickerAlerts, FlickerModals } from 'flicker-alerts';
import { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import styles from './styles.module.css';
import { format  } from "date-fns"; // Importações do date-fns
import { ptBR } from "date-fns/locale"; // Localização para português do Brasil

function Despesaextrato() {
  const navigate = useNavigate();


  const [despesas, setDespesas] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Obtenha o token aqui
    Api.get("/getallexpenses", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => setDespesas(response.data))
      .catch(() => console.error("Erro ao buscar despesas."));
  }, []);



  const fetchDespesas = async () => {
    const token = localStorage.getItem('token'); // Obtenha o token aqui
    try {
      const response = await Api.get("/getallexpenses", { headers: { Authorization: `Bearer ${token}` } });
      setDespesas(response.data);
    } catch (error) {
      console.error("Erro ao buscar despesas:", error);
    }
  };

  const handleDelete = (id) => {
    FlickerModals.showModal({
      type: 'warning',
      title: 'Confirmação',
      message: 'Deseja realmente excluir esta despesas?',
      onConfirm: async () => {
        const token = localStorage.getItem('token'); // Obtenha o token aqui
        try {
          await Api.delete(`/deleteexpense/${id}`, { headers: { Authorization: `Bearer ${token}` } });
          FlickerAlerts.showAlert({
            type: 'success',
            title: 'Sucesso!',
            message: 'Respesa excluída com sucesso!',
            duration: 3000
          });
          fetchDespesas(); // Recarregar as despesas após a exclusão
        } catch (error) {
          console.error("Erro ao excluir despesas:", error);
          FlickerAlerts.showAlert({
            type: 'danger',
            title: 'Erro!',
            message: 'Erro ao excluir despesas. Tente novamente.',
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
                      onClick={() => handleEdit(despesa)} // Lógica de edição deve ser implementada
                    >
                      Editar
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDelete(despesa._id)} // Passa o ID da despesas
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

export default Despesaextrato;