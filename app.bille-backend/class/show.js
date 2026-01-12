import LaBilleShow from "../models/laBilleShow"

export default class Show{
    constructor(laBilleShowId = null, showResponsable, status, date, notes, shifts){
        this.laBilleShowId = laBilleShowId
        this.showResponsable = showResponsable
        this.status = status
        this.date = date
        this.notes = notes
        this.shifts = this.setShifts(shifts)
    }
    setShifts(shifts){
        try{

        }catch(error){
            return []
        }
    }
    createShow(){
        try{
            const newShow = LaBilleShow.create({
                showResponsable: this.laBilleShowId,
                status: this.status,
                date: this.date,
                notes: this.notes
            })
            if(newShow) this.laBilleShowId = newShow.laBilleShowId
            else throw new Error()
            return true
        }catch(error){
            //console.log(error)
            return false
        }
    }
    updateShow(){
        try{

        }catch(error){
            return false
        }
    }
}