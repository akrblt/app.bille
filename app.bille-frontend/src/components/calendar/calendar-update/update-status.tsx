import { FunctionComponent, useEffect, useState } from "react";
import './css/update-status.css'

type Props = {
    status: string
    handleChangeStatus: (newStatus: string) => void
}

const UpdateStatus: FunctionComponent<Props> = ({ status, handleChangeStatus }) => {
    const [actualStatus, setActualStatus] = useState<string>()

    useEffect(() => {
        setActualStatus(status)
    }, [status])

    useEffect(() => {
        if(typeof actualStatus === 'string') handleChangeStatus(actualStatus)
    }, [actualStatus])

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setActualStatus(e.target.value);
    };

    return (
        <select id="status-select" value={actualStatus} onChange={handleSelectChange}>
            <option value="normale">Bar ouvert</option>
            <option value="soiree">Evenement</option>
            <option value="reunion">Réunion</option>
            <option value="ferme">Fermé</option>
        </select>
    )
} 
export default UpdateStatus