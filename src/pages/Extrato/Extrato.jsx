import Header from '../../components/Header.jsx'

import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

function Extrato(){
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
        <h1>Extrato</h1>
        </>
    )
}


export default Extrato