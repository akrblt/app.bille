import { FunctionComponent, useEffect, useState } from "react";
import Shift from "../../../../models/shifts";
import '../css/update-shift.css'
import UpdateShiftUsers from "./update-shift-users";
import SetRequests from "../../../../services/setters";

type Props = {
    shift: Shift
}
type ShiftedUser = {
    idSubscribe: number | null,
    idUser: number,
    username: string
}
const UpdateShift: FunctionComponent<Props> = ({ shift }) => {
    const [actualShift, setactualShift] = useState<Shift>(null!)

    useEffect(() => {
        //console.log("givenSHift ::: ", shift)
        setactualShift(shift)
    }, [])

    const handleChangeStartTime = async (newStartTime: string): Promise<void> =>{
        const updatedShift: Shift = await actualShift.changeStartTime(newStartTime)
        const srvUpdate = await updatedShift.sendUpdateToServer()
        if(srvUpdate) setactualShift(updatedShift)
        else window.alert("Oups, il y a eu un soucis")
    }
    const handleChangeEndTime = async (newEndTime: string): Promise<void> =>{
        const updatedShift: Shift = actualShift.changeEndTime(newEndTime)
        const srvUpdate = await updatedShift.sendUpdateToServer()
        if(srvUpdate) setactualShift(updatedShift)
        else window.alert("Oups, il y a eu un soucis")
    }
    const handleChangeMaxUsers = async (newMaxUsers: string): Promise<void> => {
        const updatedShift: Shift = actualShift.changeMaxUsers(newMaxUsers)
        const srvUpdate = await updatedShift.sendUpdateToServer()
        if(srvUpdate) setactualShift(updatedShift)
        else window.alert("Oups, il y a eu un soucis")
    }
    const handleAddUserToShift = async(givenUser: ShiftedUser): Promise<void> => {  
        const insertAction = await SetRequests.setUserToShift(actualShift.idShift, givenUser.idUser)
        if(!insertAction) return 
        const updatedShift: Shift | string = actualShift.addUser(givenUser)
        if(typeof updatedShift === 'string') window.alert(updatedShift)
        else setactualShift(updatedShift)
    }
    const handleRemoveUserFromShift = async (givenUser: ShiftedUser): Promise<void> => {
        const insertAction = await SetRequests.unSetUserToShift(givenUser.idUser, actualShift.idShift)
        if(!insertAction) return 
        const updatedShift: Shift = actualShift.removeUser(givenUser)
        setactualShift(updatedShift)
    }
    const handleDeleteShift = async (idShift: number) => {
        try{
            const req = await SetRequests.deleteShift(idShift)
            if(!req) throw new Error()
            window.alert("Le shift a bien été supprimé")
            window.location.reload()
        }catch(error){
            window.alert("Oups, il y a eu un soucis")
            window.location.reload()
        }
    }
    return (
        <div id="update-shift-content">
            {
                !actualShift ? null : 
                <>
                    <div className="title-shift">
                        <input type="time" id="startDate" value={actualShift.startTime} onChange={(e) => handleChangeStartTime(e.target.value)} />
                        <p>-</p>
                        <input type="time" id="endDate" value={actualShift.endTime} onChange={(e) => handleChangeEndTime(e.target.value)} />
                    </div>
                    <div id="container-maxUsers">
                        <label htmlFor="maxUsers">Bénévoles attendus</label>
                        <input type="number" id="maxUsers" value={actualShift.maxUsers > 0 ? actualShift.maxUsers : ''} onChange={(e) => handleChangeMaxUsers(e.target.value)} />
                    </div>
                    <UpdateShiftUsers 
                        handleAddUserToShift={handleAddUserToShift}  
                        handleRemoveUserFromShift={handleRemoveUserFromShift}
                        users={(actualShift.users.length <= 0) ? null : actualShift.users} 
                    /> 
                    <p className="delete-shift-bt" onClick={() => { handleDeleteShift(actualShift.idShift) }}>Supprimer Shift</p>
                </>           
            }
        </div>
    )
}
export default UpdateShift