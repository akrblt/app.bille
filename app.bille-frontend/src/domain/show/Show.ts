
export type ExtraTimeType = 'ouverture' | 'fermeture';
export type ExtraTime = {
  idExtraTime: number | null
  idUser: number
  firstname: string
  type: ExtraTimeType;
}

export default class Show {
  id: number
  status: string
  notes: string
  showResponsable: number | null
  extraTimes: ExtraTime[]

  private rawDate: string
  private startHour?: string
  private endHour?: string

  constructor(raw: any) {
    this.id = raw.laBilleShowId ?? raw.id
    this.status = raw.status ?? ''
    this.notes = raw.notes ?? ''
    this.showResponsable = raw.showResponsable ?? null
    this.extraTimes = raw.extraTimes ?? []

     this.rawDate = raw.date
    this.startHour = raw.startHour
    this.endHour = raw.endHour
  }

   get date(): Date {
    return new Date(this.rawDate)
  }

  formatDateLabel(): string {
    return new Date(this.date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  getExtraTimesOfType(type: ExtraTimeType): ExtraTime[] {
    return this.extraTimes.filter((t) => t.type === type);
  }

  addExtraTime(newTime: ExtraTime) {
    this.extraTimes.push(newTime);
  }

  removeExtraTime(idExtraTime: number) {
    this.extraTimes = this.extraTimes.filter((t) => t.idExtraTime !== idExtraTime);
  }
   isUserInExtraTimes(userId: number, type: ExtraTimeType): boolean {
    return this.getExtraTimesOfType(type).some(t => t.idUser === userId)
  }

}
