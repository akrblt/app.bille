import { FunctionComponent, useEffect, useState } from "react";
import UserHandler from "../../models/user-handler";
import './css/user-form.css'
import SetRequests from "../../services/setters";

type Props = {
    user: UserHandler
}

const UserForm: FunctionComponent<Props> = ({ user }) => {
    const [referenceUser, setReferenceUser] = useState<UserHandler>(user.clone())
    const [updatedUser, setUpdatedUser] = useState<UserHandler>(user.clone())
    const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false)
    const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false)
    
    useEffect(() => {
        //console.log("user ::: ", user)
        setReferenceUser(user.clone())
        setUpdatedUser(user.clone())
    }, [user])

    const openDetails = () => {
        setIsDetailsOpen(true)
    }
    const closeDetails = () => {
        setIsDetailsOpen(false)
    }
    const openUpdate = () => {
        setIsUpdateOpen(true)
    }
    const cancelUpdate = () => {
        //console.log("reference user : ", referenceUser)
        setUpdatedUser(referenceUser)
        setIsUpdateOpen(false)
    }
    // ----------- update user -------------------------
    const changeName = (newName: string) => {
        const changedUser: UserHandler = updatedUser.withChanges({ firstname: newName })
        setUpdatedUser(changedUser)
    }
    const changeLogin = (newLogin: string) => {
        const formatedNewLogin: string = newLogin.replace(/\s+/g, ""); // suppression de tout les espaces
        const changedUser: UserHandler = updatedUser.withChanges({ login: formatedNewLogin })
        setUpdatedUser(changedUser)
    }
    const changeUserAdminLevel = (newValue: React.ChangeEvent<HTMLSelectElement>) => {
        const formatedValue: number = parseInt(newValue.target.value, 10)
        const changedUser: UserHandler = updatedUser.withChanges({ adminLevel: formatedValue })
        setUpdatedUser(changedUser)
    }
    const handleUpdateUser = async () => {
        try{
            //console.log("updatedUser : ", updatedUser)
            if(!updatedUser) throw new Error()
            const sendUpdate: boolean = await SetRequests.throwUserUpdate(updatedUser)
            const msg: string = sendUpdate ? "Utilisateur modifié avec succès" : "Oups, il y a eu un soucis."
            window.alert(msg)
            window.location.reload()
        }catch(error){
            window.alert("Oups, il y a eu un soucis.")
        }

    }
    const handleDeleteUser = async() => {
        try{
            if(!updatedUser.idUser) throw new Error()
            const deleteUser: string | null = await SetRequests.throwUserDelete(updatedUser.idUser)
            if(!deleteUser || deleteUser !== "utilisateurs désactivé avec succès") throw new Error()
            setReferenceUser(updatedUser)
            window.alert("Utilisateur supprimé avec succès")
            window.location.reload()
        }catch(error){
            window.alert("Oups, ca n'a pas fonctionné, réessayer plus tard")
            setUpdatedUser(referenceUser)
        }
    }
    const handleResetPassword = async () => {
        try{
            const resetUser: boolean = updatedUser.idUser ? await SetRequests.throwUserReset(updatedUser.idUser): false
            if(!resetUser) throw new Error()
            window.alert("Le mot de passe a été reinitialisé")
            window.location.reload()
        }catch(error){
            window.alert("Oups, il y a eu un soucis")
        }
    }
    return (
        <>
            <button 
                className="user-title" 
                onClick={openDetails}
                >{referenceUser.login}
            </button> 
            { !isDetailsOpen ? null : 
            <div id="user-form-container">
                <div id="container-close-user">
                    <button id="close-user" onClick={closeDetails}>X</button>
                </div>
                <label htmlFor="firstname">Nom complet</label>
                <input 
                    id="firstname"
                    className="user-field" 
                    value={updatedUser.firstname} 
                    disabled={!isUpdateOpen} 
                    onChange={(e) => changeName(e.target.value)}
                />
                <label htmlFor="login">Login</label>
                <input 
                    id="login" 
                    className="user-field"
                    value={updatedUser.login} 
                    disabled={!isUpdateOpen} 
                    onChange={(e) => changeLogin(e.target.value)}
                />
                <label htmlFor="adminLevel">Autorisation</label>
                <select 
                    id="adminLevel" 
                    className="user-field"
                    value={updatedUser.adminLevel} 
                    onChange={(e) => changeUserAdminLevel(e)}
                    disabled={!isUpdateOpen}
                    >
                    <option value="1">Résponsable bénévole</option>
                    <option value="2">Résponsable prog</option>
                    <option value="3">Bénévole</option>
                </select>
                { !user.isAlreadyConnected ? 
                    <>
                        <label htmlFor="passwordConnexion">Mot de passe par défaut</label>
                        <input 
                            id="passwordConnexion" 
                            className="user-field"
                            value={ updatedUser.passwordConnexion ?? "" } 
                            disabled
                        />
                    </> : null
                }
                { !isUpdateOpen ? <div className="user-bt"><button onClick={openUpdate}>Modifier</button></div> : null }
                { !isUpdateOpen ? <div className="user-bt"><button onClick={handleDeleteUser}>Supprimer</button></div> : null }
                { user.isAlreadyConnected && !isUpdateOpen ? <div className="user-bt"><button onClick={handleResetPassword}>Reset le mot de passe</button></div> : null }
                { isUpdateOpen ? 
                <div id="confirm-zone">                
                    <button onClick={cancelUpdate}>Annuler</button>
                    <button onClick={handleUpdateUser}>Confirmer</button> 
                </div> 
                : null }
            </div> }
        </>
    )
}
export default UserForm