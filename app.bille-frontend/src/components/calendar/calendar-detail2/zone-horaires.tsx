import React, { FunctionComponent, useEffect, useState } from 'react';
type Props = {
    schedule: string
}
const ScheduleZone: FunctionComponent<Props> = ({schedule}) => {
    const [formatedStatus, setFormatedStatus] = useState<string>(null!)
    
    useEffect(() => {
        
    }, [])

    return (
            <p className='stickerBlue'>
                {  }
            </p>
        )
}
export default ScheduleZone;