const { setShow, setShiftToShow } = require('../helpers/setters')
const { getShowByDate } = require("../helpers/getters")

// endpoint de création d'une nouvelle soirée
// supprime toutes les données liée à la date
module.exports = (app) => {
    app.post('/api/updateShow', async (req, res) => {  
      //////console.log("input saveshow : ", req.body)
        const recievedShow = req.body
        const dateConcerned = recievedShow.date
        const recordedShow = await getShowByDate(dateConcerned) 
        if(recordedShow){
            await recordedShow.destroy() // delete ttes data en rapport avec le show enregistré
        }
        const insertShow = await setShow(recievedShow)
        const insertShifts = recievedShow.shifts && recievedShow.shifts.length > 0 ? await setShiftToShow(recievedShow.shifts, insertShow.laBilleShowId) : []
        insertShow.shifts = insertShifts ? insertShifts : []
        return res.status(200).send({data: insertShow})
    })
}
/*
req.body :  {
  date: '2024-10-31',
  notes: null,
  soundEngineer: null,
  showResponsable: null,
  status: 'soirée',
  shifts: [
    {
      type: 'bar',
      maxUsers: 2,
      startTime: '22:00',
      endTime: '00:00',
      users: null
    },
    {
      type: 'bar',
      maxUsers: 2,
      startTime: '00:00',
      endTime: '02:00',
      users: null
    },
    {
      type: 'entrée',
      maxUsers: 2,
      startTime: '20:00',
      endTime: '22:00',
      users: null
    }
  ]
}
*/