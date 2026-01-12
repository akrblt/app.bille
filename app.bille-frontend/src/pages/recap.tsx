import { FunctionComponent, useState } from "react";
import RecapDetails from "../components/recap/recap-details";

const Recap: FunctionComponent = () => {
    
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())

    const handleChangeSelectedYear = (newValue: number): void => {
        setSelectedYear(newValue)
    }
    const incrementYear = () => setSelectedYear(selectedYear+1)
    const decrementYear = () => setSelectedYear(selectedYear-1)

    return (
        <div id="recap-component">
            <h4>Récap</h4>
            <div id="handleYearRecap">
                <button className="year-bt" onClick={() => decrementYear()}>-</button>
                <input className="year-labl" type="text" value={selectedYear} />
                <button className="year-bt" onClick={() => incrementYear()}>+</button>
            </div>
            <RecapDetails year={selectedYear}/>
        </div>
    )
}

export default Recap