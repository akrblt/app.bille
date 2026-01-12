import { FunctionComponent, useEffect, useRef, useState } from "react";
import UserHandler from "../../models/user-handler";
import './css/creat-user.css'
import { Setter } from "date-fns/parse/_lib/Setter";
import SetRequests from "../../services/setters";
import { useNavigate } from "react-router-dom";

type Props = {
    handleCloseCreateUser: () => void
}

const CreateUser: FunctionComponent<Props> = ({ handleCloseCreateUser }) => {
    const [newUser, setNewUser] = useState<UserHandler>(new UserHandler(null, "", "", 3, false, null))

    const changeName = (newName: string) => {
        const update: UserHandler = newUser.withChanges({ firstname: newName})
        setNewUser(update)
    }
    const changeLogin = (newLogin: string) => {
        const formatedNewLogin: string = newLogin.replace(/\s+/g, ""); // suppression de tout les espaces
        const update: UserHandler = newUser.withChanges({ login: formatedNewLogin})
        setNewUser(update)
    }
    const changeAdminLevel = (newLevel: number) => {
        const update: UserHandler = newUser.withChanges({ adminLevel: newLevel})
        setNewUser(update)
    }
    const sendCreateUser = async() => {
        try{
            //console.log("create ! ", newUser)
            if(!newUser.firstname || !newUser.login || !newUser.adminLevel) throw new Error()
            const sendInsertion: string = await SetRequests.createUser(newUser)
            window.alert(sendInsertion)
            if(sendInsertion === 'Utilisateur créé avec succès') window.location.reload()
        }catch(err){
            window.alert("Oups, il y a eu un soucis")
        }
    }
    return (
        <>
            <div id="create-user-form">      
                <h5>Créer nouvel utilisateur</h5>
                <label htmlFor="firstname">Nom complet</label>
                <input 
                    id="firstname"
                    className="user-field" 
                    placeholder="John Smith..."
                    value={newUser.firstname} 
                    onChange={ (e) => changeName(e.target.value) }
                />
                <label htmlFor="login">Login</label>
                <input 
                    id="login" 
                    className="user-field"
                    placeholder="Doit être en un mot & unique"
                    value={newUser.login} 
                    onChange={(e) => changeLogin(e.target.value)}
                />
                <label htmlFor="adminLevel">Autorisation</label>
                <select 
                    id="adminLevel" 
                    className="user-field"
                    value={newUser.adminLevel} 
                    onChange={(e) => changeAdminLevel(parseInt(e.target.value, 10))}
                    >
                    <option value="1">Résponsable bénévole</option>
                    <option value="2">Résponsable prog</option>
                    <option value="3">Bénévole</option>
                </select>
                <div id="bt-zone">
                    <button onClick={handleCloseCreateUser}>Annuler</button>
                    <button onClick={sendCreateUser}>Confirmer</button>
                </div>
            </div>
        </>
    )
}
export default CreateUser