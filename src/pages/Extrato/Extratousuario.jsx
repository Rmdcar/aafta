import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Api from "../../services/Api.js";
import { FlickerAlerts, FlickerModals } from "flicker-alerts";
import styles from "./styles.module.css";
import Header from "../../components/Header.jsx";
import { format  } from "date-fns"; // Importações do date-fns
import { ptBR } from "date-fns/locale"; // Localização para português do Brasil

function ExtratoUsuario() {
  const { id } = useParams();
  const location = useLocation();
  const { startDate, endDate } = location.state || {};
  const navigate = useNavigate();

  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!startDate || !endDate || !(startDate instanceof Date) || !(endDate instanceof Date)) {
      FlickerAlerts.showAlert({
        type: "danger",
        title: "Erro!",
        message: "Intervalo de datas inválido.",
        position: "top-right",
        duration: 5000,
      });
      return;
    }

    if (!token) {
      FlickerAlerts.showAlert({
        type: "danger",
        title: "Erro!",
        message: "Token de autenticação não encontrado.",
        position: "top-right",
        duration: 5000,
      });
      return;
    }

    const fetchReceitas = async () => {
      try {
        const response = await Api.get(`/getcontributionbyuser/${id}`, {
          params: {
            startDate: startDate.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0],
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setReceitas(response.data.data);
        
        
      } catch (error) {
        console.error("Erro ao buscar receitas:", error);
        const errorMessage = error.response?.data?.message || "Erro ao buscar receitas. Tente novamente.";
        FlickerAlerts.showAlert({
          type: "danger",
          title: "Erro!",
          message: errorMessage,
          position: "top-right",
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReceitas();
  }, [id, startDate, endDate, token]);

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

  const handleVoltar = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleEnviarEmail = async () => {
    if (!startDate || !endDate || !(startDate instanceof Date) || !(endDate instanceof Date)) {
      FlickerAlerts.showAlert({
        type: "danger",
        title: "Erro!",
        message: "Intervalo de datas inválido.",
        position: "top-right",
        duration: 5000,
      });
      return;
    }

    FlickerModals.showModal({
      type: 'warning',
      title: 'Confirmação',
      message: 'Deseja realmente enviar email?',
      onConfirm: async () => {
        try {
          const response = await Api.post(
            "/enviar-email",
            {
              userId: id,
              startDate: startDate.toISOString().split("T")[0],
              endDate: endDate.toISOString().split("T")[0],
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.error) {
            FlickerAlerts.showAlert({
              type: "danger",
              title: "Erro!",
              message: response.data.message,
              position: "top-right",
              duration: 5000,
            });
          } else {
            FlickerAlerts.showAlert({
              type: "success",
              title: "Sucesso!",
              message: "E-mail enviado com sucesso.",
              position: "top-right",
              duration: 5000,
            });
          }
        } catch (error) {
          console.error("Erro ao enviar e-mail:", error);
          const errorMessage = error.response?.data?.message || "Erro ao enviar e-mail. Tente novamente.";
          FlickerAlerts.showAlert({
            type: "danger",
            title: "Erro!",
            message: errorMessage,
            position: "top-right",
            duration: 5000,
          });
        }
      }
    });
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Extrato do Usuário</h1>
        <p className={styles.userName}>
          {receitas.length > 0 ? receitas[0].name : ''}
        </p>

        <p className={styles.subtitle}>
          Período: {formatarData(startDate.toISOString())} a {formatarData(endDate.toISOString())}
        </p>

        {loading ? (
          <p>Carregando...</p>
        ) : receitas.length > 0 ? (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Competência</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {receitas.map((receita) => (
                  <tr key={receita._id}>
                    <td>{formatarData(receita.dataRecebimento)}</td>
                    <td>
                      {receita.mes}/{receita.ano}
                    </td>
                    <td>
                      R${" "}
                      {receita.valor.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.buttonsContainer}>
              <button className={styles.button} onClick={handleVoltar}>
                Voltar
              </button>
              <button className={styles.button} onClick={handleEnviarEmail}>
                Enviar E-mail
              </button>
            </div>
          </>
        ) : (
          <p>Nenhuma receita encontrada para este período.</p>
        )}
      </div>
    </>
  );
}

export default ExtratoUsuario;