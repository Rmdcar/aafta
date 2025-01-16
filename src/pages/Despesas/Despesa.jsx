import Header from '../../components/Header.jsx';
import Api from '../../services/Api.js';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { FlickerAlerts, FlickerModals } from 'flicker-alerts';
import styles from "./styles.module.css";

function Despesa() {
  const navigate = useNavigate();

  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    categoria: '',
    descricao: '',
    mes: '',
    ano: '',
    dataPagamento: '',
    valor: ''
  });

  // Função para atualizar o estado com os valores do formulário
  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Função para tratar o envio do formulário
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    FlickerModals.showModal({
      type: 'warning',
      title: 'Confirmação',
      message: 'Deseja realmente cadastrar esta despesa?',
      onConfirm: async () => {
        try {
          const res = await Api.post('/newexpense', formData);
          if (res.data.error) {
            FlickerAlerts.showAlert({
              type: 'danger',
              title: 'Erro!',
              message: 'Despesa não cadastrada',
              position: 'top-right',
              duration: 5000
            });
          } else {
            FlickerAlerts.showAlert({
              type: 'success',
              title: 'Sucesso!',
              message: 'Despesa cadastrada com sucesso!',
              duration: 3000
            });
            setFormData({ categoria: '', descricao: '', mes: '', ano: '', dataPagamento: '', valor: '' });
          }
        } catch (error) {
          console.error(error);
          FlickerAlerts.showAlert({
            type: 'danger',
            title: 'Erro!',
            message: 'Erro ao cadastrar despesa. Tente novamente.',
            position: 'top-right',
            duration: 5000
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
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('tokenExpiration');
      navigate('/');
    }
  }, [navigate]);

  return (
    <>
      <Header />
      <h1 className={styles.title}>Despesas</h1>
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
            <option value="Custas Judiciais">Custas Judiciais</option>
            <option value="Honorários Advogado">Honorários Advogado</option>
            <option value="Contribuições">Contribuições</option>
            <option value="Custas">Custas</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Descrição</label>
          <textarea
            className={styles.inputField}
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
          ></textarea>
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
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
            <option value="2029">2029</option>
            <option value="2030">2030</option>
            <option value="2031">2031</option>
            <option value="2032">2032</option>
            <option value="2033">2033</option>
            <option value="2034">2034</option>
            <option value="2035">2035</option>
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

export default Despesa;
