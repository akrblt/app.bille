
export default class UserHandler {
    idUser: number | null;
    login: string;
    firstname: string;
    adminLevel: number;
    isAlreadyConnected: boolean;
    passwordConnexion: string | null;

    constructor(
        idUser: number | null,
        login: string,
        firstname: string,
        adminLevel: number,
        isAlreadyConnected: boolean,
        passwordConnexion: string | null
    ) {
        this.idUser = idUser;
        this.login = login;
        this.firstname = firstname;
        this.adminLevel = adminLevel;
        this.isAlreadyConnected = isAlreadyConnected;
        this.passwordConnexion = passwordConnexion;
    }

    clone(): UserHandler {
        return new UserHandler(
            this.idUser,
            this.login,
            this.firstname,
            this.adminLevel,
            this.isAlreadyConnected,
            this.passwordConnexion
        );
    }

    withChanges(changes: Partial<UserHandler>): UserHandler {
        return new UserHandler(
            changes.idUser !== undefined ? changes.idUser : this.idUser,
            changes.login !== undefined ? changes.login : this.login,
            changes.firstname !== undefined ? changes.firstname : this.firstname,
            changes.adminLevel !== undefined ? changes.adminLevel : this.adminLevel,
            changes.isAlreadyConnected !== undefined ? changes.isAlreadyConnected : this.isAlreadyConnected,
            changes.passwordConnexion !== undefined ? changes.passwordConnexion : this.passwordConnexion
        );
    }
    
}


/*
export default class UserHandler {
    idUser: number | null;
    login: string;
    firstname: string;
    adminLevel: number;
    isAlreadyConnected: boolean;
    passwordConnexion: string | null;

    constructor(
        idUser: number |null,
        login: string,
        firstname: string,
        adminLevel: number,
        isAlreadyConnected: boolean,
        passwordConnexion: string | null
    ){
        this.idUser = idUser;
        this.login = login;
        this.firstname = firstname;
        this.adminLevel = adminLevel
        this.isAlreadyConnected = isAlreadyConnected;
        this.passwordConnexion = passwordConnexion;
    }
    updateUserInfos(): UserHandler{
        try{
            return this.formatedUser()
        }catch(error){
            return this.formatedUser()
        }
    }
    // fix isAlreadyConnected to 0 and reset passwordConnexion
    resetUserInfos(): UserHandler{
        try{
            return this.formatedUser()
        }catch(error){
            return this.formatedUser()
        }
    }
    changeLogin(newLogin: string){
        this.login = newLogin
        return this.formatedUser()
    }
    changeFirstname(newFirstname: string): UserHandler{
        this.firstname = newFirstname
        return this.formatedUser()
    }
    changeLevelAdmin(newAdminLevel: number): UserHandler{
        this.adminLevel = newAdminLevel
        return this.formatedUser()
    }
    formatedUser(): UserHandler{
        return new UserHandler(
            this.idUser,
            this.login,
            this.firstname,
            this.adminLevel,
            this.isAlreadyConnected,
            this.passwordConnexion
        )
    }
}
    */