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
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrorMessage("");
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    try {
      const res = await Api.post("/login", formData);

      if (res.data.error) {
        setErrorMessage("Credenciais inválidas");
        FlickerAlerts.showAlert({
          type: "danger",
          title: "Erro!",
          message: "Credenciais inválidas",
          position: "top-right",
          duration: 5000,
        });
      } else {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('usuario', res.data.usuario);
        const expirationTime = new Date().getTime() + 1000 * 60 * 30; // 30 minutos
        localStorage.setItem('tokenExpiration', expirationTime);
        alert(expirationTime)
        
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
      console.error("Erro ao fazer login:", error);
      setErrorMessage("Ocorreu um erro ao tentar fazer login. Tente novamente."); // Mensagem de erro mais clara
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
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      </div>
    </>
  );
}

export default Login;