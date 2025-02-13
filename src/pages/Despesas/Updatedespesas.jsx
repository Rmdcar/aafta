import Header from '../../components/Header.jsx';
import Api from '../../services/Api.js';
import { FlickerAlerts, FlickerModals } from 'flicker-alerts';
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

function Updatedespesas() {
  const navigate = useNavigate();
  const location = useLocation();
  const despesa = location.state.despesa;

  const [formData, setFormData] = useState({
    categoria: despesa.categoria,
    descricao: despesa.descricao,
    mes: despesa.mes,
    ano: despesa.ano,
    dataPagamento: despesa.dataPagamento.split('T')[0], // Se a data estiver em formato ISO
    valor: despesa.valor
  });

  const [despesas, setDespesas] = useState([]);

  useEffect(() => {
    const fetchDespesas = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await Api.get("/getallexpenses", { headers: { Authorization: `Bearer ${token}` } });
        setDespesas(response.data); // Corrigido para setDespesas
      } catch (error) {
        console.error("Erro ao buscar despesas:", error);
      }
    };

    fetchDespesas();
  }, []);

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setFormData((prevData) => ({ 
        ...prevData, 
        [name]: value 
    }));
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    FlickerModals.showModal({
      type: 'confirm',
      title: 'Confirmação',
      message: 'Deseja realmente atualizar esta despesa?',
      onConfirm: async () => {
        try {
          const res = await Api.patch(`/updateexpense/${despesa._id}`, formData); // Use o ID da despesa da URL
          if (res.data.error) {
            FlickerAlerts.showAlert({
              type: "danger",
              title: "Erro!",
              message: "Erro ao atualizar a despesa.",
              position: "top-right",
              duration: 5000,
            });
          } else {
            FlickerAlerts.showAlert({
              type: "success",
              title: "Sucesso!",
              message: "Despesa atualizada com sucesso",
              position: "top-right",
              duration: 5000,
            });
            navigate("/extratodespesa");
          }
        } catch (error) {
          console.log("Erro na requisição PATCH:", error);
          FlickerAlerts.showAlert({
            type: "danger",
            title: "Erro!",
            message: "Ocorreu um erro ao atualizar. Tente novamente.",
            position: "top-right",
            duration: 5000,
          });
        }
      },
      onCancel: () => {
        FlickerAlerts.showAlert({
          type: "info",
          title: "Ação cancelada!",
          message: "Atualização não realizada!",
          duration: 3000,
        });
      }
    });
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

  return (
    <>
      <Header />
      <h1 className={styles.title}>Editar despesa</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Categoria</label>
          <select
            className={styles.inputField}
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
          >
            <option value="">SELECIONE</option>
            {despesas.map((despesa) => (
              <option key={despesa._id} value={despesa.categoria}>{despesa.categoria}</option>
            ))}
          </select>
        </div>


        <div className={styles.formGroup}>
          <label className={styles.label}>Descrição</label>
          <input
            className={styles.inputField}
            type="text"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Mês</label>
          <select
            className={styles.inputField}
            name="mes"
            value={formData.mes}
            onChange={handleChange}
            required
          >
            <option value="">SELECIONE</option>
            <option value="01">Janeiro</option>
            <option value="02">Fevereiro</option>
            <option value="03">Março</option>
            <option value="04">Abril</option>
            <option value="05">Maio</option>
            <option value="06">Junho</option>
            <option value="07">Julho</option>
            <option value="08">Agosto</option>
            <option value="09">Setembro</option>
            <option value="10">Outubro</option>
            <option value="11">Novembro</option>
            <option value="12">Dezembro</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Ano</label>
          <select
            className={styles.inputField}
            name="ano"
            value={formData.ano}
            onChange={handleChange}
            required
          >
            <option value="">SELECIONE</option>
            {Array.from({ length: 11 }, (_, i) => (
              <option key={2024 + i} value={2024 + i}>{2024 + i}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Data de pagamento</label>
          <input
            className={styles.inputField}
            type="date"
            name="dataPagamento"
            value={formData.dataPagamento}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Valor</label>
          <input
            className={styles.inputField}
            type="number"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            required
          />
        </div>

        <button className={styles.button} type="submit">Salvar</button>
      </form>
    </>
  );
}

export default Updatedespesas;