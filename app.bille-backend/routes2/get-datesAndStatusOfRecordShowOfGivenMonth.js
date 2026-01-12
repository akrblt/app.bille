const { getstatusOfShowsOfMonth } = require('./requests');

module.exports = (app) => {
    app.get('/api/getDatesInfosOfGivenDates', async function (req, res) {
        const startDate = req.query.startDate
        const endDate = req.query.endDate
        if(!startDate || !endDate) return res.status(400).send({msg: 'error_400'})
        try{
            const statusOfDates = await getstatusOfShowsOfMonth(startDate, endDate)
            console.log("STATUS :: ", statusOfDates)
            const msg = `success_getAllShowAndShifts`
            return res.status(200).send({msg: msg, data: statusOfDates})
        }catch(error){ 
            res.status(500).json({ msg: 'error_500', error: error });
        }
    }
)}
