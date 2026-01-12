import Show from "../models/show"
import Shift from "../models/shifts";
import UserHandler from "../models/user-handler";
import UserConnexion from "../helpers/user-connexion";
import { IPadress } from "./adress";

const getToken = () => {
    const user = UserConnexion.getUserData();
    if (!user || !user.token) return null;
    return user.token;
};

type Extra = {
    idShow: number,
    idUser: number,
    type: string
}
type ExtraTime = {
    idUser: number, 
    firstname: string, 
    type: string
}
type ActualShowInfos = {
    laBilleShowId: number;
    showResponsable: number | null;
    date: Date;
    status: string;
    soundEngineer: boolean;
    notes: string | null;
    shifts: Shift[]; 
    extraTimes: ExtraTime[]; 
}

export default class SetRequests{
    static async setYearTemplate(data: any){
        //console.log("set year template")
        ////////console.log(data)
        try{
            const url = `${IPadress()}/api/setYearTemplate` 
            const request = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}` 
                },
                credentials: 'include', 
                body: JSON.stringify(data)
            })
            const response = await request.json()
            return response.msg === 'success' ? true : false
        }catch(error){
            //////console.log(error)
            return false
        }
    }
    //***************************** set user in shift *************************************** */
    static async setUserToShift(idShift: number, idUser: number): Promise<boolean>{
        //
        try{
            const url = `${IPadress()}/api/subscribeUserToShift` 
            const request = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                credentials: 'include', 
                body: JSON.stringify({
                    idShift: idShift,
                    idUser: idUser
                })
            })
            const response = await request.json()
            return response.msg === 'success'
        }catch(error){
            return false
        }
    }
    static async unSetUserToShift(idUser: number, idShift: number){
        //
        try{
            const url = `${IPadress()}/api/removeUserFromShift` 
            const request = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                credentials: 'include', 
                body: JSON.stringify({
                    idShift: idShift,
                    idUser: idUser
                })
            })
            const response = await request.json()
            return response ? response : null
        }catch(error){
            //////console.log(error)
            return null
        }
    }
    //***************************** set user in extraTimes *************************************** */
    static async setUserToExtraTime(idUser: number, fkShow: number, type: string): Promise<boolean>{
        //console.log("setUserToExtraTime")
        if(!idUser || !fkShow || !type) return false
        const data = {
            idUser: idUser,
            fkShow: fkShow,
            type: type
        }
        try{
            const url = `${IPadress()}/api/subscribeUserToExtraTime` 
            const request = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                credentials: 'include', 
                body: JSON.stringify(data)
            })
            if(request.status !== 200) throw new Error()
            const response = await request.json()
        //console.log("repsonse extra :: ", response)
            if(response.msg !== 'success') throw new Error()
            else return true
        }catch(error){
            //console.log(error)
            return false
        }
    }
    static async unSetUserToExtraTime(idExtraTime: number | null): Promise<boolean>{
        try{
            //console.log("delete ::: ", idExtraTime)
            if(!idExtraTime) throw new Error()
            const url = `${IPadress()}/api/deleteUserToExtraTime` 
            const request = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                credentials: 'include', 
                body: JSON.stringify({idExtraTime: idExtraTime})
            })
            if(request.status !== 200) throw new Error()
            const response = await request.json()
            console.log("response delete : ", response)
            if(response.msg !== 'success') return false
            else return true
        }catch(error){
            //console.log(error)
            return false
        }

    }
    /******************************* update show *************************************/
    static async updateShow(data: ActualShowInfos | Show){
        try{
            const url = `${IPadress()}/api/updateShowInformations` 
            const request = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                credentials: 'include', 
                body: JSON.stringify(data)
            })
            const response = await request.json()
            //console.log("response update show : ", response)
            return response ? response : null
        }catch(error){
            //////console.log(error)
            return null
        }
    }
    static async updateShifts(givenShifts: Shift[]){
        try{
            const url = `${IPadress()}/api/updateShowShifts` 
            const request = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                credentials: 'include', 
                body: JSON.stringify(givenShifts)
            })
            const response = await request.json()
            //console.log("response update shifts : ", response)
            return response.msg === 'success'
        }catch(error){
            //////console.log(error)
            return false
        }
    }
    static async createUser(newUser: UserHandler): Promise<string>{
        const url = `${IPadress()}/api/createUser`
        const request = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                credentials: 'include', 
                body: JSON.stringify(newUser)
            })
            const response = await request.json()
            return response.msg
    }
    static async throwUserDelete(idUser: number): Promise<string | null>{
        try{
            //console.log("throwUserDelete : ", idUser)
            const url = `${IPadress()}/api/deleteUser`
            const request = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                credentials: 'include', 
                body: JSON.stringify({idUser: idUser})
            })
            //console.log("req : ", request)
            const response = await request.json()
            //console.log("response : : ", response)
            return response.msg
        }catch(error){
            return null
        }
    }
    static async throwUserReset(idUser: number): Promise<boolean>{
        try{
            //console.log("throwUserDelete : ", idUser)
            const url = `${IPadress()}/api/resetUser`
            const request = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                credentials: 'include', 
                body: JSON.stringify({idUser: idUser})
            })
            //console.log("req : ", request)
            const response = await request.json()
            //console.log("response : : ", response)
            return response.msg === 'success'
        }catch(error){
            //console.log(error)
            return false
        }

    }
    static async throwUserUpdate(givenUser: UserHandler): Promise<boolean>{
        try{
            //console.log("givenUser :: ", givenUser)
            const url = `${IPadress()}/api/updateUser`
            const request = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                credentials: 'include', 
                body: JSON.stringify(givenUser)
            })
            const response = await request.json()
            return response.msg === 'success'
        }catch(error){
            return false
        }
    }
    static async throwLoginReq(login: string, password: string){
        try{
            const url = `${IPadress()}/api/login`
            const request = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', 
                body: JSON.stringify({
                    login: login,
                    password: password
                })
            })
            const response = await request.json()
            return response
        }catch(error){
            return null
        }
    }
    static async confirmFirstConnexion(login: string, firstPassword: string, secondPassword: string){
        try{
            const url = `${IPadress()}/api/confirmLogin`
            const request = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', 
                body: JSON.stringify({
                    login: login,
                    firstPassword: firstPassword,
                    secondPassword: secondPassword
                })
            })
            const response = await request.json()
            return response
        }catch(error){
            return null
        }
    }
    static async createShift(givenShift: Shift){
        try{
            const url = `${IPadress()}/api/createShift`
            const request = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', 
                body: JSON.stringify(givenShift)
            })
            const response = await request.json()
            return response
        }catch(error){
            return null
        }
    }
    static async updateShift(givenShift: Shift){
        try{
            const url = `${IPadress()}/api/updateShift`
            const request = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', 
                body: JSON.stringify(givenShift)
            })
            const response = await request.json()
            //console.log("update shift response : ", response)
            return response
        }catch(error){
            return null
        }
    }
    static async deleteShift(idShift: number){
        try{
            const url = `${IPadress()}/api/deleteShift`
            const request = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', 
                body: JSON.stringify({idShift: idShift})
            })
            const response = await request.json()
            //console.log("update shift response : ", response)
            return response.status === 'success' ? true : false
        }catch(error){
            return false
        }
    }
}