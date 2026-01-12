const { destroyAllShiftsAndUsersOfAShow, setBasicalShiftTemplateToShow, destroyAllShiftsNotBar } = require('../helpers/setters')
const { getShowById } = require('../helpers/getters')

module.exports = (app) => {
    app.post('/api/updateShowInformations', async (req, res) => {  
        const dataRecieved = req.body
        //console.log("dataRecieved :::: ", dataRecieved)
        try{
            if(!dataRecieved.laBilleShowId) throw new Error()
            const actualData = await getShowById(dataRecieved.laBilleShowId)
            actualData.showResponsable = dataRecieved.showResponsable
            actualData.status = dataRecieved.status
            actualData.notes = dataRecieved.notes
            const update = await actualData.save() 
            if(!update) throw new Error()         
            return res.status(200).send({msg : "success"}) 
          }catch(error){
            //console.log(error)
            return res.status(500).send({msg: "error_system"})
        }
    })
}