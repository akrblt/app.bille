import React, { FunctionComponent, useState, useEffect } from "react";
import './css/planification.css';
import SetRequests from '../services/setters'

type Field = {
    name: string,
    value: string,
    class: string
}
type Holidays = {
    startDate: string,
    endDate: string
}

const Planification: FunctionComponent= () => {
    // -------------------- gestion de l'année demandée ---------------------------------------------
    const [yearToPlanif, setYearToPlanif] = useState<number>((new Date().getFullYear())+1) 
    const handleChangeYear = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newYearSpecified = parseInt(e.target.value) 
        if(newYearSpecified >= new Date().getFullYear()) setYearToPlanif(newYearSpecified)
    }
    useEffect(() => {
        setHolidays({startDate: `${yearToPlanif}-01-01`, endDate: `${yearToPlanif}-01-02`})
    }, [yearToPlanif])
    // -------------------- gestion des période de fermeture/vacances--------------------------------
    const [holidays, setHolidays] = useState<Holidays>({startDate: `${yearToPlanif}-01-01`, endDate: `${yearToPlanif}-01-02`})
    const handleChangeHolidays = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setHolidays((prevHoliday) => ({
            ...prevHoliday, 
            [name]: value
        }))
    }
    // -------------------- gestion du template proposé ---------------------------------------------
    const [weekTemplateToRecord, setWeekTemplateToRecord] = useState<Field[]>([
        {name: "monday", value: "closed", class: "closedValue"},
        {name: "tuesday", value: "closed", class: "closedValue"},
        {name: "wednesday", value: "closed", class: "closedValue"},
        {name: "thursday", value: "closed", class: "closedValue"},
        {name: "friday", value: "closed", class: "closedValue"},
        {name: "saturday", value: "closed", class: "closedValue"},
        {name: "sunday", value: "closed", class: "closedValue"}
    ])
    // add select HTML el after comp loaded => materialize constraint
    useEffect(() => {
        const allSelects: NodeListOf<Element> = document.querySelectorAll('.selectStatus')
        activateSelectElements(allSelects)
    }, []);
    useEffect(() => {
        ////console.log("weekTemplateToRecord ! ")
        const allSelect: NodeListOf<Element> = document.querySelectorAll('.selectStatus')
        activateSelectElements(allSelect)
    }, [weekTemplateToRecord]);

    const handleChangeSelect = (name: string, newValue: string) => {
        ////console.log("handle change ! : ", name, ", ", newValue) 
        // update weekTemplateToRecord
        const newClass = (newValue === 'closed') ? 'closedValue' : 'openValue'       
        const newField: Field =  {name: name, value: newValue, class: newClass}
        const updatedValues: Field[] = weekTemplateToRecord.map((day: Field) => {
            if(day.name === name) return newField 
            return day
        }) 
        setWeekTemplateToRecord(updatedValues)
    }
    const displaySelectElements = (dayName: string, newClass: string|null) => {
        if (!newClass) newClass = 'closedValue'
        return (
            <select name={dayName} className={`selectStatus ${newClass}`} onChange={(e) => handleChangeSelect(e.target.name, e.target.value)}>
                <option value="closed" className="optionBt">Fermé</option>
                <option value="open" className="optionBt">Bar ouvert</option>
            </select>
        )
    }
    const activateSelectElements = (allSelects: NodeListOf<Element>) => {
        allSelects.forEach((select: Element) => {
            (select as HTMLElement).style.display = 'block'; // Applique le style à chaque élément
            if((select as HTMLSelectElement).value === 'open') (select as HTMLSelectElement).className = `selectStatus openValue`
            else if((select as HTMLSelectElement).value === 'closed') (select as HTMLSelectElement).className = `selectStatus closedValue`
        });
    }
    // ------------------------------------------ SUBMIT -----------------------------------------------------------------------------------------------------------------
    const handleSubmitForm = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const dataToRecord: any = {
            year: yearToPlanif,
            template: weekTemplateToRecord,
            closedDates: holidays
        }
        window.alert("L'opération peut prendre un certain temps, ne bouges pas tu seras averti quand c'est bon!")
        const submitData: boolean = await SetRequests.setYearTemplate(dataToRecord)
        const msg: string = submitData ? "La planification a bien été enregistrée" : "Oups, il y a eu un problème"
        window.alert(msg)
    }
    // ------------------------------------------- DOM -----------------------------------------------------------------------------------------------------------------
    return (
        <form>
            {/* MESSAGES */} 
            <h1>Plannification</h1>
            <div id="msg"><p>
                Ce formulaire sert à créer un template d'ouverture du bar pour l'année que vous spécifierez (du 1er janvier au 31 décembre). <br/>
            </p></div>
            <div id="warnMsg">
                <i className="material-icons">report_problem</i>
                <p>Les réunions sont automatiquement fixées au dernier mardi de chaque mois, à changer manuellement si besoin</p>
            </div> 
            {/* YEAR */} 
           <h5>Année à planifier</h5>
           <div id="yearInput">
                <input type="number" value={yearToPlanif} onChange={handleChangeYear}/>
           </div>
           {/* HOLIDAYS / CLOSURES */} 
           <h5>Période de fermeture/vacances</h5>
           <div id="recorded"></div>
           <div id="addHoliday" className="z-depth-4">
                <p>Début : </p><input type="date" name="startDate" min={`${yearToPlanif}-01-01`} max={`${yearToPlanif}-12-31`} value={holidays.startDate} onChange={handleChangeHolidays}/>
                <p>Fin : </p><input type="date" name="endDate" min={`${yearToPlanif}-01-01`} max={`${yearToPlanif}-12-31`} value={holidays.endDate} onChange={handleChangeHolidays}/>
           </div>
           {/* WEEK TEMPLATE */} 
            <h5>Template jours d'ouvertures</h5>
            <div id="dayWeekTemplate" className="z-depth-4">
                <div className="daySection">
                    <p>Lundi</p>
                    <div className="input-field col s12">
                        {displaySelectElements('monday', null)}
                    </div>  
                </div>
                <hr className="teal lighten-2"/> 
                <div className="daySection">
                    <p>Mardi</p>
                    <div className="input-field col s12">
                        {displaySelectElements('tuesday', null)}
                    </div>  
                </div> 
                <hr className="teal lighten-2"/> 
                <div className="daySection">
                    <p>Mercredi</p>
                    <div className="input-field col s12">
                        {displaySelectElements('wednesday', null)}
                    </div>  
                </div>
                <hr className="teal lighten-2"/> 
                <div className="daySection">
                    <p>Jeudi</p>
                    <div className="input-field col s12">
                        {displaySelectElements('thursday', null)}
                    </div>  
                </div>
                <hr className="teal lighten-2"/> 
                <div className="daySection">
                    <p>Vendredi</p>
                    <div className="input-field col s12">
                        {displaySelectElements('friday',null)}
                    </div>  
                </div>
                <hr className="teal lighten-2"/> 
                <div className="daySection">
                    <p>Samedi</p>
                    <div className="input-field col s12">
                        {displaySelectElements('saturday', null)}
                    </div>  
                </div>
                <hr className="teal lighten-2"/> 
                <div className="daySection">
                    <p>Dimanche</p>
                    <div className="input-field col s12">
                        {displaySelectElements('sunday', null)}
                    </div>  
                </div>       
            </div>
            <button id="submitBt" className="btn waves-effect" type="submit" name="action" onClick={handleSubmitForm}>Submit
                <i className="material-icons right">send</i>
            </button>
        </form>
    )
}
export default Planification