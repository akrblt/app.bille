// src/services/show.service.ts
import http from './httpClient'

// Show service using axios httpClient
export const showService = {
  // Get show details by ID
  getDetails: async (showId: number) => {
    const res = await http.get(`/getShowDetails/${showId}`)
    if (res.status === 'fail') throw new Error(res.error)
    return res.data
  },

  // Change responsable of a show
  changeResponsable: async (showId: number, responsableId: number | null) => {
    const res = await http.post(`/changeResponsable`, { showId, responsableId })
    if (res.status === 'fail') throw new Error(res.error)
    return res.data
  },

  // Add a user to extra time
  addExtraTime: async (
  fkShow: number,
  idUser: number,
  type: 'ouverture' | 'fermeture'
) => {
  const res = await http.post('/subscribeUserToExtraTime', {
    fkShow,
    idUser,
    type
  })
  if (res.status === 'fail') throw new Error(res.error)
  return res.data
}
,

  // Remove a user from extra time
  removeExtraTime: async (idExtraTime: number) => {
    const res = await http.post(`/deleteUserToExtraTime`, { idExtraTime })
    if (res.status === 'fail') throw new Error(res.error)
    return res.data
  }
}

export default showService
