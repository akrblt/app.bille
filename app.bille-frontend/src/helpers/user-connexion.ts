import { request } from "http"
import SetRequests from "../services/setters"
import { send } from "process"

export default class UserConnexion {
    static tryLogin = async(login: string, password: string): Promise<string | null> => {
        const sendReq = await SetRequests.throwLoginReq(login, password)
        if(!sendReq || !sendReq.msg) return null 
        else if(sendReq.msg === 'success_login' && sendReq.data){
            this.recordConnexion(sendReq.data.idUser, sendReq.data.login, sendReq.data.adminLevel, sendReq.token, sendReq.refresh)
            return "success_login"
        } 
        else if(sendReq.msg === 'first_connexion_ok') return 'first_connexion_ok'
        return 'error'
    }
    static tryConfirmLogin = async (login: string, firstPassword: string, secondPassword: string) => {
        if(firstPassword === "" || secondPassword === "") return "error"
        const sendReq = await SetRequests.confirmFirstConnexion(login, firstPassword, secondPassword)
        if(sendReq.msg === 'success_login'){
            this.recordConnexion(sendReq.data.idUser, sendReq.data.login, sendReq.data.adminLevel, sendReq.token, sendReq.refresh)
            return 'success_login'
        }
    }
    static recordConnexion = (idUser: number, login: string, adminLevel: number, token: string, refresh: string) => {
        const dataToRecord = {
            idUser: idUser, //5,
            login: login, //'admin',
            adminLevel: adminLevel, //1
            token: token
        }
        localStorage.setItem("userBille", JSON.stringify(dataToRecord))
        document.cookie = `refresh_token=${refresh}`
    }
    static getUserData = () => {
        const userData = localStorage.getItem("userBille")
        return userData ? JSON.parse(userData) : null
    }
    static iAmConnected = () => {
        const connexionData = this.getUserData()
        return (connexionData && connexionData.idUser) ? true : false 
    }
    static myAdminLevel = () => {
        const userData = this.getUserData()
        if (!userData) return null;
        return typeof userData.adminLevel === 'number' ? userData.adminLevel : null;
    }
    static myUserId = () => {
        const userData = this.getUserData()
        if (!userData) return null;  
        return userData.idUser
    }
    static myLogin = () => {
        const userData = this.getUserData()
        if (!userData) return null;  
        return userData.login
    }
}