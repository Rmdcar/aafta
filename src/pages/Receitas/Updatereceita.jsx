import Header from '../../components/Header.jsx';
import Api from '../../services/Api.js';
import { FlickerAlerts, FlickerModals } from 'flicker-alerts';
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

function Updatereceita() {
  const navigate = useNavigate();
  const location = useLocation();
  const receita = location.state.receita;

  const [formData, setFormData] = useState({
    name: receita.name,
    mes: receita.mes,
    ano: receita.ano,
    dataRecebimento: receita.dataRecebimento.split('T')[0], // Se a data estiver em formato ISO
    valor: receita.valor
  });

  const [receitas, setReceitas] = useState([]);

  useEffect(() => {
    const fetchReceitas = async () => {
      const token = sessionStorage.getItem('token');
      try {
        const response = await Api.get("/getallcontributions", { headers: { Authorization: `Bearer ${token}` } });
        setReceitas(response.data);
      } catch (error) {
        console.error("Erro ao buscar receitas:", error);
      }
    };

    fetchReceitas();
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
      message: 'Deseja realmente atualizar esta receita?',
      onConfirm: async () => {
        try {
          const res = await Api.patch(`/updatecontribution/${receita._id}`, formData); // Use o ID da receita da URL
          if (res.data.error) {
            FlickerAlerts.showAlert({
              type: "danger",
              title: "Erro!",
              message: "Erro ao atualizar a receita.",
              position: "top-right",
              duration: 5000,
            });
          } else {
            FlickerAlerts.showAlert({
              type: "success",
              title: "Sucesso!",
              message: "Receita atualizada com sucesso",
              position: "top-right",
              duration: 5000,
            });
            navigate("/extratoreceita");
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
      <h1 className={styles.title}>Editar receita</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nome</label>
          <select
            className={styles.inputField}
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          >
            <option value="">SELECIONE</option>
            {receitas.map((receita) => (
              <option key={receita._id} value={receita.name}>{receita.name}</option>
            ))}
          </select>
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
          <label className={styles.label}>Data de recebimento</label>
          <input
            className={styles.inputField}
            type="date"
            name="dataRecebimento"
            value = {formData.dataRecebimento}
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

export default Updatereceita;