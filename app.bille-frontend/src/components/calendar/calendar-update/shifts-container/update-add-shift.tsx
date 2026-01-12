import { FunctionComponent, useEffect, useState } from "react";
import Shift from "../../../../models/shifts";
import './css/update-add-shift.css'
import SetRequests from "../../../../services/setters";

type Props = {
    handleAddNewShift: (newShift: Shift, type: string) => void,
    fkShow: number,
    indexToPut: number,
    typeToPut: string,
    startTimeToPut: string | null,
}

const AddShift: FunctionComponent<Props> = ({ fkShow, indexToPut, typeToPut, startTimeToPut, handleAddNewShift}) => {
    const [shiftToAdd, setShiftToAdd] = useState<Shift>(null!)
    
    useEffect(() => {
        const updatedNewShift: Shift = new Shift(
            0, 
            fkShow, 
            typeToPut, 
            2, 
            startTimeToPut ?? "20:00", 
            '00:00', 
            indexToPut,
        )
        setShiftToAdd(updatedNewShift)
    }, [fkShow, indexToPut, startTimeToPut, indexToPut])

    // try db insertion of new shift 
    const addShift = async (newShift: Shift) => {
        const createShift = await SetRequests.createShift(newShift)
        if(createShift.status === 'success'){  
            //console.log("CREATION_DATA : ", createShift.data)
            const idOfNewShift = createShift.data.idShift
            newShift.idShift = idOfNewShift
            handleAddNewShift(newShift, shiftToAdd.type)
        }
        else window.alert("Oups, il y a eu un soucis.")
    }
    return (
        <div id="add-shift-container-bt">
            <button id="add-shift-bt" onClick={() => addShift(shiftToAdd)}>+ Ajouter Shift</button>
        </div>
    )
}
export default AddShift