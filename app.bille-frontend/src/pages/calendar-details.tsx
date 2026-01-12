import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ShowHandler from '../models/show'
import GetRequests from '../services/getters';
import StatusZone from '../components/calendar/calendar-detail2/zone-status';
import './css/calendar-details.css';
import ResponsableZone from '../components/calendar/calendar-detail2/zone-responsable';
import Notes from '../components/calendar/calendar-detail2/notes-zone';
import ShiftsContainer from '../components/calendar/calendar-detail2/shifts-container/shifts-container';
import ExtraTimeZone from '../components/calendar/calendar-detail2/zone-extraTime';
import UserConnexion from '../helpers/user-connexion';
type ExtraTime = {
    idExtraTime: number | null, 
    idUser: number, 
    firstname: string, 
    type: string
}
type User = {
    idUser: number,
    firstname: string
}

const CalendarDetails: FunctionComponent = () => {
    const { idShow } = useParams<{ idShow: string }>();
    const [showInfos, setShowInfos] = useState<ShowHandler>(null!)
    const naviguate = useNavigate()
    useEffect(() => {
        if(!UserConnexion.iAmConnected()) naviguate(`/login`)
    }, [])
    useEffect(() => {
        setInfos()
    }, [idShow])
    
    useEffect(() => {
        //console.log("showInfos : ", showInfos)
    }, [showInfos])
    
    const setInfos = async() => {
        try{
            if(!idShow) throw new Error()
            const formatedId: number = parseInt(idShow) 
            //console.log("formatedId :::", formatedId)
            const dataOfShow: ShowHandler = await getShowInfos(formatedId)  
            //console.log("dataOfShow : ", dataOfShow)
            const show: ShowHandler = dataOfShow.formatedShow()
            if(dataOfShow) setShowInfos(show)
            else throw new Error()
        }catch(err){
            //console.log("erreur getShowInfos : ", err)
        } 
    }

    const getShowInfos = async (idShow: number): Promise<ShowHandler> => {
        const rawData: ShowHandler | null = await GetRequests.getDateInfos(idShow)
        //console.log("rawData : ", rawData)
        if (!rawData) throw new Error("Aucune donnée reçue")
        return rawData
    }
    const handleCloseDetails = () => {
        naviguate(`/calendar`)
    }
    const handleGoToUpdate = () => {
        naviguate(`/calendar/update/${showInfos.laBilleShowId}`)
    }
    const handleChangeResponsable = async (newResponsable: number | null) =>{
        const updatedShow: ShowHandler = await showInfos.changeResponsable(newResponsable)
        setShowInfos(updatedShow)
        window.alert("Tu es inscrit comme résponsable de soirée ! Merci à toi :)")
    }
    const handleAddUserToExtraTime = async (newTime: ExtraTime, type: string): Promise<void> => {
        try{
            if(!idShow) throw new Error()
            const updatedShow: ShowHandler | null = await showInfos.addUserToExtraTimes(newTime, showInfos.laBilleShowId, type)
            if(!updatedShow) throw new Error()
            setShowInfos(updatedShow)
            window.alert("Merci pour ta participation, n'oublies pas de venir un peu à l'avance.")
        }catch(err){
            window.alert("Oups, il y a eu un problème, veuillez réessayer plus tard")
        }
    }

    return (
        !showInfos ? null : 
        <div id='CalendarDetails'>
            <div id="header-details-buttons">       
                { UserConnexion.myAdminLevel() <= 2 ? <button id='bt-goTo-update' onClick={handleGoToUpdate}>🛠️</button> : null }
                <button onClick={handleCloseDetails} className="close-update-bt">X</button>
            </div>
            { /* Title => "Vendredi 9 Janvier2025" */ }
            <div className='title1'>{ showInfos ? showInfos.formatDateLabel() : '...' }</div> 
            <div className='statusAndHoraires'>
                { /* Status => "Fermé, Bar ouvert etc..." */ }
                <div className='label-sub white'><StatusZone status={showInfos.status} /></div>
                { /* horaires" */ }
                <div className='label-sub orange'>{ showInfos ? showInfos.formatHoraires() : null }</div>
            </div>
            { (showInfos && showInfos.status !== 'soiree') ? null :
                <ResponsableZone idShow={showInfos.laBilleShowId} responsableId={showInfos.showResponsable} handleChangeResponsable={handleChangeResponsable}/>  
            }{
                showInfos && <Notes showNotes={showInfos.notes} status={showInfos.status} />
            }{
                <>           
                    { 
                        (showInfos.status === 'ferme' || showInfos.status === 'reunion') ? null : 
                        <ExtraTimeZone type="opening" idShow={showInfos.laBilleShowId} times={showInfos.extraTimes} /> 
                    }
                    <ShiftsContainer idShow={ showInfos.laBilleShowId } />
                    { 
                        (showInfos.status === 'ferme' || showInfos.status === 'reunion') ? null :
                        <ExtraTimeZone type="closure" idShow={showInfos.laBilleShowId} times={showInfos.extraTimes} /> 
                    }
                </>
            }
        </div>
    )
}
export default CalendarDetails