import { FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShowHandler from "../../../models/show";
import SetRequests from "../../../services/setters";
import UpdateStatus from "./update-status";
import UpdateResponsable from "./update-responsable";
import UpdateNotes from "./update-notes";
import './css/update-show.css'

type Props = {
    givenShow: ShowHandler
}

const UpdateShow: FunctionComponent<Props> = ({ givenShow }) => {   
    const [showInfos, setShowInfos] = useState<ShowHandler>(null!)
    const naviguate = useNavigate()

    useEffect(() => {
        setShowInfos(givenShow)
    }, [])

    useEffect(() => {
        setShowInfos(givenShow)
    }, [givenShow])

    
    const handleChangeStatus = (newStatus: string): void => {
        const showUpdated: ShowHandler = showInfos.changeStatus(newStatus)
        setShowInfos(showUpdated)
    }
    const handleChangeResponsable = async(newResponsable: number | null) => {
        const showUpdated: ShowHandler = await showInfos.changeResponsable(newResponsable)
        setShowInfos(showUpdated)
    }
    const handleChangeNotes = (newNotes: string | null): void => {
        const showUpdated: ShowHandler = showInfos.changeNotes(newNotes)
        setShowInfos(showUpdated)
    }
    const handleConfirmModification = async ()=> {
        try{
            const updateShow: any = await SetRequests.updateShow(showInfos)
            if(!updateShow || updateShow.msg !== 'success')  throw new Error()
            window.alert("modifications effectuées avec succès")
            naviguate(`/calendar/details/${showInfos.laBilleShowId}`)
        }catch(error){
            ////console.log(error)
            window.alert("Oups, quelque chose s'est mal passé :S")
        }
    }

    return (
        <>{
            !showInfos ? null : 
            <> 
                <p id="warning-message">⚠️ Attention, changer le status NE CHANGERA PAS les shifts.⚠️</p>               
                { /* Status => <select> */ }
                <UpdateStatus status={showInfos.status} handleChangeStatus={handleChangeStatus} />
                { /* résponsable => <select> */ }
                { 
                    showInfos.status !== 'soiree' ? null :                 
                    <>
                        <UpdateResponsable responsable={showInfos.showResponsable} handleChangeResponsable={handleChangeResponsable} />
                    </>
                }
                {
                    <UpdateNotes notes={showInfos.notes} handleChangeNotes={handleChangeNotes} status={showInfos.status} /> 
                }
                <div id="confirm-show-update">
                    <button onClick={handleConfirmModification} id="confirm-bt-show">Confirmer modifications</button>
                </div>
            </>
        }</>
    )
}
export default UpdateShow