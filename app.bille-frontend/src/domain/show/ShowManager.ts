import Show from './Show'
import showService from '../../services/show.service'

export default class ShowManager {
  static async load(showId: number): Promise<Show> {
    const res = await showService.getDetails(showId)
    if (res.status === 'fail') throw new Error(res.error)
    return new Show(res.data)
  }

  static async addUserToExtraTime(showId: number, userId: number, type: 'ouverture' | 'fermeture') {
    const res = await showService.addExtraTime(showId, userId, type)
    if (res.status === 'fail') throw new Error(res.error)
    return new Show(res.data)
  }

  static async removeUserFromExtraTime(showId: number, extraTimeId: number) {
    const res = await showService.removeExtraTime(extraTimeId)
    if (res.status === 'fail') throw new Error(res.error)
    return new Show(res.data)
  }

  static async changeResponsable(showId: number, newResponsableId: number | null) {
    const res = await showService.changeResponsable(showId, newResponsableId)
    if (res.status === 'fail') throw new Error(res.error)
    return new Show(res.data)
  }
}
