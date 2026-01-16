// src/components/calendar/calendar-detail2/zone-extraTime.tsx
import React, { FunctionComponent, useEffect, useState } from 'react'
import UserConnexion from '../../../helpers/user-connexion'
import ShowManager from '../../../domain/show/ShowManager'
import Show from '../../../domain/show/Show'
import './css/extratime.css'

type ExtraTime = {
  idExtraTime: number | null
  idUser: number
  firstname: string
  type: 'opening' | 'closure'
}

type Props = {
  idShow: number
  type: 'opening' | 'closure'
}

const ExtraTimeZone: FunctionComponent<Props> = ({ idShow, type }) => {
  const [showInfos, setShowInfos] = useState<Show | null>(null)
  const [timeType, setTimeType] = useState('')
  const [concernedTimes, setConcernedTimes] = useState<ExtraTime[]>([])
  const [userIn, setUserIn] = useState(false)

  // Load show details
  useEffect(() => {
    const loadShow = async () => {
      try {
        const show = await ShowManager.load(idShow)
        setShowInfos(show)
      } catch (e) {
        console.error('Error loading show:', e)
      }
    }
    loadShow()
  }, [idShow])

  // Filter extra times for the current type (opening/closure)
  useEffect(() => {
    if (!showInfos) return

    setTimeType(type === 'opening' ? 'Ouverture' : 'Fermeture')
    const filteredTimes =
      showInfos.extraTimes?.filter(t => t.type === type) ?? []

    setConcernedTimes(filteredTimes)
    setUserIn(filteredTimes.some(t => t.idUser === UserConnexion.myUserId()))
  }, [type, showInfos])

  const handleExtraTimeSubscription = async (status: 'add' | 'remove') => {
    if (!showInfos) return

    try {
      const idUser = UserConnexion.myUserId()
      let updatedShow: Show | null = null

      if (status === 'add') {
        updatedShow = await ShowManager.addUserToExtraTime(
          showInfos.id,
          idUser,
          UserConnexion.myLogin(),
          type
        )
      } else {
        const userEntry = concernedTimes.find(t => t.idUser === idUser)
        if (!userEntry || !userEntry.idExtraTime) return
        // ✅ Updated call with showId + extraTimeId
        updatedShow = await ShowManager.removeUserFromExtraTime(
          showInfos.id,
          userEntry.idExtraTime
        )
      }

      if (updatedShow) setShowInfos(updatedShow)
    } catch (e) {
      console.error('ExtraTime Error:', e)
      window.alert("Oups, there was an error. Please try again later.")
    }
  }

  if (!showInfos) return null

  return (
    <div id="extraTimes_container">
      <div className="extra-tit">
        <h6><strong>{timeType}</strong></h6>
        {!userIn ? (
          <button onClick={() => handleExtraTimeSubscription('add')}>
            S'inscrire
          </button>
        ) : (
          <button onClick={() => handleExtraTimeSubscription('remove')}>
            Désinscrire
          </button>
        )}
      </div>

      <div className="users-extra">
        {concernedTimes.length > 0
          ? concernedTimes.map(u => <p key={u.idUser}>{u.firstname}</p>)
          : <p>Personne :(</p>}
      </div>
    </div>
  )
}

export default ExtraTimeZone
