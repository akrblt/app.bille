import { FunctionComponent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import ShowHandler from '../models/show'
import GetRequests from '../services/getters'

import UpdateShiftsContainer from '../components/calendar/calendar-update/shifts-container/update-shifts-container'
import UpdateShow from '../components/calendar/calendar-update/update-show'
import UpdateExtraTime from '../components/calendar/calendar-update/shifts-container/update-extraTime'

import UserConnexion from '../helpers/user-connexion'
import './css/calendar-details.css'

const CalendarUpdate: FunctionComponent = () => {
  const { idShow } = useParams<{ idShow: string }>()
  const navigate = useNavigate()

  const [showInfos, setShowInfos] = useState<ShowHandler | null>(null)
  const [openingExtra, setOpeningExtra] = useState<any[]>([])
  const [closureExtra, setClosureExtra] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // 🔐 Auth + load show infos
  useEffect(() => {
    const init = async () => {
      // Auth guard
      if (!UserConnexion.iAmConnected()) {
        navigate('/login')
        return
      }

      if (UserConnexion.myAdminLevel() >= 3) {
        navigate('/calendar')
        return
      }

      if (!idShow) {
        setError('ID de soirée invalide')
        return
      }

      try {
        setLoading(true)

        const formattedId = parseInt(idShow, 10)
        if (isNaN(formattedId)) throw new Error('ID non valide')

        const dataOfShow = await getShowInfos(formattedId)
        setShowInfos(dataOfShow)

        const opening =
          dataOfShow.extraTimes?.filter(
            (extra: any) => extra.type === 'opening'
          ) || []

        const closure =
          dataOfShow.extraTimes?.filter(
            (extra: any) => extra.type === 'closure'
          ) || []

        setOpeningExtra(opening)
        setClosureExtra(closure)
      } catch {
        setError('Erreur lors du chargement de la soirée')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [idShow, navigate])

  const getShowInfos = async (id: number): Promise<ShowHandler> => {
    const rawData = await GetRequests.getDateInfos(id)
    if (!rawData) throw new Error('Aucune donnée reçue')
    return rawData
  }

  // 🔙 Navigation vers details page
  const handleCloseUpdate = async () => {
    if (!showInfos) {
      window.alert("Impossible de récupérer les informations de la soirée.")
      return
    }

    try {
      // Navigate to details page
      navigate(`/calendar/details/${showInfos.laBilleShowId}`, { replace: false })
    } catch (err) {
      console.error(err)
      window.alert("Erreur lors de la navigation vers la page détails.")
    }
  }

  // ⏳ UI states
  if (loading) return <div className="loading">Chargement...</div>
  if (error) return <div className="error">{error}</div>
  if (!showInfos) return null

  return (
    <div id="CalendarDetails">
      <div id="header-update-buttons">
        <button onClick={handleCloseUpdate} className="close-update-bt">
          X
        </button>
      </div>

      {/* Title */}
      <div className="title1">{showInfos.formatDateLabel()}</div>

      {/* Update show main infos */}
      <UpdateShow givenShow={showInfos} />

      {/* Admin level 1 only */}
      {UserConnexion.myAdminLevel() === 1 && (
        <>
          <UpdateExtraTime
            type="Ouverture"
            subscribtions={openingExtra}
            idShow={showInfos.laBilleShowId}
          />

          <UpdateExtraTime
            type="Fermeture"
            subscribtions={closureExtra}
            idShow={showInfos.laBilleShowId}
          />

          <UpdateShiftsContainer
            idShow={showInfos.laBilleShowId}
            showInfos={showInfos}
          />
        </>
      )}
    </div>
  )
}

export default CalendarUpdate
