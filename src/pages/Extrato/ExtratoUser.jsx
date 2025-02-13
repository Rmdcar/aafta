import Header from '../../components/Header.jsx';
import Api from '../../services/Api.js';
import { FlickerAlerts } from 'flicker-alerts';
import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css"; // Importar CSS
import { Portuguese } from "flatpickr/dist/l10n/pt"; // Importar localização em português

function ExtratoUser() {
  const navigate = useNavigate();
  const datePickerRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    userId: ''
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Busca todos os usuários
    const fetchUsers = async () => {
      try {
        const response = await Api.get("/getAllUsers");
        setUsers(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        FlickerAlerts.showAlert({
          type: 'danger',
          title: 'Erro!',
          message: 'Erro ao buscar usuários. Tente novamente.',
          position: 'top-right',
          duration: 5000,
        });
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Inicializa o Flatpickr
    flatpickr(datePickerRef.current, {
      locale: Portuguese, // Configura o idioma para português do Brasil
      mode: "range", // Modo de intervalo
      dateFormat: "d-m-Y", // Formato da data
      maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Limite de 1 ano
      defaultDate: [new Date(), new Date(new Date().setDate(new Date().getDate() + 0))], // Data inicial
    });
  }, []);

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    if (name === 'name') {
      const selectedUser = users.find(user => user.name === value);
      if (selectedUser) {
        setFormData((prevData) => ({ ...prevData, name: value, userId: selectedUser._id }));
      } else {
        setFormData((prevData) => ({ ...prevData, name: value, userId: '' }));
      }
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();

    // Verifica se o userId foi selecionado
    if (!formData.userId) {
      FlickerAlerts.showAlert({
        type: 'danger',
        title: 'Erro!',
        message: 'Selecione um usuário válido.',
        position: 'top-right',
        duration: 5000,
      });
      return;
    }

    // Acessa as datas selecionadas
    const selectedDates = datePickerRef.current._flatpickr.selectedDates;
    if (selectedDates.length < 2) {
      FlickerAlerts.showAlert({
        type: 'danger',
        title: 'Erro!',
        message: 'Selecione um intervalo de datas válido.',
        position: 'top-right',
        duration: 5000,
      });
      return;
    }

    const [startDate, endDate] = selectedDates;

    // Redireciona para a página de extrato do usuário com o intervalo de datas
    navigate(`/extratousuario/${formData.userId}`, {
      state: {
        startDate,
        endDate,
      },
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
      <h1 className={styles.title}>Selecione Usuário</h1>
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
          <label className={styles.label}>Selecione o período</label>
          <input
            ref={datePickerRef}
            className={styles.inputField}
            type="text"
            placeholder="Selecione um intervalo de datas"
            readOnly // Torna o input somente leitura
          />
        </div>

        <button className={styles.button} type="submit">Buscar</button>
      </form>
    </>
  );
}

export default ExtratoUser;