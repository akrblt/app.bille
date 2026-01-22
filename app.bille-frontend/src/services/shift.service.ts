import http from './httpClient'
import Shift from '../domain/shift/shift'

const shiftService = {
  create: (shift: Shift) =>
    http.post('/create-shift', shift),

  update: (shift: Shift) =>
    http.put(`/update-shift/${shift.idShift}`, shift),

  delete: (idShift: number) =>
    http.delete(`/delete-shift/${idShift}`),

  subscribe: (shiftId: number, userId: number) => 
    http.post('/set-user-to-shift-insert', { shiftId, idUser: userId }),
    
  unsubscribe: (shiftId: number, userId: number) => 
    http.post('/set-user-to-shift-delete', { shiftId, idUser: userId }),
}

export default shiftService
