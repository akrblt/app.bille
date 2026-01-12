import { FunctionComponent, useEffect, useState } from "react";
import './css/update-notes.css'

type Props = {
    notes: string | null,
    handleChangeNotes: (newNotes: string | null) => void,
    status: string
}

const UpdateNotes: FunctionComponent<Props> = ({ notes, handleChangeNotes, status }) => {
    const [actualNotes, setActualNotes] = useState<string | null>(null)
    const [updated, setUpdated] = useState<boolean>(false)

    useEffect(() => {
        //console.log("notes : ", notes)
        const notesToSet: string |null = (status === 'soiree' && (!notes || notes === "")) ? 
        'Nom événement : salut salut\n' +
        'Horaire :  \n' +
        'Entrée :\n' +
        '\n' +
        'Groupe : \n' +
        'Style : \n' +
        'Contact groupe : \n' +
        'Description : \n' +
        '\n' +
        'Ingé son : \n' +
        'Horaire arrivée :\n' +
        'Horaire sound check :\n' +
        'Line up : \n' +
        '\n' +
        'Resp.Repas : \n' +
        'Nbr pers :  (sans compter bénévoles)\n' +
        'Régime particulier : \n' +
        '\n' +
        'Merch : Oui / Non \n' +
        '\n' +
        'Commentaire :' : notes
        setActualNotes(notesToSet)

    }, [notes,status])
    
    const updateNotes = (newNotesValue: string) => {
        setActualNotes(newNotesValue)
        setUpdated(true)
        //handleChangeNotes(newNotesValue)
    }
    const confirmUpdate = () => {
        handleChangeNotes(actualNotes)
        setUpdated(false)
    }
    return (
        <>
            { updated ? <button onClick={() => confirmUpdate()} className="warning-conf-text-bt">Confirmer changement des notes</button> : null }
            <textarea 
                id="notes-select"
                className={updated ? "warning-conf-text" : ""} 
                value={ actualNotes ?? "" } 
                onChange={(e) => updateNotes(e.target.value)} 
            />
        </>
    )
} 
export default UpdateNotes

