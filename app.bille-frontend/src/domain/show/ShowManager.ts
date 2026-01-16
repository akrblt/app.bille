// src/domain/show/ShowManager.ts
import Show from './Show'
import showService from '../../services/show.service'
import http from '../../services/httpClient'

export default class ShowManager {
  // Load show details
  static async load(showId: number): Promise<Show> {
    const data = await showService.getDetails(showId)
    return new Show(data)
  }

  // Subscribe a user to a shift
  static async subscribeToShift(shiftId: number, userId: number): Promise<void> {
    const res = await http.post('/set-user-to-shift-insert', { shiftId, idUser: userId })
    if (res.status === 'fail') throw new Error(res.error || 'Failed to subscribe user to shift')
  }

  // Unsubscribe a user from a shift
  static async unsubscribeFromShift(shiftId: number, userId: number): Promise<void> {
    const res = await http.post('/set-user-to-shift-delete', { shiftId, idUser: userId })
    if (res.status === 'fail') throw new Error(res.error || 'Failed to unsubscribe user from shift')
  }

  // Add a user to extra time
  static async addUserToExtraTime(
    showId: number,
    userId: number,
    userName: string,
    type: 'opening' | 'closure'
  ): Promise<Show> {
    await showService.addExtraTime(showId, userId, userName, type)
    const updated = await showService.getDetails(showId)
    return new Show(updated)
  }

  // Remove a user from extra time
  static async removeUserFromExtraTime(
    showId: number,
    extraTimeId: number
  ): Promise<Show> {
    await showService.removeExtraTime(extraTimeId)
    const updated = await showService.getDetails(showId)
    return new Show(updated)
  }

  // Change the responsable of the show
  static async changeResponsable(
    showId: number,
    newResponsableId: number | null
  ): Promise<Show> {
    const data = await showService.changeResponsable(showId, newResponsableId)
    return new Show(data)
  }
}
