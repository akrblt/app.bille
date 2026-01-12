import { FunctionComponent, useEffect, useRef, useState } from "react";
import '../css/update-shift-users.css'
import GetRequests from "../../../../services/getters";

type ShiftedUser = {
    idSubscribe: number | null,
    idUser: number,
    username: string
}
type User = {
    idUser: number,
    username: string    
}
type ListedUser = {
    idUser: number,
    firstname: string
}
type Props = {
    users: ShiftedUser[] | null,
    handleAddUserToShift: (user: ShiftedUser) => void,
    handleRemoveUserFromShift: (user: ShiftedUser) => void
}
const UpdateShiftUsers: FunctionComponent<Props> = ({ users, handleAddUserToShift, handleRemoveUserFromShift }) => {
    const [usersShifted, setUserShifted] = useState<ShiftedUser[] | null>(null)
    const [userList, setUserList] = useState<ListedUser[]>([])
    const [userToAdd, setUserToAdd] = useState<ShiftedUser | null>(null)

    useEffect(() => {
        const getAllUsers = async () => {        
            const listOfUser: any = await GetRequests.getUserList()         
            ////console.log("LIST OF USER ::: ", listOfUser)
            setUserList(listOfUser)
        }
        getAllUsers()
        setUserShifted(users)
    }, [users])
    
    const selectUserToAdd = (e: React.ChangeEvent<HTMLSelectElement>) => {
        try{
            const targetUserId: number = parseInt(e.target.value)
            const targetUser: ListedUser | undefined = userList.find((user) => user.idUser === targetUserId)
            if(!targetUserId || !targetUser?.firstname) throw new Error()
            const newUserToAdd: ShiftedUser = {
                idSubscribe: null,
                idUser: targetUserId, 
                username: targetUser.firstname
            }
            setUserToAdd(newUserToAdd)
        }catch(err){
            setUserToAdd(null)
        }
    }   
    const removeUser = (givenUser: ShiftedUser): void => {
        handleRemoveUserFromShift(givenUser)
    }
    const addUser = (givenUser: ShiftedUser | null): void => {  
        if(!givenUser) window.alert("Personne n'a été séléctionné")
        else handleAddUserToShift(givenUser)
    }

    return(
        <>
            <div id="shifted-users">
                {
                    !usersShifted ? 'Personne' :
                    usersShifted.map((user: ShiftedUser, index: number) => {
                        return (
                            <div className="user-capsule" key={index}>
                                <p> { user.username } </p>
                                <button onClick={() => removeUser({idSubscribe: null, idUser: user.idUser, username: user.username})}>X</button>
                            </div>
                        )
                    })
                }
            </div>
            <div className="add-user-form">
                <div className="subscribe-benevole">
                    <select className="select-add-user" value={!userToAdd ? "" : userToAdd.idUser} onChange={selectUserToAdd}>
                        <option value="">-</option>
                        {
                            userList.map((user: ListedUser, index: number) => {
                                ////console.log("user ::: ", user)
                                return <option value={user.idUser} key={index}>{user.firstname}</option>
                            })
                        }
                    </select>  
                    <button onClick={() => addUser(userToAdd)}>inscrire</button>                
                </div>
            </div>
        </>
    )
}
export default UpdateShiftUsers