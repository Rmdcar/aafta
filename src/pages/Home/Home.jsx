import Header from "../../components/header"

function Home(){
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