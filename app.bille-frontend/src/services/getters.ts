import Shift from "../models/shifts";
import ShowHandler from "../models/show";
import UserHandler from "../models/user-handler";
import UserConnexion from "../helpers/user-connexion";
import { IPadress } from "./adress";

const getToken = () => {
  const user = UserConnexion.getUserData();
  return user?.token || '';
};

type RecievedShifts = {
    idShift: number, 
    fkLaBilleShow?: number, 
    type: string, 
    maxUsers: number, 
    startTime: string, 
    endTime: string, 
    indexForType: number, 
    users: []
}
type User = {
    idUser: number,
    firstname: string
}
type ShiftInfos = {
    date: string,
    laBilleShowId: number,
    shifts: Shift[]
}
type ExtraTime = {
    idExtraTime: number | null, 
    idUser: number, 
    firstname: string, 
    type: string
}
export default class GetRequests{
   // return the id, status etc of all dates between the two specified dates
      static async getDataInfos(startDate: string, endDate: string){
         if(!startDate || !endDate) return null
         try{
            const url = `${IPadress()}/api/getDatesInfosOfGivenDates?startDate=${startDate}&endDate=${endDate}`
            const req = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
               credentials: 'include' 
            })
            const response = await req.json();
            //console.log("RESPONSE :: ", response)
            return response && response.msg === 'success_getAllShowAndShifts' ? response.data : []
         }catch(error){
            return 'error'
         } 
      }
      static async getUserList(){
         try{
            const url = `${IPadress()}/api/getUserList`
            const req = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                 credentials: 'include' 
            })
            const response = await req.json();
            return response && response.msg === "success_getUserList" ? response.data : null
         }catch(error){
            //////console.log(error)
            return 'error'
         } 
      }
      static async getDateInfos(idShow: number): Promise<ShowHandler | null>{
         if(!idShow) return null
         try{
            const url = `${IPadress()}/api/getDateInfos?idShow=${idShow}`
            const req = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                 credentials: 'include' 
            })
            const response = await req.json()
            if(response.msg !== 'success_containData') return null
            //console.log("response : ", response)
            const recievedShow = response.data
            const newShow = new ShowHandler(
               recievedShow.laBilleShowId,
               recievedShow.showResponsable,
               recievedShow.date,
               recievedShow.status,
               recievedShow.soundEngineer,
               recievedShow.notes,
               recievedShow.shifts, 
               recievedShow.extraTimes,
            )
            //console.log("newShow : ",newShow)
            return newShow
         }catch(error){
            //console.log("error : ", error)
            return null
         } 
      }
      static async getUserIdAndFirstname(idUser: number): Promise<User | null>{
         try{      
            const url = `${IPadress()}/api/getSpecifiedUser?idUser=${idUser}` 
            const req = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                 credentials: 'include' 
            })
            const response = await req.json();
            ////console.log("response : ", response) 
            const dataToReturn = {
               idUser: response.user.idUser,
               firstname: response.user.firstname
            } 
            return dataToReturn
         }catch(error){
            return null
         }
      }
      
      static async getMyInfos(idUser: number): Promise<ShiftInfos[] | null>{
         try{
            const url = `${IPadress()}/api/getMyInfos?idUser=${idUser}`
            const req = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                 credentials: 'include' 
            }) 
            const response = await req.json();
            if(response.msg !== 'success') throw new Error()
            return response.data
         }catch(error){
            return null
         }
      }
      static async getAllUsers(): Promise<UserHandler[]>{
         try{
            const url = `${IPadress()}/api/getAllUsers`
            const req = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }, 
                credentials: 'include' 
            })
            const response = await req.json();
            if(response.msg !== 'success' || response.data.length <= 0) throw new Error()
            const formatedData: UserHandler[] = response.data.map((user: any) => {
               return new UserHandler(
                  user.idUser, 
                  user.login, 
                  user.firstname, 
                  user.adminLevel, 
                  user.isAlreadyConnected,
                  user.passwordConnexion
               )
            })
            return formatedData
         }catch(error){
            return []
         }
      }
      // return 3 values for the user & month specified
      // 1) 'valid' = shifted 2x or +
      // 2) 'middle' = shifted 1x
      // 3) 'not-valid' = shifted 0x
      static async getUserRecap(userId: number, monthNbr: number, yearNbr: number): Promise<string>{
         try{
            const url = `${IPadress()}/api/get-recap?idUser=${userId}&monthNbr=${monthNbr}&yearNbr=${yearNbr}`
            const req = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }, 
                credentials: 'include' 
            })
            const response = await req.json();
            console.log(response)
            if(response.status !== 'success' || !response.data) throw new Error()
            return response.data
         }catch(error){
            return 'not-valid'
         }
      }
}
