import Header from '../../components/Header.jsx';
import Api from '../../services/Api.js';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { FlickerAlerts } from 'flicker-alerts';

import styles from "./styles.module.css";

function Cadastro() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleChange = (ev) => {
        const { name, value } = ev.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        
        try {
            const res = await Api.post('/register', formData);
            if (res.data.error === true) {
                FlickerAlerts.showAlert({
                    type: 'danger',
                    title: 'Erro!',
                    message: 'Email já está em uso',
                    position: 'top-right',
                    duration: 5000
                });
            } else {
                FlickerAlerts.showAlert({
                    type: 'success',
                    title: 'Sucesso!',
                    message: 'Operação realizada com sucesso',
                    position: 'top-right',
                    duration: 5000
                });
                setFormData({ name: '', email: '', password: '' }); // Limpar apenas se o cadastro for bem-sucedido
            }
        } catch (error) {
            console.log(error);
            FlickerAlerts.showAlert({
                type: 'danger',
                title: 'Erro!',
                message: 'Ocorreu um erro ao cadastrar. Tente novamente.',
                position: 'top-right',
                duration: 5000
            });
        }
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
            <h1>Cadastro</h1>
            <div>
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
                    <button type="submit">Salvar</button>
                </form>
            </div>
        </>
    );
}

export default Cadastro;