import Header from '../../components/Header.jsx'

import { useState } from "react";
function Receita(){


    // Estado para armazenar os dados do formulário
    const [formData, setFormData] = useState({
        nome: '',
        mes: '' , 
        ano: '' ,
        data: ''     
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
        setFormData({ nome: '', mes: '', ano: '', data: ''});
    };


    return(
        <>
         <Header/>
        <h1>Receita</h1>
        <form onSubmit={handleSubmit}>
                    <div>
                    <label>Nome</label>
            <select
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            >
              <option value="">SELECIONE</option>
              <option value="Renato">Renato</option>

            </select>
                    </div>

                    <div>
                    <label>Mês</label>
            <select
              name="mes"
              value={formData.mes}
              onChange={handleChange}
              required
            >
              <option value="">SELECIONE</option>
              <option value="01">Janeiro</option>
              <option value="02">Fevereiro</option>
              <option value="03">Março</option>
              <option value="04">Abril</option>
              <option value="05">Maio</option>
              <option value="06">Junho</option>
              <option value="07">Julho</option>
              <option value="08">Agosto</option>
              <option value="09">Setembro</option>
              <option value="10">Outubro</option>
              <option value="11">Novembro</option>
              <option value="11">Dezembro</option>
            </select>
                    </div>

                    <div>
                    <label>Ano</label>
            <select
              name="ano"
              value={formData.ano}
              onChange={handleChange}
              required
            >
              <option value="">SELECIONE</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
              <option value="2029">2029</option>
              <option value="2030">2030</option>
              <option value="2031">2031</option>
              <option value="2032">2032</option>
              <option value="2033">2033</option>
              <option value="2034">2034</option>
              <option value="2035">2035</option>
            </select>
                    </div>


                    <div>
                    <label>Data de recebimento</label>
            <input
            type='date'
              name="data"
              value={formData.data}
              onChange={handleChange}
              required
            >
       
            </input>
                    </div>
                    
                   
                    
                    <button type="submit">Salvar</button>
                </form>
        </>
    )
}


export default Receita