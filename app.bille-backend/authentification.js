const jwt = require('jsonwebtoken')
require('dotenv').config()

// middleware qui vérifie le token de la requête et laisse passer si valide
function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    //console.log(authHeader)
    const token = authHeader && authHeader.split(' ')[1]
    //console.log(token)
    if(!token){ return res.sendStatus(401) }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err){ console.log(err); return res.sendStatus(401) }
        req.user = user
        next()
    })
}
module.exports = authenticateToken