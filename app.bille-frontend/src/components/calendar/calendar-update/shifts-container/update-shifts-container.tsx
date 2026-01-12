import { FunctionComponent, useEffect, useState } from "react";
import Shift from "../../../../models/shifts";
import UpdateShift from "./update-shift";
import AddShift from "./update-add-shift";
import ShowHandler from "../../../../models/show";
import '../css/update-shifts-container.css'

type Props = {
    idShow: number,
    showInfos: ShowHandler
}

const UpdateShiftsContainer: FunctionComponent<Props> = ({ idShow, showInfos }) => {
    const [barShifts, setBarShifts] = useState<Shift[]>([])
    const [entreeShifts, setEntreeShifts] = useState<Shift[]>([])
    const [parkingShifts, setParkingShifts] = useState<Shift[]>([])
    const [reunionShifts, setReunionShifts] = useState<Shift[]>([])

    useEffect(() => {
        const bar: Shift[] = showInfos.shifts ? filterShifts('bar', showInfos.shifts) : []
        const entree: Shift[] = showInfos.shifts ? filterShifts('entree', showInfos.shifts) : []
        const parking: Shift[] = showInfos.shifts ? filterShifts('parking', showInfos.shifts) : []
        const reunion: Shift[] = showInfos.shifts ? filterShifts('reunion', showInfos.shifts) : []
        setBarShifts(bar)
        setEntreeShifts(entree)
        setParkingShifts(parking)
        setReunionShifts(reunion)
    }, [showInfos])

    const filterShifts = (givenType: string, shiftArray: Shift[]): Shift[] => {
        const filtredArray: Shift[] | undefined = shiftArray.filter((shift: Shift) => shift.type === givenType)
        return filtredArray ?? []
    }
    const handleAddNewShift = (newShift: Shift, type: string) => {
        let newBarShifts = barShifts
        let newEntreeShifts = entreeShifts
        let newParkingShifts = parkingShifts
        let newReunionShifts = reunionShifts
        //console.log("newShift2 ::: ", newShift)
        //console.log("type : ", type)
        if (type === 'bar')  newBarShifts = [...barShifts, newShift];
        else if (type === 'entree') newEntreeShifts = [...entreeShifts, newShift];
        else if (type === 'parking') newParkingShifts = [...parkingShifts, newShift];
        else if(type === 'reunion') newReunionShifts = [...reunionShifts, newShift]

        // Mets à jour les états
        setBarShifts(newBarShifts);
        setEntreeShifts(newEntreeShifts);
        setParkingShifts(newParkingShifts);
        setReunionShifts(newReunionShifts)
    }

    const displayShiftsToUpdates = (givenType: string, shiftsArray: Shift[] | null) => {
        const fkShow: number = idShow
        const lastShift: Shift | null = shiftsArray?.at(-1) ?? null
        const indexToPut: number = calculIndexToPut(lastShift)
        const startTimeToPut: string | null = calculStartTimeToPut(lastShift)
        return (
            <>
                <h5>{ givenType }</h5>
                {  
                    !shiftsArray ? null : 
                    shiftsArray.map((shift: Shift, index: number) => {
                        return <UpdateShift shift={shift} key={index} />
                    })
                }{
                    <AddShift 
                        fkShow={fkShow}
                        typeToPut={givenType}
                        indexToPut={indexToPut}
                        startTimeToPut={startTimeToPut}
                        handleAddNewShift={handleAddNewShift}
                    />
                }
            </>
        )
    }
    const calculIndexToPut = (lastShift: Shift | null): number => {
        try{
            if(!lastShift) throw new Error()
            const res = lastShift.indexForType + 1
            return res
        }catch(err){
            return 0
        }
    }
    const calculStartTimeToPut = (lastShift: Shift | null) => {
        try{
            return lastShift?.endTime ?? null
        }catch(err){
            return null
        }
    }
    return (
        <>
            { (showInfos.status !== 'ferme') ? displayShiftsToUpdates('bar', barShifts) : null }
            { (showInfos.status === 'soiree') ? displayShiftsToUpdates('entree', entreeShifts) : null }
            { (showInfos.status === 'soiree') ? displayShiftsToUpdates('parking', parkingShifts) : null }
            { displayShiftsToUpdates ('reunion', reunionShifts) }

        </>
    )
} 
export default UpdateShiftsContainer