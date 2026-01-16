export default class Show {
  id: number
  status: string
  notes: string
  showResponsable: number | null
  extraTimes: any[]

  private rawDate: string
  private startHour?: string
  private endHour?: string

  constructor(raw: any) {
    this.id = raw.laBilleShowId ?? raw.id
    this.status = raw.status
    this.notes = raw.notes
    this.showResponsable = raw.showResponsable
    this.extraTimes = raw.extraTimes || []

    this.rawDate = raw.date
    this.startHour = raw.startHour
    this.endHour = raw.endHour
  }

  formatDateLabel(): string {
    return new Date(this.rawDate).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  formatHoraires(): string {
    if (!this.startHour || !this.endHour) return ''
    return `${this.startHour} - ${this.endHour}`
  }
}
