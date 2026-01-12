const { destroyAllShiftsAndUsersOfAShow, setBasicalShiftTemplateToShow, destroyAllShiftsNotBar } = require('../helpers/setters')
const { getShowById, getPreviousStatusOfShow } = require('../helpers/getters')

module.exports = (app) => {
    app.post('/api/updateShowInformations', async (req, res) => {  
        const dataRecieved = req.body
        ////console.log("updateShowInformations : ", dataRecieved)
        if(!dataRecieved.laBilleShowId){
            return res.status(400).send("error_user")
        }
        dataRecieved.soundEngineer = dataRecieved.soundEngineer === true ? 1 : null 
        const actualData = await getShowById(dataRecieved.laBilleShowId)
        const previousStatus = actualData.status
        
        ////console.log("previous status : ", previousStatus)
        ////console.log("actual status : ", dataRecieved.status )
        // ----------------- if status didnt change or normal=>soiree ----------------------------------
        if(previousStatus === dataRecieved.status ||
            (previousStatus === 'normale' && dataRecieved.status === 'soiree')
        ){
            actualData.status = dataRecieved.status
            actualData.soundEngineer = dataRecieved.soundEngineer 
            actualData.showResponsable = dataRecieved.showResponsable !== 0 ? dataRecieved.showResponsable : null 
            actualData.notes = (dataRecieved.notes && actualData.status === 'soiree') ? dataRecieved.notes : null
            await actualData.save()          
            return res.status(200).send({msg: "success"})
        }
        // -------------------------------------------------------------------------------------------------------------------------------------------------------------
        // ----------------- IF status of show changed => adaptation automatique des shifts en fct de certains changement -----------------------------------
        // -------------------------------------------------------------------------------------------------------------------------------------------------------------
        // delete shifts, if réunion => record the only one shift
        const isPreviousClosed = previousStatus === 'ferme'
        const isPreviousSoiree = previousStatus === 'soiree'
        const isPreviousReunion = previousStatus === 'reunion'
        const isNewClosed = dataRecieved.status === 'ferme'
        const isNewStatusNormalOrReunion = ['normale', 'reunion'].includes(dataRecieved.status);
        const isNewStatusNormalOrSoiree = ['normale', 'soiree'].includes(dataRecieved.status);
        // fermé ==> normal
        // fermé ==> soirée       
        // création de shifts basique
        if (isPreviousClosed && isNewStatusNormalOrSoiree) {
            //////console.log("de fermé à soirée ou normal")
           setBasicalShiftTemplateToShow(dataRecieved.laBilleShowId)
        }
        // normale ==> fermé
        // soirée ==> fermé
        // réunion ==> fermé   
        //suppression de touts les shifts et utilisateurs inscrits   
        else if(!isPreviousClosed && isNewClosed){  
            ////console.log("here")
            await destroyAllShiftsAndUsersOfAShow(dataRecieved.laBilleShowId)
        }
        else if(isNewStatusNormalOrSoiree && dataRecieved.status === 'reunion'){
            await destroyAllShiftsAndUsersOfAShow(dataRecieved.laBilleShowId)
        }
        // soirée ==> normale
        // soirée ==> réunion
        //suppression de touts les shifts entrée et parking et utilisateurs inscrits 
        else if(isPreviousSoiree && !isNewClosed){
            await destroyAllShiftsNotBar(dataRecieved.laBilleShowId)
        }
        // modification des informations du show
        try{            
            actualData.status = dataRecieved.status ? dataRecieved.status : actualData.status
            actualData.soundEngineer = dataRecieved.soundEngineer ? dataRecieved.soundEngineer : actualData.soundEngineer
            //if(dataRecieved.showResponsable && dataRecieved.showResponsable === 'none') actualData.showResponsable = null
            //else if(dataRecieved.showResponsable && dataRecieved.showResponsable !== 'none') actualData.showResponsable = dataRecieved.showResponsable
            actualData.showResponsable = dataRecieved.showResponsable || dataRecieved.showResponsable === null ? dataRecieved.showResponsable : actualData.showResponsable
            actualData.notes = dataRecieved.notes ? dataRecieved.notes : actualData.notes
            const update = await actualData.save()          
            return update ? res.status(200).send({msg : "success"}) : res.status(500).send({msg : "fail"})
        }catch(error){
            //////console.log(error)
            return res.status(500).send({msg: "error_system"})
        }
        
    })
}