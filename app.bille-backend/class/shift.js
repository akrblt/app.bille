export default class Shift{
    constructor(idShift = null, fkLaBilleShow, type, maxUsers, startTime, endTime, indexForType, users){
        this.idShift = idShift
        this.fkLaBilleShow = fkLaBilleShow
        this.type = type
        this.maxUsers = maxUsers
        this.startTime = startTime
        this.endTime = endTime
        this.indexForType = indexForType
        this.users = users
    }
    createShift(){
        try{
            if(!this.fkLaBilleShow) throw new Error()
        }catch(error){
            return false
        }
        
    }
}