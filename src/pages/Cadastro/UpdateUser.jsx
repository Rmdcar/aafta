import Header from "../../components/Header.jsx";
import Api from "../../services/Api.js";
import { useNavigate, useLocation } from "react-router-dom"; // Importe useLocation
import { useState, useEffect } from "react";
import { FlickerAlerts, FlickerModals } from "flicker-alerts"; // Importe FlickerModals

import styles from "./styles.module.css";

function UpdateUser() {
  const navigate = useNavigate();
  const location = useLocation(); // Use o hook useLocation
  const user = location.state.user; // Acesse os dados do usuário passados via navegação
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: "",
  });

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    try {
      FlickerModals.showModal({
        type: 'confirm',
        title: 'Confirmação',
        message: 'Deseja realmente atualizar este usuário?',
        onConfirm: async () => {
          try {
            const res = await Api.patch(`/update/${user._id}`, formData); // Use o ID do usuário na URL
            if (res.data.error === true) {
              FlickerAlerts.showAlert({
                type: "danger",
                title: "Erro!",
                message: "Email já está em uso",
                position: "top-right",
                duration: 5000,
              });
            } else {
              navigate("/usuarios");
              FlickerAlerts.showAlert({
                type: "success",
                title: "Sucesso!",
                message: "Usuário atualizado com sucesso",
                position: "top-right",
                duration: 5000,
              });
            }
          } catch (error) {
            console.log("Erro na requisição PATCH:", error); // Log do erro
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
    } catch (error) {
      console.log("Erro ao abrir o modal:", error); // Log do erro ao abrir o modal
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const tokenExpiration = localStorage.getItem("tokenExpiration");
    const currentTime = new Date().getTime();

    if (!token || (tokenExpiration && currentTime > Number(tokenExpiration))) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <Header />
      <div>
        <h1>Editar Cadastro</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Nome
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </label>
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
          <button type="submit">Atualizar</button>
        </form>
      </div>
    </>
  );
}

export default UpdateUser;
