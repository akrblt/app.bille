import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Show from '../../../models/show'
import GetRequests from '../../../services/getters';
import MonthGestion from '../../../helpers/month-gestion';
import Shift from '../../../models/shifts';
//import CalendarShifts from './calendar-detail-shifts';
import UpdateCalendarDetails from './calendar-detail-update';
import './calendar-detail-layout.css'
import UserConnexion from '../../../helpers/user-connexion';
import SetRequests from '../../../services/setters';

type ExtraTimes = {
    idExtraTime: number,
    fkUser: number,
    fkLaBilleShow: number,
    type: string
}
type User = {
    idUser: number,
    firstname: string
}
//<input id='title' type='text' value={idShow} />
const CalendarDetails2: FunctionComponent = () => {
    const { idShow } = useParams<{ idShow: string }>();
    const idShowNumber = Number(idShow); 
    const [statusPage, setStatusPage] = useState<string>('read') // read | update
    const [showInfos, setShowInfos] = useState<Show>(null!)
    const userList = useRef<User[]>(null!)
    const [data, setData] = useState<number>(0) // listen subscribtion for reload
    const [reload, setReload] = useState<boolean>(false)
    const [extraTimes, setExtraTimes] = useState()
    // update showInfos when props idShow change
    useEffect(() => {
        const getDataInfos = async () => {  
            const newData: Show | null = await GetRequests.getDateInfos(idShowNumber!)  
            ////console.log("DATA ::: ", newData)      
            if(newData) setShowInfos(newData)
        }
        getDataInfos()      
    }, [idShowNumber, data, reload])

    //get list of user for responsable
    useEffect(() => { 
            const updateUserList = async () => {
                userList.current = await GetRequests.getUserList()         
            }
            updateUserList()
        }, [])// [updatedShow.status])
    
    // ---------------------- switch read / update --------------------------
    const handleOpenUpdate = () => {
        setStatusPage('update')
    }
    const handleCloseUpdate = () => {
        setStatusPage('read')   
        setReload(!reload)
    }
    // check if actual show is a normal or soiree => true sinon false
    const isShowOpen = () => {
        return (showInfos && (showInfos.status === 'soiree' || showInfos.status === 'normale'))
    }
    // ---------------------------------------------------------------------------------------------------------------
    // ------------------------------------ display data for 'read' mode ---------------------------------------------
    // ---------------------------------------------------------------------------------------------------------------
    const displayStatus = () => {
        const determinedStatus = showInfos.status === 'normale' ? 'Bar ouvert !' : showInfos.status
        return (
            <p className='stickerBlue'>
                { showInfos ? determinedStatus : null }
            </p>
        )
    }
    const displayHoraires = (horaires: string) => {
        if(!isShowOpen()) return;
        else return (<p className='stickerBlue'> { horaires } </p>)
    }
    const displayResponsable = () => {
        if(showInfos && showInfos.status !== 'soiree') return
        else return (
            <>
                <h5 className="responsable_title">Résponsable</h5>
                <div>
                    {   /* Nom du responsable */
                        showInfos && showInfos.showResponsable && userList.current ? 
                        <p key={0} className='user_responsable'>{ userList.current.map((user: User) => { if(user.idUser === showInfos.showResponsable) return user.firstname })}</p> 
                        : <p key={1} className='user_responsable'>Personne :(</p>
                    }
                    {
                        /* boutons s'inscrire / Désinscrire */
                        showInfos && !showInfos.showResponsable ? <button onClick={() => handleResponsableChange('subcribtion')}>S'inscrire</button>
                        : null
                        /*showInfos && showInfos.showResponsable === UserConnexion.getUserData().idUser ? <button onClick={() => handleResponsableChange('unSubcribtion')}>Se désinscrire</button>
                        : null*/
                    }
                </div>
            </>           
        )
    }
    // ---------------------------------------------------------------------------------------------------------------
    // ------------------------------------ opening and closure ------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------------
    const displayExtraTime = (type: string) => {
        const isUserIn = false
        const times = showInfos.getExtraTimesOfType(type)
        return (
            <div id='extraTimes_container'>
                {   // title
                    type === 'opening' ? <h5>Ouverture</h5> 
                    : type === 'closure' ? <h5>Fermeture</h5>
                    : null
                }
                {   // users
                    times ? times.map((user: User, index: number) => {
                        return <p key={index}>{ user.firstname }</p>
                    }) : null
                }
                {   // buttons
                    !isUserIn ? <button onClick={() => handleExtraTimeSubscribtion(null, type, 'add')}>S'inscrire</button> 
                    : isUserIn ? <button onClick={() => handleExtraTimeSubscribtion(times[0].idExtraTime, type, 'remove')}>Désinscrire</button>
                    : null
                }
            </div>
        )
    }
    const handleExtraTimeSubscribtion = async (idExtraTime: number | null, type: string, status: string) => {
        if(!showInfos) return
        const idUser = UserConnexion.getUserData().idUser
        let doAction
        if(status === 'add'){
            doAction = await SetRequests.setUserToExtraTime(idUser, showInfos.laBilleShowId, type)
        }
        else if(status === 'remove'){
            doAction = await  SetRequests.unSetUserToExtraTime(idExtraTime)
        } 
    }
const handleResponsableChange = async (type: string) => {
    const userId = (type === 'subcribtion') ? UserConnexion.getUserData().idUser : null 
    const updatedShow = await showInfos.changeResponsable(userId);
    setShowInfos(updatedShow);
}
    return (
      <div id='CalendarDetails'>
            {/* Title => "Vendredi 9 Janvier2025" */}
            <div className='title1'>{showInfos ? <p>{ MonthGestion.getCompletDateLabel(new Date(showInfos.date))}</p> : null }</div>
            {/* bouton ouverture/fermeture modifications */}
            { statusPage === 'read' ? <p onClick={handleOpenUpdate} className='status_page'>⚙️</p> : <p onClick={handleCloseUpdate} className='status_page'> X </p>}
            <div id='generalInfos'>
                 {/**************** Section infos en mode 'read' ********************************/}
                 {showInfos && statusPage === 'read' ? displayStatus() : null} 
                 {showInfos && statusPage === 'read' ? displayHoraires(showInfos.formatHoraires()) : null}
                 {showInfos && statusPage === 'read' ? displayResponsable() : null}  
                 {/************** Section shifts en mode 'read' ********************************/}
                 { /*
                    showInfos && (showInfos.status === 'normale' || showInfos.status === 'soiree') && statusPage === 'read' 
                    ? displayAllShifts() : null/
                 }
                 {/************** Section infos en mode 'update' ********************************/}
                 { showInfos && statusPage === 'update' ? <UpdateCalendarDetails show={showInfos} close={handleCloseUpdate}/> : null }
            </div>                
      </div>
 ) 
}
export default CalendarDetails2;