// src/services/show.service.ts
export const showService = {
  getDetails: async (showId: number) => {
    const res = await fetch(`/api/getShowDetails/${showId}`, { credentials: 'include' });
    return await res.json();
  },

  changeResponsable: async (showId: number, responsableId: number | null) => {
    const res = await fetch(`/api/changeResponsable`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ showId, responsableId }),
      credentials: 'include'
    });
    return await res.json();
  },

  addExtraTime: async (showId: number, idUser: number, firstname: string, type: string) => {
    const res = await fetch(`/api/set-user-to-extraTime-insert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ showId, idUser, firstname, type }),
      credentials: 'include'
    });
    return await res.json();
  },

  removeExtraTime: async (idExtraTime: number) => {
    const res = await fetch(`/api/deleteUserToExtraTime`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idExtraTime }),
      credentials: 'include'
    });
    return await res.json();
  }
};

export default showService
