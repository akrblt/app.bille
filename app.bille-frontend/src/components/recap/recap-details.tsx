import { FunctionComponent, useEffect, useState } from "react";
import GetRequests from "../../services/getters";
import "./recap.css";
import UserLine from "./user-line";

type Props = {
  year: number;
};
const RecapDetails: FunctionComponent<Props> = ({ year }) => {
  const [userList, setUserList] = useState<any[]>([]);

  useEffect(() => {
      const loadData = async () => {
        const allUsers = await GetRequests.getAllUsers();
        setUserList(allUsers)
      }
      loadData()
  }, [year]);

  return (
    <table className="recap-table">
        <tbody>
            {
              userList.map((user: any, index: number) => <UserLine key={index} userLogin={user.login} selectedYear={year} idUser={user.idUser} /> )
            }
        </tbody>
    </table>
  )
}

export default RecapDetails;