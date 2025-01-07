import Api from "../../services/Api.js";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FlickerAlerts } from "flicker-alerts";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate()

  // Função para atualizar o estado com os valores do formulário
  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Função para tratar o envio do formulário
  const handleSubmit = async (ev) => {
    ev.preventDefault();

    try {
      const res = await Api.post("/login", formData);
      if (res.data.error === true) {
        FlickerAlerts.showAlert({
          type: "danger",
          title: "Erro!",
          message: "Credenciais invalidas",
          position: "top-right",
          duration: 5000,
        });
      } else {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('usuario', res.data.usuario)
        const expirationTime = new Date().getTime() + 1000*100
        localStorage.setItem('tokenExpiration', expirationTime);
        navigate('/home')
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
      console.log(error);
      setFormData({ email: "", password: "" });
    }
  };

  return (
    <>
      <div>
        <h1>
          ASSOCIACAO DOS AUDITORES FISCAIS DE TRIBUTOS MUNICIPAIS DE ANAPOLIS -
          AAFTA
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
      </div>
    </>
  );
}

export default Login;
