import React, { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Shift from '../../../../models/shifts';
import UserConnexion from '../../../../helpers/user-connexion';
import SetRequests from '../../../../services/setters';
import './css/shift.css'

type Props = {
    shiftData: Shift,
    maxUsers: number
}
type ShiftedUser = {
    idSubscribe: number | null,
    idUser: number,
    username: string
}
const ShiftZone: FunctionComponent<Props> = ({ shiftData, maxUsers }) => {
    const [usersInfo, setUsersInfo] = useState<ShiftedUser[]>(shiftData.users)
    const [userShifted, setUserShifted] = useState<boolean>(false)
    const naviguate = useNavigate()

    useEffect(() => {
        const user = UserConnexion.getUserData();
        if (!user || !user.token) {
            window.alert("Vous devez être connecté pour accéder à cette page.");
            naviguate('/login');
        }
    }, []);

    useEffect(() => {
        setUsersInfo(shiftData.users)
        const isUserHere = isUserShifted()
        setUserShifted(isUserHere)
    }, [shiftData])
    
    // take a shift object as param
    // return true if actual user is subscribed to given shift else return false
    const isUserShifted = () => {
        if(!shiftData.users) return false
        const myId = UserConnexion.getUserData().idUser
        const userInShift = usersInfo.some((user: ShiftedUser) => user.idUser === myId) 
        //console.log("isUserShifted : ", userInShift)
        return userInShift
    }

    const handleSubscribeUser = async (idShift: number) => {
        try{
            const idUser = UserConnexion.getUserData().idUser
            const setUser = await SetRequests.setUserToShift(idShift, idUser)
            if(!setUser) throw new Error()
            else window.alert("Merci de ton soutiens !")          
            window.location.reload()
        }catch(error){
            window.alert("Oups quelque chose a raté :S")
            //naviguate(`/calendar/details/${shiftData.fkShow}`)
        }
    }
    const handleUnsubscribeUser = async (idShift: number) => {
        if(!idShift) return
        const idUser = UserConnexion.getUserData().idUser
        const unsetUser = await SetRequests.unSetUserToShift(idUser, idShift)
        if(unsetUser.msg !== 'success') window.alert("Oups quelque chose a raté :S")
        else window.alert("N'oublies pas de te faire remplacer")
        window.location.reload()
    }
    return (
        <div>
            <div className='shiftZone'>
                {/*horaires du shift */}
                <div className='shift_times'>
                    <p>{shiftData.startTime}</p>
                    <p>-</p>
                    <p>{shiftData.endTime}</p>
                </div>
                <div id='usersNb'>
                    <p>{ usersInfo.length } / { maxUsers }</p>
                </div>
                {/* users du shift */}
                <div className='usersZone'>
                    { usersInfo.length === 0 ? <p>Personne :(</p> : 
                        usersInfo.map((user: ShiftedUser) => {
                            return <p key={user.idSubscribe} className='userShift'>{user.username}</p> 
                        })
                    }
                </div>
                {/* bouton d'inscribtion */}
                <div className='bt-subs'>
                    {   /* Si user inscrit */
                        userShifted ? <button onClick={() => handleUnsubscribeUser(shiftData.idShift)} className='subscribeBt'>Se désinscrire</button>
                        /* Si shift pas plein et user pas inscrit */
                        : !userShifted ? <button className='subscribe subscribeBt' onClick={() => handleSubscribeUser(shiftData.idShift)}>S'inscrire</button> 
                        : null
                    }{
                        
                    }
                </div>
            </div> 
        </div>
    )
}
export default ShiftZone