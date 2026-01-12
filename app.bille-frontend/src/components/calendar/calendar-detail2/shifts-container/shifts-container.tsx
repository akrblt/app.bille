import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import Shift from '../../../../models/shifts';
import ShiftsTypeContainer from './shifts-type-container';
import ShowHandler from '../../../../models/show';
import GetRequests from '../../../../services/getters';

type Props = {
    idShow: number
}

const ShiftsContainer: FunctionComponent<Props> = ({ idShow }) => {
    const [shiftsTypes, setShiftsTypes] = useState<string[] | null>(null!)
    const [shiftInfos, setShiftInfos] = useState<Shift[] | null>(null)

    useEffect(() => {
        const setShiftForComponent = async() => {
            try{       
                const allShifts: Shift[] | null = await getShiftsInfos(idShow)
                if(!allShifts) throw new Error()
                const typesOfAllShifts: string[] = allShifts.map((shift) => shift.type)
                const typesWithoutDoublons: string[] = [...new Set(typesOfAllShifts)]
                setShiftInfos(allShifts)
                setShiftsTypes(typesWithoutDoublons)
            }catch(error){
                setShiftsTypes(null)
                setShiftInfos(null)
            }
        }
        setShiftForComponent()
    }, [idShow])
    
        
    
    const getAllShiftsOftype = (givenShifts: Shift[], givenType: string) => {
        return givenShifts.filter((shift) => shift.type === givenType)
    }
    const getShiftsInfos = async (idShow: number): Promise<Shift[] | null> => {
        try{
            const rawData: ShowHandler | null = await GetRequests.getDateInfos(idShow)
            //console.log("rawData ::: ", rawData)
            if (!rawData) throw new Error("Aucune donnée reçue")
            return rawData.shifts ?? null
        }catch(err){
            return null
        }
    }
    return (
        <div>
           {
                ( idShow && (shiftsTypes && shiftsTypes.length > 0)) ? 
                    shiftsTypes.map((shiftType: string, index: number) => {
                        return !shiftInfos ? null :
                        <ShiftsTypeContainer type={shiftType} key={index} shifts={getAllShiftsOftype(shiftInfos, shiftType)} />
                    })
                : null
           }
        </div>
    )
}
export default ShiftsContainer