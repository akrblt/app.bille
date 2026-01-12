const express = require('express')
const initDb = require('./db/initDb')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const authenticateToken = require('./authentification')

const app = express()
const port = 3000

// Middlewares
app.use(cors({ origin: true, credentials: true }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

// === ROUTES NON PROTÉGÉES (login, etc.) ===
require('./routes2/login')(app)
require('./routes2/login-confirm')(app)

// === PROTECTION PAR JWT pour les routes API ===
// Regroupe toutes tes routes sous un préfixe /api
const apiRouter = express.Router()
apiRouter.use(authenticateToken)

// Exemple de montage d’une route dans /api
require('./routes2/get-datesAndStatusOfRecordShowOfGivenMonth.js')(app)
require('./routes2/set-year-template.js')(app)
require('./routes2/get-dateInfos.js')(app)
require('./routes2/set-user-to-shift-insert.js')(app)
require('./routes2/set-user-to-shift-delete.js')(app)
require('./routes2/set-update-show.js')(app)
require('./routes2/set-user-to-extraTime-insert.js')(app)
require('./routes2/set-user-to-extraTime-delete.js')(app)
require('./routes2/set-ResponsableOfShow.js')(app)
require('./routes2/get-specific-user.js')(app)
require('./routes2/update-show.js')(app)
require('./routes2/get-my-infos.js')(app)
require('./routes2/get-all-users.js')(app)
require('./routes2/getUserList.js')(app)
require('./routes2/set-create-user.js')(app)
require('./routes2/set-delete-user.js')(app)
require('./routes2/set-update-user.js')(app)
require('./routes2/updateShowShifts.js')(app)
require('./routes2/set-user-reset.js')(app)
require('./routes2/set-shift-update.js')(app)
require('./routes2/set-shift-create.js')(app)
require('./routes2/set-shift-delete.js')(app)
require('./routes2/get-recap.js')(app)

app.use('/api', apiRouter)

// === CATCH-ALL pour React Router ===
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, 'public') })
})
//sync db et def relations modeles
initDb()

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server started on port ${port}`)
})