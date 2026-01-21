import React, { FunctionComponent, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import Show, { ExtraTime } from '../domain/show/Show'
import ShowManager from '../domain/show/ShowManager'
import showService from '../services/show.service'

import StatusZone from '../components/calendar/calendar-detail2/zone-status'
import ResponsableZone from '../components/calendar/calendar-detail2/zone-responsable'
import Notes from '../components/calendar/calendar-detail2/notes-zone'
import ShiftsContainer from '../components/calendar/calendar-detail2/shifts-container/shifts-container'
import ExtraTimeZone from '../components/calendar/calendar-detail2/zone-extraTime'

import UserConnexion from '../helpers/user-connexion'
import './css/calendar-details.css'

const CalendarDetails: FunctionComponent = () => {
  const { idShow } = useParams<{ idShow: string }>()
  const navigate = useNavigate()

  const [showInfos, setShowInfos] = useState<Show | null>(null)

  // Auth guard
  useEffect(() => {
    if (!UserConnexion.iAmConnected()) {
      navigate('/login')
    }
  }, [navigate])

  // Load show details
useEffect(() => {
  if (!idShow) return

  const load = async () => {
    try {
      const showId = Number(idShow)

      const token = UserConnexion.getUserData()?.token
      console.log('🔑 TOKEN SENT:', token)

      const res = await fetch(
        `http://localhost:3001/api/getDateInfos?idShow=${showId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      )

      console.log('📡 Fetch status:', res.status)
      console.log('📡 Content-Type:', res.headers.get('content-type'))

      // ⛔ body SADECE BİR KEZ okunur
      const text = await res.text()
      console.log('📦 RAW RESPONSE TEXT:', text)

      // JSON değilse burada dur
      if (!res.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Response is not JSON')
      }

      const json = JSON.parse(text)
      console.log('✅ PARSED JSON:', json)

      if (!json.data) {
        throw new Error('No data in response')
      }

      const show = new Show(json.data)
      setShowInfos(show)

    } catch (err) {
      console.error('❌ Erreur chargement show:', err)
    }
  }

  load()
}, [idShow])


  const handleCloseDetails = () => navigate('/calendar')
  const handleGoToUpdate = () => {
    if (!showInfos) return
    navigate(`/calendar/update/${showInfos.id}`)
  }

  const handleChangeResponsable = async (newResponsable: number | null) => {
    if (!showInfos) return
    try {
      const updatedShow = await ShowManager.changeResponsable(showInfos.id, newResponsable)
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
      const updatedShow = await ShowManager.addUserToExtraTime(showInfos.id, newTime.idUser, type)
      setShowInfos(updatedShow)
      window.alert("Merci pour ta participation, n'oublies pas de venir un peu à l'avance.")
    } catch {
      window.alert("Oups, il y a eu un soucis, réessayez plus tard")
    }
  }

  if (!showInfos) return null

  return (
    <div id="CalendarDetails">
      <div id="header-details-buttons">
        {UserConnexion.myAdminLevel() <= 2 && (
          <button id="bt-goTo-update" onClick={handleGoToUpdate}>🛠️</button>
        )}
        <button onClick={handleCloseDetails} className="close-update-bt">X</button>
      </div>

      <div className="title1">{showInfos.formatDateLabel()}</div>

      <div className="statusAndHoraires">
        <div className="label-sub white">
          <StatusZone status={showInfos.status} />
        </div>
        <div className="label-sub orange">{showInfos.id}</div>
      </div>

      {showInfos.status === 'soiree' && (
        <ResponsableZone
          idShow={showInfos.id}
          responsableId={showInfos.showResponsable}
          handleChangeResponsable={handleChangeResponsable}
        />
      )}

      <Notes showNotes={showInfos.notes} status={showInfos.status} />

      {(showInfos.status !== 'ferme' && showInfos.status !== 'reunion') && (
        <ExtraTimeZone type="ouverture" idShow={showInfos.id} />
      )}

      <ShiftsContainer idShow={showInfos.id} />

      {(showInfos.status !== 'ferme' && showInfos.status !== 'reunion') && (
        <ExtraTimeZone type="fermeture" idShow={showInfos.id} />
      )}
    </div>
  )
}

export default CalendarDetails
