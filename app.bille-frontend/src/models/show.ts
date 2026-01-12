import Shift from "./shifts";
import MonthGestion from "../helpers/month-gestion";
import SetRequests from "../services/setters";

type User = {
    idUser: number,
    firstname: string
}
type ExtraTime = {
    idExtraTime: number | null,
    idUser: number, 
    firstname: string, 
    type: string
}
type ShiftedUser = {
    idSubscribe: number | null,
    idUser: number,
    username: string
}
type RecievedShifts = {
    idShift: number, 
    fkLaBilleShow?: number, 
    type: string, 
    maxUsers: number, 
    startTime: string, 
    endTime: string, 
    indexForType: number, 
    users: ShiftedUser[]
}
export default class ShowHandler {
    laBilleShowId: number;
    showResponsable: number | null;
    date: Date;
    status: string;
    soundEngineer: boolean;
    notes: string | null;
    shifts: Shift[]; 
    extraTimes: ExtraTime[]; 
    rdn: number;
     
    constructor(
     laBilleShowId: number,
     showResponsable: number | null,
     date: Date,
     status: string,
     soundEngineer: boolean,
     notes: string | null,
     shifts: RecievedShifts[],
     extraTimes: ExtraTime[] = []
    ) {
     this.laBilleShowId = laBilleShowId;
     this.showResponsable = showResponsable;
     this.date = date;
     this.status = status;
     this.soundEngineer = soundEngineer;
     this.notes = notes;
     this.shifts = Array.isArray(shifts) && shifts.length > 0 ? this.setShifts(shifts): [];
     this.extraTimes = extraTimes; 
     this.rdn = 1 + Math.random() * (100000 - 1);
    }
    // Méthode pour mettre à jour les shifts
    setShifts(shiftsData: RecievedShifts[]): Shift[]{ 
        if (!Array.isArray(shiftsData)) return []
        return shiftsData.map(data => {
            const fkShow: number = (typeof data.fkLaBilleShow === 'number') ? data.fkLaBilleShow : 0
            return new Shift(
                data.idShift, 
                fkShow, 
                data.type, 
                data.maxUsers, 
                data.startTime, 
                data.endTime, 
                data.indexForType,
                data.users
            )
        })
    } 
    async updateAllShifts (newShifts: Shift[] | null): Promise<ShowHandler>{
        const sendUpdate = await SetRequests.updateShifts(newShifts || [])
        if(!sendUpdate)window.alert("Oups, il y a eu un soucis")
        else window.alert("Shifts mis à jour !")
        return new ShowHandler(
            this.laBilleShowId,
            this.showResponsable,
            this.date,
            this.status,
            this.soundEngineer,
            this.notes,
            (newShifts ?? []).map(shift => ({
                idShift: shift.idShift,
                fkLaBilleShow: shift.fkShow,
                type: shift.type,
                maxUsers: shift.maxUsers,
                startTime: shift.startTime,
                endTime: shift.endTime,
                indexForType: shift.indexForType,
                users: shift.users,
            })),
            this.extraTimes
        );
    }
    addNewShift(newShift: Shift): ShowHandler{
        this.shifts.push(newShift)
        return this.formatedShow()
    }
    removeShift(concernedShift: Shift): ShowHandler{
        this.shifts = this.shifts.filter((shift) => shift === concernedShift)
        return this.formatedShow()
    }
    changeStatus(newStatus: string): ShowHandler{
        this.status = newStatus
        return this.formatedShow()
    }
    async changeResponsable(newResponsable: number | null): Promise<ShowHandler> {
        const oldResponsable: number | null = this.showResponsable
        if(oldResponsable === newResponsable) return this.formatedShow()
        try{
            this.showResponsable = newResponsable
            const updateShow: any = await SetRequests.updateShow(this)
            if(updateShow && updateShow.msg === 'success') return this.formatedShow()
            else throw new Error()
        }catch(error){
           this.showResponsable = oldResponsable 
           return this.formatedShow()
        } 

    }
    changeNotes(newNotes: string | null): ShowHandler{
        const formatedNotes: string | null = (newNotes === "") ? null : newNotes
        this.notes = formatedNotes
        return this.formatedShow()
    }
    getExtraTimesOfType(givenType: string): ExtraTime[] {
        if(givenType !== 'opening' && givenType !== 'closure') return []
        return this.extraTimes.filter((time: ExtraTime) => time.type === givenType)
    }
    async addUserToExtraTimes(newTime: ExtraTime, idShow: number, type: string): Promise<ShowHandler | null>{
        const insertion: boolean = await SetRequests.setUserToExtraTime(newTime.idUser, idShow, type)
        if(insertion) this.extraTimes.push(newTime)
        return this.formatedShow()
    }
    async removeUserFromExtraTimes(idExtraTime: number): Promise<ShowHandler>{
        const sendDeleteReq: boolean = await SetRequests.unSetUserToExtraTime(idExtraTime)  
        if(sendDeleteReq) this.extraTimes.filter((time: ExtraTime) => time.idExtraTime === idExtraTime)
        return this.formatedShow()
    }
    // -------------------- formatage des données ------------------------------------
    // return string of start of first shift and end of last shift
    formatHoraires(): string{
        //////console.log("this.shifts : ", this.shifts)
        if(this.shifts.length === 0) return ' - '
        const start: string = this.shifts[0].startTime.split(":").slice(0, 2).join(":")
        const end: string = this.shifts[this.shifts.length-1].endTime.split(":").slice(0, 2).join(":")
        return `${start} - ${end}`
    }
    formatStatus(): string{
        switch(this.status){
            case 'ferme': {
                return " Fermé "
            }
            case 'normal': {
                return " Bar ouvert ! "
            }
            case 'soiree': {
                return ' Soirée ! '
            }
            case 'reunions': {
                return ' Réunion '
            }
            default: {
                return 'Oups :S'
            }
        }

    }
    formatDateLabel(){ 
        return MonthGestion.getCompletDateLabel(new Date(this.date)) 
    }
    formatedShow(): ShowHandler{
        return new ShowHandler(
          this.laBilleShowId,
          this.showResponsable,
          this.date,
          this.status,
          this.soundEngineer,
          this.notes,
          this.shifts.map((shift: Shift) => ({
            idShift: shift.idShift,
            fkLaBilleShow: shift.fkShow,
            type: shift.type,
            maxUsers: shift.maxUsers,
            startTime: shift.startTime,
            endTime: shift.endTime,
            indexForType: shift.indexForType,
            users: shift.users,
          })),
          this.extraTimes
        );
    }
}