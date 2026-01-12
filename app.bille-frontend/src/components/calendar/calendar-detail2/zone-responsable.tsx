import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import GetRequests from '../../../services/getters';
import UserConnexion from '../../../helpers/user-connexion';
import SetRequests from '../../../services/setters';
import './css/responsable.css'

type User = {
    idUser: number,
    firstname: string
}

type Props = {
    idShow: number,
    responsableId: number | null,
    handleChangeResponsable: (idUser: number) => void
}

const ResponsableZone: FunctionComponent<Props> = ({ responsableId, idShow, handleChangeResponsable }) => {
    const [actualResponsable, setActualResponsable] = useState<User|null>(null)
    const myId = useRef<number>((UserConnexion.getUserData()).idUser)

    useEffect(() => {       
        //console.log("responsableId : ", responsableId)          
        const insertUserData = async (): Promise<void> => {         
            try{                
                if(responsableId === null) throw new Error()                
                const userResponsable: User | null = await GetRequests.getUserIdAndFirstname(responsableId)
                setActualResponsable(userResponsable)               
            }catch(err){                
                setActualResponsable(null)              
            }               
        }               
        insertUserData()            
    }, [responsableId])             

    return (
        <div id='responsable-zone'>
            <label htmlFor="selectResponsable">Résponsable de soirée : </label>
            {
                idShow && actualResponsable === null ? <button onClick={() => handleChangeResponsable(myId.current)}>S'inscrire</button> : null 
            }
            {(actualResponsable !== null) ? <p id='responsable-firstname'> { actualResponsable.firstname } </p> : null } 
        </div>
    )
}
export default ResponsableZone