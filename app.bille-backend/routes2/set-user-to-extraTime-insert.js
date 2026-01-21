const { setUserToExtraTimeOfShow } = require('../helpers/setters')
const { checkIdUserAlreadySubsribedToGivenOpeningOrClosure } = require('../helpers/checks')

module.exports = (router) => {
  router.post('/set-user-to-extraTime-insert', async (req, res) => {
    try {
      const { fkShow, idUser, type } = req.body

      console.log('📥 BODY:', req.body)

      if (!fkShow || !idUser || !type) {
        return res.status(400).json({ msg: 'error_missing_params' })
      }

      const already = await checkIdUserAlreadySubsribedToGivenOpeningOrClosure(
         fkShow,
        idUser,
        type
      )

      if (already) {
        return res.status(400).json({ msg: 'error_already_subscribed' })
      }

      const result = await setUserToExtraTimeOfShow(fkShow, idUser, type)

      if (result !== 'success') {
        return res.status(500).json({ msg: 'error_insert_failed' })
      }

      return res.status(200).json({ msg: 'success' })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ msg: 'fail' })
    }
  })
}
