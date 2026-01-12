import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import './css/notes.css';

type Props = {
    showNotes: string | null,
    status: string | null
}

const Notes: FunctionComponent<Props> = ({showNotes, status}) => {
    const [notes, setNotes] = useState<string | null>(showNotes)
    const [isNotesOpen, setIsNotesOpen] = useState<boolean>(false)

    useEffect(() => {
        setNotes(showNotes)
        setIsNotesOpen(false)
    }, [showNotes])

    const handleChangeNotesState = () => {
        setIsNotesOpen(!isNotesOpen)  
    }

    return (
        <div className='nt-cont'>
            { !notes && !isNotesOpen ? <p id='no-infos'>Pas d'infos spéciales</p> : null }
            { notes && !isNotesOpen ? <div className='notes-bt2'><button id='notesss' onClick={() => handleChangeNotesState()}>Infos</button></div> : null }
            { notes && isNotesOpen ? 
                <>
                    <div className='notes-bt'><button onClick={() => handleChangeNotesState()} >X</button></div>
                    <textarea id='notes-textarea' value={notes} disabled/>
                </>
             : null }
        </div>
    )
}
export default Notes