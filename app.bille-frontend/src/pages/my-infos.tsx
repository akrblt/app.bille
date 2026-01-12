import { FunctionComponent, useEffect, useState } from "react";
import GetRequests from "../services/getters";
import UserConnexion from "../helpers/user-connexion";
import MonthGestion from "../helpers/month-gestion";
import { useNavigate } from "react-router-dom";
import './css/myInfos.css'

type ShiftInfos = {
    date: string,
    laBilleShowId: number,
    shifts: any[]
}

const MyInfos: FunctionComponent = () => {
    const [shiftsInfos, setShiftInfos] = useState<ShiftInfos[] | null>(null)
    const naviguate = useNavigate()

    useEffect(() => {
        if(!UserConnexion.iAmConnected()) naviguate(`/login`)
        const loadShiftsInfos = async () => {
            const myId = (UserConnexion.getUserData()).idUser
            const myShiftsInfos: ShiftInfos[] | null = await GetRequests.getMyInfos(myId)
            //console.log("myInfos : ", myShiftsInfos)
            myShiftsInfos ? setShiftInfos(myShiftsInfos) : setShiftInfos(null)
        }
        loadShiftsInfos()
    }, [])

    const handleGoToDetails = (idShow: number) => {
        naviguate(`/calendar/details/${idShow}`)
    }
    
    return (
        <>
            <h5>Mes infos</h5>
            <div id="capsule-container">
                { shiftsInfos ? shiftsInfos.map((info: ShiftInfos) => (
                    <div className="info-userShifts-container" key={info.laBilleShowId}>
                        <p className="date-label">{ MonthGestion.getCompletDateLabel(new Date(info.date)) }</p>           
                        {info.shifts.map((shift: any) => (
                            <div className="shift-capsule-user" key={shift.idShift}>
                                <p>{shift.type} :</p>
                                <p className="capsule-time">{shift.startTime} - {shift.endTime}</p>
                            </div>
                        ))}               
                        <p className="link-toDetails" onClick={() => handleGoToDetails(info.laBilleShowId)}>Détails</p>
                    </div>
                )) : <p>Vous n'êtes inscrit à aucun shift</p>}
            </div>
        </>
    )

}
export default MyInfos