import shiftService from "../../services/shift.service";

export default class ShiftManager {
  static async subscribe(shiftId) {
    const res = await shiftService.subscribe(shiftId);
    if (res.status === "fail") throw new Error(res.error);
    return res;
  }

  static async unsubscribe(shiftId) {
    const res = await shiftService.unsubscribe(shiftId);
    if (res.status === "fail") throw new Error(res.error);
    return res;
  }
}
