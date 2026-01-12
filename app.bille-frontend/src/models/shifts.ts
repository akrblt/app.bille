import SetRequests from "../services/setters";

type ShiftedUser = {
    idSubscribe: number | null,
    idUser: number,
    username: string
}
export default class Shift {
    idShift: number;
    fkShow: number;
    type: string;
    maxUsers: number;
    startTime: string;
    endTime: string;
    indexForType: number;
    users: ShiftedUser[];

    constructor(
        idShift: number,
        fkShow: number ,
        type: string,
        maxUsers: number,
        startTime: string,
        endTime: string,
        indexForType: number,
        users: ShiftedUser[] = []
    ){
        this.idShift = idShift;
        this.fkShow = fkShow;
        this.type = type;
        this.maxUsers = maxUsers;
        this.startTime = startTime.split(":").slice(0, 2).join(":");
        this.endTime = endTime.split(":").slice(0, 2).join(":");;
        this.indexForType = indexForType;
        this.users = users;
    }
    async changeStartTime(newStartTime: string): Promise<Shift>{
        this.startTime = newStartTime
        return this.formatedShift()
    }
    changeEndTime(newEndTime: string): Shift{
        this.endTime = newEndTime
        return this.formatedShift()
    }
    changeMaxUsers(newMaxUsers: string): Shift{
        this.maxUsers = newMaxUsers !== '' ? parseInt(newMaxUsers) : 0
        return this.formatedShift()
    }
    addUser(newUser: ShiftedUser): Shift | string {
        if(this.users.length === this.maxUsers) return "Le shift est plein"
        const userAlreadySubscribed: boolean = this.users.some((user) => user.idUser === newUser.idUser )
        if(userAlreadySubscribed) return `${newUser.username} est dejà inscrit à ce shift`
        this.users.push(newUser)
        return this.formatedShift()
    }
    removeUser(concernedUser: ShiftedUser): Shift{
        this.users = this.users.filter((user) => user.idUser !== concernedUser.idUser)
        return this.formatedShift()
    }
    formatedShift(): Shift {
        return new Shift(
            this.idShift,
            this.fkShow,
            this.type,
            this.maxUsers,
            this.startTime,
            this.endTime,
            this.indexForType,
            this.users,
        )
    }
    async sendUpdateToServer(){
        const updateAction = await SetRequests.updateShift(this)
        return updateAction.status === 'success' ? true : false 
    }
}