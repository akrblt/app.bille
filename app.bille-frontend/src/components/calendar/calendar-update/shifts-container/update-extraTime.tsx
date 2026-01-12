import { FunctionComponent, useEffect, useState } from "react";
import './css/update-add-shift.css'
import SetRequests from "../../../../services/setters";
import { id } from "date-fns/locale";
import GetRequests from "../../../../services/getters";

type Sub = {
    idExtraTime: number,
    firstname: string,
    idUser: number,
    type: string
}
type ListedUser = {
    idUser: number,
    firstname: string
}
type Props = {
    type: string,
    subscribtions: Sub[],
    idShow: number
}
type ShiftedUser = {
    idSubscribe: number | null,
    idUser: number,
    username: string
}
const UpdateExtraTime: FunctionComponent<Props> = ({ type, subscribtions, idShow }) => {
    const [typeOfExtra, setTypeOfExtra] = useState<string>(type)
    const [userSubscribtions, setUserSubscribtions] = useState<Sub[]>(subscribtions)
    const [userList, setUserList] = useState<ListedUser[]>([])
    const [userToAdd, setUserToAdd] = useState<ShiftedUser | null>(null)

    useEffect(() => {
        const setAllUsers = async () => {        
            const listOfUser: any = await GetRequests.getUserList()         
            ////console.log("LIST OF USER ::: ", listOfUser)
            setUserList(listOfUser)
        }
        setAllUsers()
    }, [])

    const handleDeleteUserFromExtra = async (idExtratime: number) => {
        try{       
            const req = await SetRequests.unSetUserToExtraTime(idExtratime)
            if(!req) throw new Error()
            window.alert(`Le bénévole a été supprimé de cette ${type}`)
            window.location.reload()
        }catch(error){
            window.alert("Oups, il y a eu un soucis")
        }
    }
    const handleSubscribeUser = async (idUser: number) => {
        try{
            const req = await SetRequests.setUserToExtraTime(idUser, idShow, formatType())
            if(!req) throw new Error()
            window.alert(`Le bénévole a bien été inscrit à cette ${type}`)
            window.location.reload()
        }catch(error){
            window.alert('Oups, il y a eu un problème')
        }
    }
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
    const formatType = () => {
        if(type === 'Ouverture') return 'opening'
        if(type === 'Fermeture') return 'closure'
        else return "-"
    }
    return(
        <>
            <h5 id="extra-title-update">{ type }</h5>
            <div id="user-extratime-update">
                {
                    userSubscribtions.map((sub: Sub, index: number) => {
                        return (
                            <div className="usr-extra" key={index}>
                                <p className="x" onClick={() => handleDeleteUserFromExtra(sub.idExtraTime)}>X</p>
                                <p>{ sub.firstname }</p>
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
                    <button onClick={() => userToAdd ? handleSubscribeUser(userToAdd.idUser) : null}>inscrire</button>                
                </div>
            </div>
        </>
    )
}
export default UpdateExtraTime