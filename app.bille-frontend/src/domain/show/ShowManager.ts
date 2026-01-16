import Show from './Show'
import showService from '../../services/show.service'

export default class ShowManager {
  static async load(showId: number): Promise<Show> {
    const res = await showService.getDetails(showId)
    if (res.status === 'fail') throw new Error(res.error)
    return new Show(res.data)
  }

  static async changeResponsable(
    showId: number,
    responsableId: number | null
  ): Promise<Show> {
    const res = await showService.changeResponsable(showId, responsableId)
    if (res.status === 'fail') throw new Error(res.error)
    return new Show(res.data)
  }

  static async addUserToExtraTime(
    showId: number,
    userId: number,
    userName: string,
    type: 'opening' | 'closure'
  ): Promise<Show> {
    const res = await showService.addExtraTime(showId, userId, userName, type)
    if (res.status === 'fail') throw new Error(res.error)
    return new Show(res.data)
  }

  static async removeUserFromExtraTime(idExtraTime: number): Promise<Show> {
    const res = await showService.removeExtraTime(idExtraTime)
    if (res.status === 'fail') throw new Error(res.error)
    return new Show(res.data)
  }
}
