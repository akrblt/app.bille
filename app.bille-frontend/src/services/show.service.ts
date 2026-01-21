import http from './httpClient'

const showService = {
  getDetails: (showId: number) => http.get(`/getDateInfos?idShow=${showId}`),
  changeResponsable: (showId: number, responsableId: number | null) =>
    http.post('/set-ResponsableOfShow', { showId, responsableId }),

  // Düzeltme burada
  addExtraTime: (showId: number, idUser: number, type: 'ouverture' | 'fermeture') =>
    http.post('/api/set-user-to-extraTime-insert', { fkShow: showId, idUser, type }),

  removeExtraTime: (idExtraTime: number) =>
    http.post('/api/set-user-to-extraTime-delete', { idExtraTime }),
}

export default showService
