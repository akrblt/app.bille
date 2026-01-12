const { getUserList } = require('../helpers/getters')

module.exports = (app) => {
    app.get('/api/getUserList', async function (req, res) {
        try{
            const userList = await getUserList()
            const msg = userList ? `success_getUserList` : `error_getUserList`
            const status = userList ? 200 : 500
            res.status(status).send({msg: msg, data: userList})
        }catch(error){
            //////console.log(error)
            res.status(500).json({ msg: 'error_getUserList', error: error });
        }
    }
)}