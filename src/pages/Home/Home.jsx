import Header from '../../components/Header.jsx'
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

function Home(){
    const navigate = useNavigate();

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


    return(
        <>
  <Header/>
        <h1>Dashboard</h1>

        <div>
            <div>
                Receitas arrecadadas
            </div>
            <div>
                Despesas 
            </div>
            <div>
                Saldo em conta
            </div>
        </div>
        </>
    )
}


export default Home