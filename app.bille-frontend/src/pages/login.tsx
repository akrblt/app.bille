import { FunctionComponent, useEffect, useState } from "react";
import UserConnexion from "../helpers/user-connexion";
import { useNavigate } from "react-router-dom";
import SetRequests from "../services/setters";

const Login: FunctionComponent = () => {
    const [login, setLogin] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [secondPassword, setSecondPassword] = useState<string>("")
    const [isTheMomentOfConfirmation, setIsTheMomentOfConfirmation] = useState<boolean>(false)
    const naviguate = useNavigate()

    useEffect(() => {
        if(UserConnexion.iAmConnected()) naviguate(`/calendar`)
    }, [])

    const handleSendCasualLogin = async () => {
        if(password === "" || login === "") return 
        const tryLogin = await UserConnexion.tryLogin(login, password)
        if(tryLogin === 'success_login'){
            window.alert("Bienvenue! N'hésites pas à t'inscrire à un maximum de shifts! ")
            naviguate(`/calendar`)
        }else if(tryLogin === `first_connexion_ok`) {
            setPassword("")
            setIsTheMomentOfConfirmation(true)
        }
        else{
            window.alert("Oups, données de connexion incorrect, contactez directement un résponsable bénévole en cas de perte des identifiants")
        }
    }
    const handleSendConfirmLogin = async () => {
            try{
                if(password === "" || secondPassword === "") throw new Error()
                const tryLogin = await UserConnexion.tryConfirmLogin(login, password, secondPassword)
                if(tryLogin === 'success_login'){
                    window.alert("Tu es officiellement inscrit, Merci à toi!")
                    naviguate(`/calendar`)
                }else throw new Error()
            }catch(error){
                window.alert("Oups, il y a eu un soucis, réesayez")
            }
        }
    return (
        <div id="login-page">
            <img src="./assets/img/bille.png" />
            {
            !isTheMomentOfConfirmation ? 
            <>
                <input 
                    type="text"
                    placeholder="Login"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                />
                <input 
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                /> 
                <button onClick={handleSendCasualLogin}>Valider</button>
            </> : <>
                <h4>Créer votre mot de passe personnel</h4>
                <input 
                    type="password"
                    placeholder="Nouveau mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                /> 
                <input 
                    type="password"
                    placeholder="Confirmation"
                    value={secondPassword}
                    onChange={(e) => setSecondPassword(e.target.value)}
                /> 
                <button onClick={handleSendConfirmLogin}>Valider</button>
            </> 
            }
        </div>
    )
}
export default Login