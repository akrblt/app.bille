import { FunctionComponent, useEffect, useState } from "react"
import Shift from "../../../../models/shifts"
import UpdateShift from "./update-shift"
import AddShift from "./update-add-shift"
import ShowHandler from "../../../../models/show"
import '../css/update-shifts-container.css'

type Props = {
    idShow: number
    showInfos: ShowHandler
}

const UpdateShiftsContainer: FunctionComponent<Props> = ({ idShow, showInfos }) => {
    const [barShifts, setBarShifts] = useState<Shift[]>([])
    const [entreeShifts, setEntreeShifts] = useState<Shift[]>([])
    const [parkingShifts, setParkingShifts] = useState<Shift[]>([])
    const [reunionShifts, setReunionShifts] = useState<Shift[]>([])

    // ✅ Load shifts on showInfos change
    useEffect(() => {
        if (!showInfos?.shifts) return

        setBarShifts(filterShifts('bar', showInfos.shifts))
        setEntreeShifts(filterShifts('entree', showInfos.shifts))
        setParkingShifts(filterShifts('parking', showInfos.shifts))
        setReunionShifts(filterShifts('reunion', showInfos.shifts))
    }, [showInfos])

    const filterShifts = (type: string, shifts: Shift[]): Shift[] => {
        if (!shifts?.length) return []
        return shifts.filter(shift => shift.type === type) ?? []
    }

    const handleAddNewShift = (newShift: Shift, type: string) => {
        if (!newShift || !type) return

        switch (type) {
            case 'bar':
                setBarShifts(prev => [...prev, newShift])
                break
            case 'entree':
                setEntreeShifts(prev => [...prev, newShift])
                break
            case 'parking':
                setParkingShifts(prev => [...prev, newShift])
                break
            case 'reunion':
                setReunionShifts(prev => [...prev, newShift])
                break
            default:
                console.warn(`Unknown shift type: ${type}`)
        }
    }

    const displayShiftsToUpdate = (type: string, shifts: Shift[]) => {
        const lastShift = shifts?.at(-1) ?? null
        const indexToPut = lastShift?.indexForType != null ? lastShift.indexForType + 1 : 0
        const startTimeToPut = lastShift?.endTime ?? null

        return (
            <>
                <h5>{type}</h5>
                {shifts?.map((shift, i) => <UpdateShift shift={shift} key={i} />)}
                <AddShift
                    fkShow={idShow}
                    typeToPut={type}
                    indexToPut={indexToPut}
                    startTimeToPut={startTimeToPut}
                    handleAddNewShift={handleAddNewShift}
                />
            </>
        )
    }

    return (
        <>
            {showInfos.status !== 'ferme' && displayShiftsToUpdate('bar', barShifts)}
            {showInfos.status === 'soiree' && displayShiftsToUpdate('entree', entreeShifts)}
            {showInfos.status === 'soiree' && displayShiftsToUpdate('parking', parkingShifts)}
            {displayShiftsToUpdate('reunion', reunionShifts)}
        </>
    )
}

export default UpdateShiftsContainer
