import React, { FunctionComponent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import ShowManager from '../../../domain/show/ShowManager'

// COMPONENTS
import StatusZone from '../calendar-detail2/zone-status'
import ResponsableZone from '../calendar-detail2/zone-responsable'
import Notes from '../calendar-detail2/notes-zone'
import ShiftsContainer from '../calendar-detail2/shifts-container/shifts-container'
import ExtraTimeZone from '../calendar-detail2/zone-extraTime'

// CSS
import '../../../pages/css/calendar-details.css'

const CalendarDetails: FunctionComponent = () => {
  const { id } = useParams()

  const [showInfos, setShowInfos] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const result = await ShowManager.load(Number(id))
        setShowInfos(result)
      } catch (error) {
        console.error('Erreur chargement show', error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  /* */
  const handleChangeResponsable = (responsableId: number) => {
    setShowInfos((prev: any) => ({
      ...prev,
      responsableId,
    }))
  }

  if (loading) return <div>Chargement...</div>
  if (!showInfos) return <div>Aucune donnée</div>

  return (
    <div className="calendar-details-container">
      <StatusZone status={showInfos.status} />

      <ResponsableZone
        responsableId={showInfos.responsableId}
        idShow={showInfos.id}
        handleChangeResponsable={handleChangeResponsable}
      />

      <Notes
        showNotes={showInfos.notes}
        status={showInfos.status}
      />

      <ShiftsContainer idShow={showInfos.id} />

      {showInfos.status !== 'ferme' && showInfos.status !== 'reunion' && (
        <ExtraTimeZone
          type="closure"
          idShow={showInfos.id}
          
        />
      )}
    </div>
  )
}

export default CalendarDetails
