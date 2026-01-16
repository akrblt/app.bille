import { FunctionComponent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ShowHandler from "../../../models/show"
import SetRequests from "../../../services/setters"
import UpdateStatus from "./update-status"
import UpdateResponsable from "./update-responsable"
import UpdateNotes from "./update-notes"
import './css/update-show.css'

type Props = { givenShow: ShowHandler }

const UpdateShow: FunctionComponent<Props> = ({ givenShow }) => {   
    const [showInfos, setShowInfos] = useState<ShowHandler | null>(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    // Update state when givenShow prop changes
    useEffect(() => { 
        setShowInfos(givenShow) 
    }, [givenShow])

    // --- Handlers ---
    const handleChangeStatus = (newStatus: string) => {
        if (!showInfos) return
        setShowInfos(showInfos.changeStatus(newStatus))
    }

    const handleChangeResponsable = async (newResponsable: number | null) => {
        if (!showInfos) return
        const updated = await showInfos.changeResponsable(newResponsable)
        setShowInfos(updated)
    }

    const handleChangeNotes = (newNotes: string | null) => {
        if (!showInfos) return
        setShowInfos(showInfos.changeNotes(newNotes))
    }

    const handleConfirmModification = async () => {
        if (!showInfos) return
        try {
            setLoading(true)
            const result = await SetRequests.updateShow(showInfos)
            if (!result || result.msg !== 'success') throw new Error()
            window.alert("Modifications effectuées avec succès")
            navigate(`/calendar/details/${showInfos.laBilleShowId}`)
        } catch (err) {
            console.error(err)
            window.alert("Oups, quelque chose s'est mal passé :S")
        } finally {
            setLoading(false)
        }
    }

    if (!showInfos) return null

    return (
        <div id="update-show-component">
            <p id="warning-message">
                ⚠️ Attention, changer le status NE CHANGERA PAS les shifts. ⚠️
            </p>

            {/* Status */}
            <UpdateStatus 
                status={showInfos.status} 
                handleChangeStatus={handleChangeStatus} 
            />

            {/* Responsable (uniquement pour soirées) */}
            {showInfos.status === 'soiree' && (
                <UpdateResponsable 
                    responsable={showInfos.showResponsable} 
                    handleChangeResponsable={handleChangeResponsable} 
                />
            )}

            {/* Notes */}
            <UpdateNotes 
                notes={showInfos.notes} 
                handleChangeNotes={handleChangeNotes} 
                status={showInfos.status} 
            />

            {/* Confirm button */}
            <div id="confirm-show-update">
                <button 
                    onClick={handleConfirmModification} 
                    disabled={loading}
                >
                    {loading ? "Chargement..." : "Confirmer modifications"}
                </button>
            </div>
        </div>
    )
}

export default UpdateShow
