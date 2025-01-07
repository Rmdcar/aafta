import Header from '../../components/Header.jsx'

import { useState } from "react";

function Cadastro() {

    // Estado para armazenar os dados do formulário
    const [formData, setFormData] = useState({
        nome: '',
        email: ''
    });

    // Função para atualizar o estado com os valores do formulário
    const handleChange = (ev) => {
        const { name, value } = ev.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Função para tratar o envio do formulário
    const handleSubmit = (ev) => {
        ev.preventDefault();
        console.log(formData);
        setFormData({ nome: '', email: '' });
    };

    return (
        <>
            <Header/>
            <h1>Cadastro</h1>
            <div>
                <form onSubmit={handleSubmit}>
                    <label>
                        Nome
                        <input
                            type="text"
                            name="nome"
                            required
                            value={formData.nome}
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
                    <button type="submit">Salvar</button>
                </form>
            </div>
        </>
    );
}

export default Cadastro;
