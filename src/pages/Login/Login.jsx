import Api from "../../services/Api.js";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FlickerAlerts } from "flicker-alerts";
import styles from "./styles.module.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // Estado para armazenar a mensagem de erro
  const navigate = useNavigate();

  // Função para atualizar o estado com os valores do formulário
  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrorMessage(""); // Limpa a mensagem de erro ao digitar
  };

  // Função para tratar o envio do formulário
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    

    try {
      const res = await Api.post("/login", formData);
      

      if (res.data.error === true) {
        setErrorMessage("Credenciais inválidas"); // Armazena a mensagem de erro
        FlickerAlerts.showAlert({
          type: "danger",
          title: "Erro!",
          message: "Credenciais inválidas",
          position: "top-right",
          duration: 5000,
        });
      } else {
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('usuario', res.data.usuario);
        const expirationTime = new Date().getTime() + 1000 * 60 * 30; // 30 minutos
        sessionStorage.setItem('tokenExpiration', expirationTime);
        navigate('/home');
        FlickerAlerts.showAlert({
          type: "success",
          title: "Sucesso!",
          message: "Usuário logado!!!",
          position: "top-right",
          duration: 5000,
        });
      }
      setFormData({ email: "", password: "" });
    } catch (error) {
      console.error("Erro ao fazer login:", error); // Log do erro
      setErrorMessage(`${error} Ocorreu um erro ao tentar fazer login. Tente novamente.`); // Armazena a mensagem de erro
      setFormData({ email: "", password: "" });
    }
  };

  return (
    <>
      <div className={styles.title}>
        <h1>
          ASSOCIAÇÃO DOS AUDITORES <br />FISCAIS DE TRIBUTOS MUNICIPAIS DE<br /> ANÁPOLIS - AAFTA
        </h1>
      </div>

      <div>
        <form onSubmit={handleSubmit}>
          <br />
          <label>
            E-mail
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Senha
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Logar</button>
        </form>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>} {/* Renderiza a mensagem de erro */}
      </div>
    </>
  );
}

export default Login;