const { getAllShiftsOfUser } = require('../helpers/getters')

module.exports = (app) => {
    app.get('/api/getMyInfos', async function (req, res) {
        const idUser = req.query.idUser
        const allShifts = await getAllShiftsOfUser(idUser)
        //console.log("endpoint : ", allShifts)
        const msg = allShifts ? 'success' : 'fail'
        const status = allShifts ? 200 : 500     
        return allShifts ? res.status(status).send({data: allShifts, msg: msg}) : res.status(status).send({msg: msg})
    })
}