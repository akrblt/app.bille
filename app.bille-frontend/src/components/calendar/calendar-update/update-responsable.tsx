import { FunctionComponent, useEffect, useState } from "react";
import './css/update-responsable.css'
import GetRequests from "../../../services/getters";

type Props = {
    responsable: null | number,
    handleChangeResponsable: (newResponsable: number | null) => void
}
type User = {
    idUser: number,
    firstname: string
}

const UpdateResponsable: FunctionComponent<Props> = ({ responsable, handleChangeResponsable }) => {
    const [actualResponsable, setActualResponsable] = useState<null | number>()
    const [userList, setUserList] = useState<User[]>()

    useEffect(() => {
        const defineUserList = async() => {       
            const userList = await GetRequests.getUserList()
            setUserList(userList)
        }
        defineUserList()
    }, [])

    useEffect(() => {
        setActualResponsable(responsable)
    }, [responsable])

    useEffect(() => {
        
    }, [actualResponsable])

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newResponsable = parseInt(e.target.value) ?? null
        setActualResponsable(newResponsable);
        handleChangeResponsable(newResponsable)
    };

    return (
        <div id="responsable-container">
            <label htmlFor="responsable-select">Résponsable : </label>
            <select id="responsable-select" value={actualResponsable ?? ""} onChange={handleSelectChange}>
                <option value={""}>Personne </option>
                {
                    userList?.map((user: User, index: number) => <option value={user.idUser} key={index}>{user.firstname}</option>)
                }
            </select>
        </div>
    )
} 
export default UpdateResponsable