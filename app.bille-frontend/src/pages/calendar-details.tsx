import React, { FunctionComponent, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import Show from '../domain/show/Show'
import ShowManager from '../domain/show/ShowManager'

import StatusZone from '../components/calendar/calendar-detail2/zone-status'
import ResponsableZone from '../components/calendar/calendar-detail2/zone-responsable'
import Notes from '../components/calendar/calendar-detail2/notes-zone'
import ShiftsContainer from '../components/calendar/calendar-detail2/shifts-container/shifts-container'
import ExtraTimeZone from '../components/calendar/calendar-detail2/zone-extraTime'

import UserConnexion from '../helpers/user-connexion'
import './css/calendar-details.css'

type ExtraTime = {
  idExtraTime: number | null
  idUser: number
  firstname: string
  type: string
}

const CalendarDetails: FunctionComponent = () => {
  const { idShow } = useParams<{ idShow: string }>()
  const navigate = useNavigate()

  const [showInfos, setShowInfos] = useState<Show | null>(null)

  // 🔐 Auth guard (CDC dışı ama mevcut davranış korunuyor)
  useEffect(() => {
    if (!UserConnexion.iAmConnected()) {
      console.log(UserConnexion.iAmConnected());
      console.log(UserConnexion.getUserData());

      navigate('/login')
    }
  }, [navigate])

  // 📥 Load show details
  useEffect(() => {
    if (!idShow) return

    const load = async () => {
      try {
        const showId = parseInt(idShow, 10)
        const show = await ShowManager.load(showId)
        setShowInfos(show)
      } catch (e) {
        console.error('Erreur chargement show', e)
      }
    }

    load()
  }, [idShow])

  // 🔙 Close details
  const handleCloseDetails = () => {
    navigate('/calendar')
  }

  // 🛠️ Go to update
  const handleGoToUpdate = () => {
    if (!showInfos) return
    navigate(`/calendar/update/${showInfos.id}`)
  }

  // 👤 Responsable
  const handleChangeResponsable = async (newResponsable: number | null) => {
    if (!showInfos) return

    try {
      const updatedShow = await ShowManager.changeResponsable(
        showInfos.id,
        newResponsable
      )
      setShowInfos(updatedShow)
      window.alert('Tu es inscrit comme responsable de soirée ! Merci à toi :)')
    } catch {
      window.alert('Erreur lors de la mise à jour du responsable')
    }
  }

  const handleAddUserToExtraTime = async (
  newTime: ExtraTime,
  type: 'ouverture' | 'fermeture'
) => {
  if (!showInfos) return

  try {
    const updatedShow = await ShowManager.addUserToExtraTime(
      showInfos.id,      // showId
      newTime.idUser,    // userId
      type               // 'opening' | 'closure'
    )
    setShowInfos(updatedShow)
    window.alert(
      "Merci pour ta participation, n'oublies pas de venir un peu à l'avance."
    )
  } catch {
    window.alert("Oups, il y a eu un soucis, réessayez plus tard")
  }
}


  if (!showInfos) return null

  return (
    <div id="CalendarDetails">
      <div id="header-details-buttons">
        {UserConnexion.myAdminLevel() <= 2 && (
          <button id="bt-goTo-update" onClick={handleGoToUpdate}>
            🛠️
          </button>
        )}
        <button onClick={handleCloseDetails} className="close-update-bt">
          X
        </button>
      </div>

      {/* Title */}
      <div className="title1">{showInfos.formatDateLabel()}</div>

      <div className="statusAndHoraires">
        <div className="label-sub white">
          <StatusZone status={showInfos.status} />
        </div>
        <div className="label-sub orange">
          {showInfos.formatHoraires()}
        </div>
      </div>

      {/* Responsable */}
      {showInfos.status === 'soiree' && (
        <ResponsableZone
          idShow={showInfos.id}
          responsableId={showInfos.showResponsable}
          handleChangeResponsable={handleChangeResponsable}
        />
      )}

      {/* Notes */}
      <Notes showNotes={showInfos.notes} status={showInfos.status} />

      <>
        {(showInfos.status !== 'ferme' &&
          showInfos.status !== 'reunion') && (
          <ExtraTimeZone
            type="ouverture"
            idShow={showInfos.id}
            
          />
        )}

        <ShiftsContainer idShow={showInfos.id} />

        {(showInfos.status !== 'ferme' &&
          showInfos.status !== 'reunion') && (
          <ExtraTimeZone
            type="fermeture"
            idShow={showInfos.id}
            
          />
        )}
      </>
    </div>
  )
}

export default CalendarDetails
