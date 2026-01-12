const { checkExistingTemplate, setShowAndShifts, getFormatedDate, getAllDatesYear, getDayName, setDayTemplate } = require('./set-year-template-helpers')

module.exports = (app) => {
    app.post('/api/setYearTemplate', async function (req, res) {
        //////console.log(req.body)
        try{
            const year = req.body.year
            const closedDates = req.body.closedDates
            const template = req.body.template
            //console.log("template : ", template)
            if(!year || !closedDates || !template) return res.status(400).send({msg: 'error_missing_data'})

            // ---------------- check is template already set -------------------------------
            const templateAlreadySet = await checkExistingTemplate(year)
            //console.log("templateAlreadySet : ", templateAlreadySet)
            if(templateAlreadySet) throw {status: 400, msg: 'error_already_set'}

            // ---------------- prepare data of the year according to template -------------------------------
            const allDatesOfYear = await getAllDatesYear(year)
            //console.log("allDatesOfYear : ", allDatesOfYear)
            let dataPrepared = []
            // création des templates de shows/shifts pour chaque date de l'année selon le template d'ouverture par semaine donné
            for await (const date of allDatesOfYear){ 
                const formatedDataForDate = await setDayTemplate(template, getDayName(date), getFormatedDate(date))
                dataPrepared.push(formatedDataForDate)
            }
            //console.log("dataPrepared : ", dataPrepared)      
            // ---------------- insert data of the year according to template -------------------------------
            for await (const {show, shifts} of dataPrepared){
                await setShowAndShifts(show, shifts)
            }
            return res.status(200).send({msg: 'success'})
        }catch(exception){
            //console.log(exception)
            const status = exception.status || 500
            const message = exception.msg || exception
            return res.status(status).send({msg: message})
        }
    })  
}