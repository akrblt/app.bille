import Shift from './shift'
import shiftService from '../../services/shift.service'

export default class ShiftManager {

  static async subscribe(
    shift: Shift,
    userId: number
  ): Promise<Shift> {

    const res = await shiftService.subscribe(shift.idShift, userId)
    if (res.status === 'fail') throw new Error(res.error)

    return new Shift(res.data)
  }

  static async unsubscribe(
    shift: Shift,
    userId: number
  ): Promise<Shift> {

    const res = await shiftService.unsubscribe(shift.idShift, userId)
    if (res.status === 'fail') throw new Error(res.error)

    return new Shift(res.data)
  }

  static async delete(shiftId: number): Promise<void> {
    const res = await shiftService.delete(shiftId)
    if (res.status === 'fail') throw new Error(res.error)
  }

  static async update(shift: Shift): Promise<Shift> {
    const res = await shiftService.update(shift)
    if (res.status === 'fail') throw new Error(res.error)

    return new Shift(res.data)
  }
}
