import { FunctionComponent, useEffect, useState } from "react";
import GetRequests from "../../services/getters";
import './recap.css'

type Props = {
    year: number,
    month: number,
    user: number
}

const UserMonth: FunctionComponent<Props> = ({ year, month, user}) => {
    const [data, setData] = useState<any>({})

    useEffect(() => {
        const loadData = async () => {
            const load: any = await GetRequests.getUserRecap(user, month, year)
            console.log("load: ", load)
            setData(load)  
        }
        loadData()
    }, [year, month, user])

    return (
        <td
            className={ data.status} 
            >{ data.monthLabel}
        </td>
    )
}
export default UserMonth