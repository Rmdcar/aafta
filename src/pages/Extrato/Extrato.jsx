import Header from '../../components/Header.jsx';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Api from "../../services/Api.js";

function Extrato() {
  const navigate = useNavigate();
  const [combinedData, setCombinedData] = useState([]);
  const [saldo, setSaldo] = useState(0);

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

  useEffect(() => {
    const fetchContributionsAndExpenses = async () => {
      try {
        const [contributionsRes, expensesRes] = await Promise.all([
          Api.get('/getallcontributions'),
          Api.get('/getallexpenses')
        ]);

        const contributionsData = Array.isArray(contributionsRes.data) ? contributionsRes.data.map(contribution => ({
          ...contribution,
          dataRecebimento: new Date(contribution.dataRecebimento),
          tipo: 'Receitas'
        })) : [];

        const expensesData = Array.isArray(expensesRes.data) ? expensesRes.data.map(expense => ({
          ...expense,
          dataPagamento: new Date(expense.dataPagamento),
          tipo: 'Despesa'
        })) : [];

        const combined = [...contributionsData, ...expensesData].sort((a, b) => new Date(a.dataRecebimento || a.dataPagamento) - new Date(b.dataRecebimento || b.dataPagamento));

        // Calcula o saldo somando receitas e subtraindo despesas
        const saldoCalculado = combined.reduce((acc, item) => {
          const valor = parseFloat(item.valor);
          if (item.tipo === 'Receitas') {
            return acc + valor;
          } else if (item.tipo === 'Despesa') {
            return acc - valor;
          }
          return acc;
        }, 0);

        setCombinedData(combined);
        setSaldo(saldoCalculado);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchContributionsAndExpenses();
  }, []);

  return (
    <>
      <Header />
      <h1 className={styles.title}>Extrato</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Nome</th>
            <th>Competência</th>
            <th>Data</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {combinedData.map((item, index) => (
            <tr key={index}>
              <td>{item.tipo}</td>
              <td>{item.tipo === 'Despesa' ? `${item.categoria} - ${item.descricao}` : item.name}</td>
              <td>{item.mes}/{item.ano}</td>
              <td>{item.dataRecebimento ? item.dataRecebimento.toLocaleDateString('pt-BR') : item.dataPagamento.toLocaleDateString('pt-BR')}</td>
              <td>{item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          ))}
          <tr className={styles.saldoRow}>
            <td colSpan="4" className={styles.saldoLabel}>Saldo</td>
            <td className={styles.saldoValue}>{saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default Extrato;
