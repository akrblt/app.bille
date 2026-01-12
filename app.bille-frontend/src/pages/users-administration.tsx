import { FunctionComponent, useEffect, useState } from "react";
import UserHandler from "../models/user-handler";
import GetRequests from "../services/getters";
import UserForm from "../components/user-administration/user-form";
import './css/user-administration.css';
import CreateUser from "../components/user-administration/create-user";
import UserConnexion from "../helpers/user-connexion";
import { useNavigate } from "react-router-dom";

const UserAdministration: FunctionComponent = () => {
    const [userList, setUserList] = useState<UserHandler[]>([])
    const [creatUserFormOpen, setCreatUserFormOpen] = useState<boolean>(false)
    const naviguate = useNavigate()

    useEffect(() => {
        if(!UserConnexion.iAmConnected()) naviguate(`/login`)
        if(UserConnexion.myAdminLevel() >= 3) naviguate(`/calendar`)
        const setUsers = async () => {
            const users: UserHandler[] = await GetRequests.getAllUsers()
            setUserList(users)
        }
        setUsers()
    }, [])
    
    const handleCloseCreateUser = () => {
        setCreatUserFormOpen(false)
    }

    return (
        <div id="user-admin-all">
            <div id="menu">
                { !creatUserFormOpen ? <button onClick={() => setCreatUserFormOpen(true)}>Créer un nouvel utilisateurs</button> : null }
                { creatUserFormOpen ? <CreateUser handleCloseCreateUser={handleCloseCreateUser} /> : null }
            </div>                    
            <div id="users-container">
                {
                    userList.map((user: UserHandler, index: number) => {
                        if(user.login !== 'admin') return <UserForm user={user} key={index} />
                    })
                }                   
            </div>               
        </div>
    )
}
export default UserAdministration