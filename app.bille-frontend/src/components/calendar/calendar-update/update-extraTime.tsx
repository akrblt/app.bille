import { get } from "http";
import { FunctionComponent, useEffect, useState } from "react";
import GetRequests from "../../../services/getters";
import SetRequests from "../../../services/setters";

type ExtraTime = {
    idExtraTime: number | null, 
    idUser: number, 
    firstname: string, 
    type: string
}
type ListedUser = {
    idUser: number,
    firstname: string
}
type Props = {
    extraTimes: ExtraTime[],
    idShow: number
}

const UpdateExtraTime: FunctionComponent<Props> = ({ extraTimes }) => {
    const [userList, setUserList] = useState<ListedUser[]>([])
    const [usersShifted, setUserShifted] = useState<ExtraTime[]>([])
    const [userToAdd, setUserToAdd] = useState<ListedUser | null>(null)
    useEffect(() => {
        const getAllUsers = async () => {        
            const listOfUser: any = await GetRequests.getUserList()    
            setUserList(listOfUser)
        }
        getAllUsers()
        setUserShifted(extraTimes)
    }, [])

    const HandleRemoveUser = async (idExtraTime: number | null) => {
        if(!idExtraTime){
            window.alert("Oups, il y a eu une erreur réessayez.")
            window.location.reload()
            return
        }
        const sendDelete: boolean = await SetRequests.unSetUserToExtraTime(idExtraTime)
        const msg = sendDelete ? "Utilisateur supprimé avec succès" : "Oups il y a eu un soucis, veuillez réessayer plus tard"
        if(sendDelete){
            const shifted: ExtraTime[] = usersShifted.filter((user: ExtraTime) => user.idExtraTime === idExtraTime)
            setUserShifted(shifted)
            window.location.reload()
        }

        window.alert(msg)
    }
    const handleAddUser = async (idUser: number, firstname: string,  idShow: number, type: string) => {
        const sendReq: boolean = await SetRequests.setUserToExtraTime(idUser, idShow, type)
        const msg = sendReq ? "utilisateurinscrit avec succès" : "Oup, il y a eu un soucis, réessayez plus tard"
        if(sendReq){
            setUserShifted(prev => [...(prev ?? []), {
                idExtraTime: null,
                idUser: idUser,
                firstname: firstname,
                type: type
            }]);
        }
        window.alert(msg)
    }

    return (
        <>
            <div id="shifted-users">
                {
                    !usersShifted ? 'Personne' :
                    usersShifted.map((user: ExtraTime, index: number) => {
                        return (<>
                            {
                                user.idExtraTime ? null :<div className="user-capsule" key={index}>
                                <p> { user.firstname } </p>
                                <button onClick={() => HandleRemoveUser(user.idExtraTime)}>X</button>
                            </div>
                            }
                        </>)
                    })
                }
            </div>
            {/*<div className="add-user-form">
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
                    <button onClick={() => handleAddUser(userToAdd)}>inscrire</button>                
                </div>
            </div>*/}
        </>
    )
}
export default UpdateExtraTime