import http from './httpClient'

const shiftService = {
  subscribe: (shiftId: number, userId: number) => 
    http.post('/set-user-to-shift-insert', { shiftId, idUser: userId }),
    
  unsubscribe: (shiftId: number, userId: number) => 
    http.post('/set-user-to-shift-delete', { shiftId, idUser: userId }),
}

export default shiftService
