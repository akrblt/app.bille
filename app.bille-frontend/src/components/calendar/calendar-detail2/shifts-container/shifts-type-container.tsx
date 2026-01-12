import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import Shift from '../../../../models/shifts';
import ShiftZone from './shift';

type Props = {
    type: string,
    shifts: Shift[] | null
}

const ShiftsTypeContainer: FunctionComponent<Props> = ({ type, shifts }) => {
    const [allShifts, setAllShifts] = useState<Shift[] | null>(null!)
    useEffect(() => {
        setAllShifts(shifts)
    }, [shifts])
    const formatedTitle = (givenType: string) => {
        return (givenType === 'reunion') ? 'Réunion' : 
                (givenType === 'bar') ? 'Bar' : 
                (givenType === 'entree') ? 'Entrées' :
                (givenType === 'parking') ? 'Parking' : null
    }

    return (
        <div>
            <h5>{ formatedTitle(type) }</h5>
            {
                !allShifts ? null : 
                allShifts.map((shift: Shift, index: number) => {
                    return <ShiftZone shiftData={shift} key={ index } maxUsers={shift.maxUsers} />
                })
            }
        </div>
    )
}
export default ShiftsTypeContainer