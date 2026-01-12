import React, { FunctionComponent, useEffect, useState } from 'react';
import './css/status.css'

type Props = {
    status: string
}
const StatusZone: FunctionComponent<Props> = ({status}) => {
    const [formatedStatus, setFormatedStatus] = useState<string>(null!)

    useEffect(() => {
        formatStatus(status)
    }, [status])

    const formatStatus = (givenStatus: string) => {
        ////console.log("givenStatus : ", givenStatus)
                switch(givenStatus){
            case 'normale' :
                setFormatedStatus('Bar ouvert !')
                break
            case 'soiree' : 
                setFormatedStatus('Evénement !')
                break
            case 'ferme' : 
                setFormatedStatus('fermé')    
                break
            case 'reunion' :
                setFormatedStatus('Réunion !')
                break
        }
    }

    return ( <>{formatedStatus}</> )
}
export default StatusZone;