import Header from '../../components/Header.jsx';
import Api from '../../services/Api.js';
import { FlickerAlerts, FlickerModals } from 'flicker-alerts';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

function Receita() {
  const navigate = useNavigate();

   const [formData, setFormData] = useState({
    name: '',
    mes: '',
    ano: '',
    dataRecebimento: '',
    valor: '',
    userId: ''
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    Api.get("/getAllUsers")
      .then((response) => setUsers(response.data))
      .catch(() => console.error("Erro ao buscar usuários."));
  }, []);

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    if (name === 'name') {
      const selectedUser = users.find(user => user.name === value);
      setFormData((prevData) => ({ ...prevData, name: value, userId: selectedUser._id }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    FlickerModals.showModal({
      type: 'warning',
      title: 'Confirmação',
      message: 'Deseja realmente cadastrar esta receita?',
      onConfirm: async () => {
        try {
          const res = await Api.post('/newcontribution', formData);
          console.log(formData)

          if (res.data.error) {
            FlickerAlerts.showAlert({
              type: 'danger',
              title: 'Erro!',
              message: 'Receita não cadastrada',
              position: 'top-right',
              duration: 5000
            });
          } else {
            FlickerAlerts.showAlert({
              type: 'success',
              title: 'Sucesso!',
              message: 'Receita cadastrada com sucesso!',
              duration: 3000
            });
            setFormData({ name: '', mes: '', ano: '', dataRecebimento: '', valor: '', userId: '' });
          }
        } catch (error) {
          console.error(error);
          FlickerAlerts.showAlert({
            type: 'danger',
            title: 'Erro!',
            message: 'Erro ao cadastrar receita. Tente novamente.',
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
      <h1 className={styles.title}>Cadastrar receita</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nome</label>
          <select
            className={`${styles.inputField} input-field`}
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          >
            <option value="">SELECIONE</option>
            {users.map((user) => (
              <option key={user._id} value={user.name}>{user.name}</option>
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
          <label className={styles.label}>Data de recebimento</label>
          <input
            className={styles.inputField}
            type="date"
            name="dataRecebimento"
            value={formData.dataRecebimento}
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

export default Receita;
