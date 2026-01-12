import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import './calendar-detail-layout.css'
import Show from '../../../models/show';
import Shift from '../../../models/shifts';
import GetRequests from '../../../services/getters';
import SetRequests from '../../../services/setters';

type Props = {
    show: Show,
    close: () => void
}
type ExtraTime = {
    idUser: number, 
    firstname: string, 
    type: string
}
type ActualShowInfos = {
    laBilleShowId: number;
    showResponsable: number | null;
    date: Date;
    status: string;
    soundEngineer: boolean;
    notes: string | null;
    shifts: Shift[]; 
    extraTimes: ExtraTime[]; 
}
type User = {
    idUser: number,
    firstname: string
}
const UpdateCalendarDetails: FunctionComponent<Props> = ({show, close}) => {
    const [updatedShow, setUpdatedShow] = useState<ActualShowInfos>(show)
    const [userList, setUserList] = useState<User[]>([])

    useEffect(() => { 
        const updateUserList = async () => {
            const newList = await GetRequests.getUserList() 
            if(newList) setUserList(newList)       
        }
        updateUserList()
    }, [])// [updatedShow.status])

    // compare data from original show and actual one (updatedShow)
    // ---------------- display data ------------------------------------------ 
    const displayStatus = () => {
        return (
            <div className='update_section'>
                <p>Statut</p>
                <select name="show_status" value={updatedShow.status} id="show_status" onChange={e => handleChangeStatus(e)}>
                    <option value="ferme">Fermé</option>
                    <option value="reunion">Réunion</option>
                    <option value="normale">Bar ouvert</option>
                    <option value="soiree">Soirée</option>
                </select>
            </div>
        )
    }
    const displayResponsable = () => {
        return (
            <div className='update_section'>
                <p>Résponsable</p>
                <select value={updatedShow.showResponsable || 0} name="show_responsable" id="show_responsable" onChange={e => handleChangeResponsable(e)}>
                    <option key={0} value={0}>-</option>
                    {
                        userList.map((user: User, index: number) => {
                            return <option key={index} value={user.idUser}>{user.firstname}</option>
                        })
                    }
                </select>
            </div>
        )
    }
    const displayNotes = () => {
        return (
            <div id='notesSection'>
                <p>Infos soirée</p>
                <textarea className="updateNotes" onChange={e => handleChangeNotes(e)}>{updatedShow.notes}</textarea>
            </div>
        )
    }
    // ---------------- update data on input change ------------------------------------------ 
    const handleChangeStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setUpdatedShow((prevShow) => ({...prevShow, status: newStatus}))
    }
    const handleChangeResponsable = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newResp = e.target.value;
        setUpdatedShow((prevShow) => (
            {...prevShow, showResponsable: parseInt(newResp)}
        ))
    }
    const handleChangeNotes = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newNotes = e.target.value
        setUpdatedShow((prevShow) => (
            {...prevShow, showResponsable: parseInt(newNotes)}
        ))
    }
    // ------------------------- handle send update ------------------------------------------ 
    // check coherence of data according to status before send
    // if status != soiree => delete notes, responsable 
    const checkDataCoherence = () => {
        if(updatedShow.status !== 'soiree'){
            const fieldsToUpdate: Partial<ActualShowInfos> = {
                showResponsable: null,
                notes: null,
                soundEngineer: false
            }
            setUpdatedShow((prevShow) => ({...prevShow, fieldsToUpdate }))
        }
    }
    const handleSendUpdate = async () => {
        checkDataCoherence()
        const sendUpdate = await SetRequests.updateShow(updatedShow)
        if(sendUpdate.msg === 'success') {
            window.alert("Soirée modifiée avec succès :)")
            close()
        }
        else window.alert("Oups! Quelque chose s'est mal passé :S")
    }
    return (
        <>
            { /* section status */ } 
            { displayStatus() }
            { /*  section formulaire de soirées */ 
                updatedShow.status === 'soiree' ? 
                <>   
                    {userList ? displayResponsable() : null}
                    {displayNotes()}
                </>
                : null            
            }
            {
            <div className='update_bts'>
                <button onClick={handleSendUpdate}>Valider changements</button>
                <button>Annuler</button>
            </div>
            }
            {/*
               (updatedShow.status === 'normale' || updatedShow.status === 'soiree') ? 
               <div id='update_shifts_bts'>
                    <button>Modifier shifts</button>
               </div>
               : null 
           */ }
        </>
    )
}
export default UpdateCalendarDetails