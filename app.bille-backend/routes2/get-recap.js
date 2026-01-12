
const { Op, fn, col, where } = require("sequelize")
const Shift = require("../models/shift")
const LaBilleShow = require("../models/laBilleShow")
const User = require("../models/user")
const ShiftAsUser = require("../models/shiftAsUser")


module.exports = (app) => {
    app.get('/api/get-recap', async function (req, res) {
        try{
            console.log("get-recap : ", req.query)
            const givenIdUser = req.query.idUser
            const givenMonthNbr = req.query.monthNbr
            const givenYearNbr = req.query.yearNbr
            const count = await Shift.count({
                where: {type: { [Op.ne]: 'reunion' }},
                include: [
                    {
                        model: LaBilleShow,
                        as: 'show', 
                        required: true,
                        where: {
                            [Op.and]: [
                                where(fn('MONTH', col('show.date')), givenMonthNbr),
                                where(fn('YEAR', col('show.date')), givenYearNbr)
                            ]
                        }
                    },{
                        model: User,
                        as: 'shiftUsers', 
                        required: true,
                        where: { idUser: givenIdUser }
                    }
                ],
            });
            console.log("count ::: ", count)
            const dataToReturn = {
                status: count >= 2 ? 'valid' : count === 1 ? 'middle' : 'not-valid',
                monthLabel: formatMonth(givenMonthNbr)
            }
            return res.status(200).send({ status: 'success', data: dataToReturn})
        }catch(error){
            console.log("err ::: ", error)
            return res.status(500).send({status: 'fail', data: null})
        }
    })
}

function formatMonth(monthNumber){
    try{
        const Months = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre']
        return Months[monthNumber-1]
    }catch(err){
        return ''
    }
}