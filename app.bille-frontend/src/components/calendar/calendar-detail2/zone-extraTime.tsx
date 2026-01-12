import { FunctionComponent, useEffect, useState } from "react";
import UserConnexion from "../../../helpers/user-connexion";
import SetRequests from "../../../services/setters";
import './css/extratime.css'

type User = {
    idUser: number,
    firstname: string
}

type Props = {
    idShow: number,
    type: string,
    times: ExtraTime[]
    //handleAddUserToExtraTime: () => Promise<void>
}
type ExtraTime = {
    idExtraTime: number | null, 
    idUser: number, 
    firstname: string, 
    type: string
}
const ExtraTimeZone: FunctionComponent<Props> = ({ type, times, idShow }) => {
    const [timeType, setTimeType] = useState<string>(null!)
    const [concernedTimes, setConcernedTimes] = useState<ExtraTime[]>(null!)
    const [userIn, setUserIn] = useState<boolean>(false)

    useEffect(() => {
        switch(type){
            case 'opening': 
                setTimeType('Ouverture')
                break
            case 'closure': 
                setTimeType('Fermeture')
                break
        }
        const filtredTimes: ExtraTime[] = times.filter((time: ExtraTime) => time.type === type )
        const iAmIn: boolean = filtredTimes.some((thisTime: ExtraTime) => thisTime.idUser === (UserConnexion.getUserData())?.idUser)
        setConcernedTimes(filtredTimes)   
        setUserIn(iAmIn)
    }, [type, times])

    const handleExtraTimeSubscribtion = async (idExtraTime: number | null, type: string, status: string) => {
        try{
        const idUser = UserConnexion.getUserData().idUser
        let doAction: boolean = 
            (status === 'add') ? 
            await SetRequests.setUserToExtraTime(idUser, idShow, type)
            : (status === 'remove') ?
            await SetRequests.unSetUserToExtraTime(idExtraTime)
            : false
        console.log("doAction : ", doAction)
        if(doAction && status === 'add'){
            setConcernedTimes(prev => [...(prev ?? []), {
                idExtraTime: null,
                idUser: UserConnexion.myUserId(),
                firstname: UserConnexion.myLogin(),
                type: type
            }]);
            setUserIn(true)
        }
        else if(doAction && status === 'remove') console.log("echo")
        const msg = !doAction ? "Oups, il y a eu un soucis, réessayez plus tard" : "Ca joue !"
        window.location.reload()
        window.alert(msg)
}catch(e){
    console.log("e : ", e)
}
    }
    
    return (
        <div id='extraTimes_container'>
            <div className="extra-tit">
                <h6><strong>{ timeType }</strong></h6>
                {   // buttons
                    !userIn ? <button onClick={() => handleExtraTimeSubscribtion(null, type, 'add')} className="subscr-user subscribe">S'inscrire</button> 
                    : userIn ? <button onClick={() => handleExtraTimeSubscribtion(concernedTimes[0].idExtraTime, type, 'remove')} className="subscr-user">Désinscrire</button>
                    : null
                }
            </div>
            <hr className="lin"/>
            <div className="users-extra">
                {   // users
                    concernedTimes ? concernedTimes.map((user: User, index: number) => {
                        return <p key={index} className="user-firstname">{ user.firstname }</p>
                    }) : null
                }
            </div>
            <hr className="lin" />
        </div>
    )
}
export default ExtraTimeZone

/*
    return (<></>)/*
        <div id="extratime-container">
            <label>{ timeType } : </label>
            <div className='usersZone'>
                { !concernedTimes || concernedTimes.length <= 0 ? <p>Personne :(</p>  :           
                    concernedTimes.map((time: ExtraTime) => {
                        return <p key={time.idExtraTime} className='userExtra'>{time.firstname}</p> 
                    })
                }
            </div>
            <button onClick={() => handleAddUserToExtraTime(newTime: ExtraTime, idShow: number, type: string)}
        </div>
    )*/