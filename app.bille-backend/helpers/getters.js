const { Op, Sequelize } = require('sequelize')
const LaBilleShow = require('../models/laBilleShow')
const Shift = require('../models/shift')
const User = require('../models/user')
const ShiftAsUser = require('../models/shiftAsUser')
const ExtraTime = require('../models/extraTime')

// -----------------------------------------------------------------------------------------------------------------
// ---------------------------------------------- get show infos ---------------------------------------------------

async function getAllInfosOfShow(idShow){
    ////////console.log("IDSHIW ::: ", idShow)
    try{
        const showInfos = await LaBilleShow.findOne({
            where: {laBilleShowId: idShow },
            include: [{
                model: Shift,
                as: 'shifts',
                required: false,
                include: [{
                    model: User,
                    as: 'shiftUsers',
                    required: false,
                    through: {
                        model: ShiftAsUser,
                        //attributes: [] // pour ne pas inclure les attributs de la table pivot
                    }
                }],
                //order: [['startTime', 'ASC']]
            }],
            order: [[{ model: Shift, as: 'shifts' }, 'indexForType', 'ASC']] // Mettre l'ordre ici
        });
        ////////console.log("showINFOS ::: ", showInfos.dataValues)
        const formatedShifts = showInfos.dataValues.shifts.map((shi) => {
            // formatage des données du user
            const userShift = shi.dataValues.shiftUsers.map((us) => {
                 return{
                    idSubscribe: us.dataValues.shiftAsUser.dataValues.idShiftAsUser,
                    idUser: us.dataValues.idUser,
                    username: us.dataValues.firstname
                }
            })
            // formatage des données du shift
            return {
                idShift: shi.dataValues.idShift,
                fkLaBilleShow: shi.dataValues.fkLaBilleShow,
                type: shi.dataValues.type,
                maxUsers: shi.dataValues.maxUsers,
                startTime: shi.dataValues.startTime,
                endTime: shi.dataValues.endTime,
                indexForType: shi.dataValues.indexForType,
                users: userShift
            }
        })
        const formattedShowData = {
            laBilleShowId: showInfos.dataValues.laBilleShowId,
            date: showInfos.dataValues.date,
            notes: showInfos.dataValues.notes,
            showResponsable: showInfos.dataValues.showResponsable,
            soundEngineer: showInfos.dataValues.showResponsable,
            status: showInfos.dataValues.status,
            shifts: formatedShifts
        };
        ////////console.log("showData2 :::: ", formattedShowData);
        return formattedShowData;
    }catch(error){
        ////////console.log(error)
    }
}

// -----------------------------------------------------------------------------------------------------------------
async function getAllShowAndShifts(idShow){
    ////////console.log("idShow : ", idShow)
    try{
        // get show and shifts
        const allShowsInfos = await LaBilleShow.findOne({
            where: {laBilleShowId: idShow },
            include: [{
                model:Shift ,
                as: 'shifts'
            }],
        });
        //////////console.log("allShowsInfos : ", allShowsInfos.dataValues)
        let allShifts = []
        if(!allShowsInfos.dataValues.shifts) return allShowsInfos.dataValues
        //allShowsInfos.dataValues.shifts.map((shi) => {
        for await (shi of allShowsInfos.dataValues.shifts){
            const shift = shi.dataValues
            const users = await getUsersSubscribedToShift(shift.idShift)
            const result = {...shift, users: users}
            return result
        }
        ////////console.log("allShowsInfos : ", allShowsInfos.dataValues)
        allShowsInfos.dataValues.shifts.map((shi) =>{
            ////////console.log("shi: ", shi)
        })
        return allShowsInfos || null
    }catch(error){
        ////////console.log(error)
    }
}
async function getShiftRelations(idShift){
    try{
        // récupération des relation
        const subscribtion = await ShiftAsUser.findAll({
            where: { idShift: idShift }
        })
        return subscribtion ?? null
    }catch(err){
        ////console.log(err)
        return null
    }
}
// return the "shiftAsUser" linked to a shift (for delete)
async function getUsersSubscribedToShift(idShift){
    try{
        // récupération des relation
        const users = await ShiftAsUser.findAll({
            where: { idShift: idShift }
        })
        ////////console.log("USERS : ", users)
        if(!users || users.length == 0) return []
        let result = []
        // recuperation du firstname et formatage data
        for await (userData of users){ 
            const user = userData.dataValues
            ////////console.log("user : ", user)
            result.push({
                idSubscribtion: user.idShiftAsUser,
                idUser: user.idUser,
                username: await getUserName(user.idUser)
            })
            ////////console.log("result : ", result)
        }
        ////////console.log("res : ", result)
        return result
    }catch(error){
        return null
    }
}
async function getUserName(idUser){
    if(!idUser) return null
    ////////console.log("idUser : ", idUser)
    const name = await User.findOne({where: {idUser: idUser}})
    ////////console.log("name : ", name)
    return name ? name.dataValues : null
}
// ----------------------------------------------------------------------------------------------------------------
// -------------------------------------- other -------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------
/*
async function getAllShowAndShifts(month, year){
    const allShowsFromMonth = await LaBilleShow.findAll({
        where: {
            [Op.and]: [
                Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('laBilleShow.date')), month),
                Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('laBilleShow.date')), year),
            ],
        },
        include: [{
            model: Shift,
            as: 'shifts',
            required: false,
            include: [{
                model: User,
                as: 'shiftUsers',
                required: false,
                through: {
                    model: ShiftAsUser,
                    attributes: [] // pour ne pas inclure les attributs de la table pivot
                }
            }],
            //order: [['startTime', 'ASC']]
        }],
        order: [[{ model: Shift, as: 'shifts' }, 'indexForType', 'ASC']] // Mettre l'ordre ici
    });
    return allShowsFromMonth || null
}*/
function getToday(){
    return new Date().toISOString()
}
async function getAllShiftsOfUser(idUser){
    const today = getToday()
    const allShiftsOfUser = await LaBilleShow.findAll({
        where: { date: { [Op.gte]: today }},
        include: [{
            model: Shift,
            as: 'shifts',
            required: false,
            include: [{
                model: User,
                as: 'shiftUsers',
                where: { idUser: idUser },
                through: {
                    model: ShiftAsUser,
                    attributes: [] 
                }
            }],
        }],
        attributes: ['date', 'laBilleShowId'],
        order: [['date', 'ASC']] 
    });
    const dataFiltred = allShiftsOfUser.filter((show) => { return show.shifts.length > 0 })
    //console.log("allShiftsOfUser : ", dataFiltred)
    return dataFiltred 
}
/*
async function getCountOfShiftsOfUserForSpecificMonth(userId, month, year){
    try{*/
        //////////console.log("month : ", month)
        //////////console.log("yeaar : ", year)
        /*const allShowsWhereUserIsShifted = await LaBilleShow.findAll({
            where: { [Op.and]: [
                Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('laBilleShow.Date')), month), // Correcte avec le champ 'Date'
                Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('laBilleShow.Date')), year),
            ],},
            include: [{
                model: Shift,
                as: 'shifts',
                required: true,
                include: [{
                    model: User,
                    as: 'shiftUsers',
                    where: { idUser: userId },
                    through: {
                        model: ShiftAsUser,
                        attributes: [] // pour ne pas inclure les attributs de la table pivot
                    }
                }],
            }],
        })*/
       /*
        const allShowsWhereUserIsShifted = await LaBilleShow.findAll({
            where: { [Op.and]: [
                Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('laBilleShow.Date')), month), // Correcte avec le champ 'Date'
                Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('laBilleShow.Date')), year),
            ]},
            include: [{
                model: Shift,
                as: 'shifts',
                required: true,
                include: [{
                    model: User,
                    as: 'shiftUsers',
                    where: { idUser: userId },
                    through: {
                        model: ShiftAsUser,
                        attributes: [] // pour ne pas inclure les attributs de la table pivot
                    }
                }],
            }],
        })
        //////////console.log("allShowsWhereUserIsShifted : ", allShowsWhereUserIsShifted)
        let count = 0
        if(!allShowsWhereUserIsShifted || allShowsWhereUserIsShifted.length === 0){
            //////////console.log("no shift subscribed")
            return count
        }
        ////////////console.log("all shows where user is subscribed : ", allShowsWhereUserIsShifted.map(sh => sh.dataValues))
        allShowsWhereUserIsShifted.forEach(show => {           
            if(show.shifts.length > 0) { //////////console.log("show.shifts.length PLUS GRAND QUE 0 : ", show.shifts.length) }
            count += show.shifts.length
        })
        //////////console.log("result : ", count)
        return count //allShiftsOfUser ? allShiftsOfUser.length : 0
    }catch(error){
        //////////console.log(error)
        return 0
    }
}
    */
// this get function take the date and return the value of show if found
// return null if not found
async function getShowByDate(date){
    try{
        const dateLooked = new Date(date).toISOString()
        const existingShow = await LaBilleShow.findOne({where: { date: dateLooked}})
        return existingShow ? existingShow : null
    }catch(error){
        //////////console.log("erreur getShowByDate: ", error)
        return null
    }   
}
async function getShowById(idShow){
    try{
        const existingShow = await LaBilleShow.findOne({where: { laBilleShowId: idShow}})
        return existingShow ? existingShow : null
    }catch(error){
        //////console.log("erreur getShowByDate: ", error)
        return null
    }   
}
/*
const allShiftOfAshow = await Shift.findAll({
            where: {fkLaBilleShow: fkShow},
            include: [{
                model: User,
                as:  'shiftUsers', //'userShifts',
                through: {
                    model: ShiftAsUser,
                }
            }],
        })
*/
async function getAllShiftsOfAshow(fkShow){
    try{   
        ////////console.log("fkshow : ", fkShow)
        const allShiftOfAshow = await Shift.findAll({
            where: { fkLaBilleShow: fkShow },
            include: [
                {
                    model: User,
                    as: 'shiftUsers',
                    through: {
                        model: ShiftAsUser,
                        //attributes: ['idShiftAsUser'], // Récupère uniquement l'id de la relation
                    },
                    attributes: ['idUser', 'firstname', 'status'], // Choisissez les champs utilisateurs à récupérer
                },
            ],
        });
        if(!allShiftOfAshow) return []
        if(allShiftOfAshow){
            const formatedShifts = allShiftOfAshow.map(shift => shift.dataValues);
            return formatedShifts.length > 0 ? formatedShifts : []
        }
        return null
    }catch(error){
        return null
    }
}
async function getAllShiftsForUpate(idShow){
    //console.log("IDSHOW :: ", idShow)
    try{
        const allShiftOfAshow = await Shift.findAll({
            where: { fkLaBilleShow: idShow },
        });
        const shiftsWithUsers = await Promise.all(allShiftOfAshow.map(async (shift) => {
            const usersOfShifts = await ShiftAsUser.findAll({where: {idShift: shift.idShift}})
            return { ...shift, users: usersOfShifts ?? [] }
        }))
        //console.log("allShiftOfAshow : ", shiftsWithUsers)
        if(!shiftsWithUsers) throw new Error()
        return shiftsWithUsers
    }catch(error){
        //console.log(error)
        return []
    }
}
async function getDateOfShift(fkShow){
    try{
        const dateOfShift = await LaBilleShow.findOne(
            {
                where: { laBilleShowId : {fkShow} },
                attributes: ['date']
            }
        )
        return dateOfShift ? dateOfShift.dataValues : null
    }catch(error){
        //////////console.log("error getDateOfShift : ", error)
        return null
    }
}
async function getAllRecordedSoiree(){
    const today = getToday()
    try{
        const allRecords = await LaBilleShow.findAll({ 
            where: { [Op.and]: 
                [ 
                    {date: { [Op.gte]: today}},
                    {status: 'soirée'}
                ]},
                include: [{
                    model: Shift,
                    as: 'shifts',
                    required: false, 
                }],
                order: [['date', 'asc'],[{ model: Shift, as: 'shifts' }, 'indexForType', 'ASC']] 
                
        })
        const filtredResult = allRecords ? allRecords.map((rec) => {
            const filtredShifts = Array.isArray(rec.shifts) ? rec.shifts.map(shift => {
                return {
                    ...shift.dataValues,
                    startTime: shift.startTime.slice(0, 5), 
                    endTime: shift.endTime.slice(0, 5)      
                };
            }) : []
            return {
                ...rec.dataValues,
                shifts: filtredShifts
            };
        }) : null;
        return filtredResult || null;
    }catch(error){
        //////////console.log("erreur : ", error)
        return null
    }   
}

async function getUserList(){
    const userList = await User.findAll({
        attributes: ['idUser', 'firstname'],
        order:[['firstname', 'ASC']]
    })
    return userList ? userList.map(user => user.dataValues) : []
}

// return given shift and all users subscribed
async function getConcernedShift(idShift){
    const allShifts = await Shift.findOne({
        where: {idShift : idShift},
        include: [{
            model: User,
            as: 'shiftUsers',
            through: {
                model: ShiftAsUser,
                attributes: [] 
            }
        }],
    })
    allShifts.shiftUsers.map(user => user.dataValues)
    const shiftUsers = allShifts.shiftUsers ? allShifts.shiftUsers.map(user => user.dataValues) : [];

    return {
        ...allShifts.dataValues,
        shiftUsers, 
    };
}
async function getAllShiftsAndUsersOfAshow(idShow){
    const allShifts = await Shift.findAll({
        where: {fkLaBilleShow : idShow},
    })
    return allShifts
}
async function getShiftSubscribtion(idUser, idShift){
    try{
        const shiftSubscribtion = await ShiftAsUser.findOne({
            where: {
                [Op.and]: [
                    {idUser: idUser},
                    {idShift: idShift}
                ]
            }
        })
        return shiftSubscribtion ? shiftSubscribtion : null
    }catch(error){
        //////////console.log("error : ", error)
        return null
    }
}
async function getShiftById(idShift){
    try{
        const shiftToReturn = await Shift.findOne({ where: {idShift: idShift}})
        const shiftAsUserToReturn = shiftToReturn ? await ShiftAsUser.findAll({ where: { idShift: idShift } }) : null
        return { shift: shiftToReturn, shiftAsUser: shiftAsUserToReturn}
    }catch(error){
        //////////console.log(error)
        return null
    }
}
async function getUserById(idUser){
    try{
        const userConcerned = await User.findOne({ where: {idUser: idUser}})
        return userConcerned ? userConcerned.dataValues :null
    }catch(error){
        //////////console.log(error)
        return null
    }
}
async function getUserByIdForUpdate(idUser){
    //console.log("getUserByIdForUpdate : ", idUser)
    try{
        const userConcerned = await User.findOne({ where: {idUser: idUser, status: true}})
        //console.log("userConcerned :: ", userConcerned)
        return userConcerned ?? null
    }catch(error){
        //console.log(error)
        return null
    }
}
async function getPreviousStatusOfShow(idShow){
    try{
        const previousStatus = await getShowById(idShow)
        return previousStatus.dataValues.status ? previousStatus.dataValues.status : null
    }catch(error){
        return null
    }
}
async function getUsersOfOpeningAndClosure(idShow){
    try{
        const times = await ExtraTime.findAll({
            where: {    fkLaBilleShow: idShow   }
        });
        if(!times || times.length === 0) return null
        const usersFirstname = await Promise.all(times.map(async(time) => {
            const user = await User.findOne({ where: { idUser: time.dataValues.fkUser }})
            return user ? { type: time.dataValues.type, firstname: user.dataValues.firstname, idUser: user.dataValues.idUser }: null
        }))
        return usersFirstname || 'no-data'
    }catch(error){
        //////////console.log("erreur req : ", error)
        return 'error'
    }
}
async function getExtraTimesOfShow(idShow){
    try{
        const timesFounded = await ExtraTime.findAll({where: {fkLaBilleShow: idShow}})
        const filtredDate = timesFounded.map((time) => { return time.dataValues })
        if(!timesFounded || timesFounded.length === 0) return []

        const extraTimeToSend = await Promise.all(filtredDate.map(async (time) => {
            const concernedUser = await getUserById(time.fkUser)
            const extraTime = {
                idExtraTime: time.idExtraTime,
                idUser: concernedUser.idUser,
                firstname: concernedUser.firstname,
                type: time.type
            }
            return extraTime
        }))
        //////console.log("extraTimeToSend : ", extraTimeToSend)
        return extraTimeToSend
    }catch(error){
        //////console.log(error)
        return []
    }
}

async function getExtraTimeByUserAndTypeAndShow(idUser, type, idShow){
    try{
        const concernedTime = await ExtraTime.findOne({
            where: { [Op.and]: [
                { fkUser: idUser },
                { fkLaBilleShow: idShow },
                { type: toString(type) }
            ]},
        })
        return concernedTime ? concernedTime : null
    }catch(error){
        //////////console.log(error)
        return null
    }
}

module.exports = {
    getAllShowAndShifts,
    getAllShiftsOfAshow,
    getShowByDate,
    getAllShiftsOfUser,
    getDateOfShift,
    getAllRecordedSoiree,
    getUserList,
    getConcernedShift,
    getShiftSubscribtion,
    getAllShiftsAndUsersOfAshow,
    getShowById,
    getUsersSubscribedToShift,
    getPreviousStatusOfShow,
    getShiftById,
//    getCountOfShiftsOfUserForSpecificMonth,
    getUserById,
    getUsersOfOpeningAndClosure,
    getExtraTimeByUserAndTypeAndShow,
    getExtraTimesOfShow,
    getAllInfosOfShow,
    getShiftRelations,
    getUserByIdForUpdate,
    getAllShiftsForUpate
}