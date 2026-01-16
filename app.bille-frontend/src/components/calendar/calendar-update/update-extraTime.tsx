import { FunctionComponent, useEffect, useState } from "react";
import GetRequests from "../../../services/getters";
import SetRequests from "../../../services/setters";
import UserConnexion from "../../../helpers/user-connexion";

type ExtraTime = {
  idExtraTime: number | null;
  idUser: number;
  firstname: string;
  type: string;
};

type ListedUser = {
  idUser: number;
  firstname: string;
};

type Props = {
  extraTimes: ExtraTime[];
  idShow: number;
  type: string; // "opening" ou "closure"
};

const UpdateExtraTime: FunctionComponent<Props> = ({
  extraTimes,
  idShow,
  type,
}) => {
  const [userList, setUserList] = useState<ListedUser[]>([]);
  const [usersShifted, setUsersShifted] = useState<ExtraTime[]>([]);
  const [userToAdd, setUserToAdd] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");

  // 
  useEffect(() => {
    const fetchUsers = async () => {
      const list: ListedUser[] = await GetRequests.getUserList();
      setUserList(list ?? []);
    };
    fetchUsers();
    setUsersShifted(extraTimes ?? []);
  }, [extraTimes]);

  // delete user
  const handleRemoveUser = async (idExtraTime: number | null) => {
    if (!idExtraTime) return;
    const result: boolean = await SetRequests.unSetUserToExtraTime(idExtraTime);
    if (result) {
      setUsersShifted((prev) =>
        prev.filter((user) => user.idExtraTime !== idExtraTime)
      );
      setMessage("Utilisateur supprimé avec succès.");
    } else {
      setMessage("Oups, problème lors de la suppression. Réessayez.");
    }
  };

  // add user
  const handleAddUser = async () => {
    if (!userToAdd) {
      setMessage("Veuillez sélectionner un utilisateur.");
      return;
    }
    const user = userList.find((u) => u.idUser === userToAdd);
    if (!user) {
      setMessage("Utilisateur invalide.");
      return;
    }

    const result: boolean = await SetRequests.setUserToExtraTime(
      user.idUser,
      idShow,
      type
    );

    if (result) {
      setUsersShifted((prev) => [
        ...prev,
        { idExtraTime: null, idUser: user.idUser, firstname: user.firstname, type },
      ]);
      setMessage(`Utilisateur ${user.firstname} inscrit avec succès !`);
    } else {
      setMessage("Oups, problème lors de l'inscription. Réessayez.");
    }
  };

  return (
    <div className="update-extra-time">
      <h4>{type === "opening" ? "Ouverture" : "Fermeture"}</h4>

      {/* users list */}
      <div id="shifted-users">
        {usersShifted.length === 0 ? (
          <p>Personne pour cette période</p>
        ) : (
          usersShifted.map((user) => (
            <div className="user-capsule" key={user.idUser}>
              <p>{user.firstname}</p>
              {user.idExtraTime && (
                <button onClick={() => handleRemoveUser(user.idExtraTime)}>
                  X
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* add user*/}
      <div className="add-user-form">
        <select
          value={userToAdd ?? ""}
          onChange={(e) => setUserToAdd(parseInt(e.target.value))}
        >
          <option value="">Sélectionner un utilisateur</option>
          {userList.map((user) => (
            <option key={user.idUser} value={user.idUser}>
              {user.firstname}
            </option>
          ))}
        </select>
        <button onClick={handleAddUser}>Inscrire</button>
      </div>

      {/* mesaj area */}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default UpdateExtraTime;
