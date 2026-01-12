import { FunctionComponent, useEffect, useState } from "react";
import GetRequests from "../../services/getters";
import UserMonth from "./user-month";

type Props = {
    idUser: number,
    selectedYear: number,
    userLogin: string
}

const UserLine: FunctionComponent<Props> = ({ idUser, selectedYear, userLogin}) => {
    const monthsIndex: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    return (
        <tr className="user-line">
            <td>{userLogin}</td>
            {
                monthsIndex.map((monthNbr: number) => <UserMonth key={monthNbr} year={selectedYear} month={monthNbr} user={idUser} />)
            }
        </tr>
    )
}
export default UserLine