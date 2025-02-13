import Header from '../../components/Header.jsx';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import Api from "../../services/Api.js";
import styles from "./styles.module.css";

function Home() {
  const navigate = useNavigate();
  const [receitas, setReceitas] = useState(0);
  const [despesas, setDespesas] = useState(0);
  const [saldo, setSaldo] = useState(0);
  const [totalMembros, setTotalMembros] = useState(0);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    const currentTime = new Date().getTime();

    if (!token || (tokenExpiration && currentTime > Number(tokenExpiration))) {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token'); // Obtenha o token aqui
      setLoading(true); // Define loading como true antes da requisição

      try {
        const [contributionsRes, expensesRes, usersRes] = await Promise.all([
          Api.get('/getallcontributions', { headers: { Authorization: `Bearer ${token}` } }),
          Api.get('/getallexpenses', { headers: { Authorization: `Bearer ${token}` } }),
          Api.get('/getAllUsers', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const receitasTotal = contributionsRes.data.reduce((acc, contribution) => acc + parseFloat(contribution.valor), 0);
        const despesasTotal = expensesRes.data.reduce((acc, expense) => acc + parseFloat(expense.valor), 0);
        const saldoTotal = receitasTotal - despesasTotal;
        const totalMembros = usersRes.data.length - 2;

        setReceitas(receitasTotal);
        setDespesas(despesasTotal);
        setSaldo(saldoTotal);
        setTotalMembros(totalMembros);
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setLoading(false); // Define loading como false após a requisição
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
      <Header />
      {loading ? (
        <p>Carregando...</p> // Exibe a mensagem de carregamento
      ) : (
        <>
          <h1 className={styles.title}>Dashboard</h1>
          <div className={styles.dashboard}>
            <div className={styles.card}>
              <div className={styles.cardTitle}>Receitas</div>
              <div className={styles.cardValue}>
                {receitas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>Despesas</div>
              <div className={styles.cardValue}>
                {despesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>Saldo em conta</div>
              <div className={styles.cardValue}>
                {saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>Total de membros</div>
              <div className={styles.cardValue}>{totalMembros}</div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Home;