export type ShiftType = 'bar' | 'entree' | 'parking' | 'reunion';

export type ShiftedUser = {
  idSubscribe: number | null;
  idUser: number;
  username: string;
};

export default class Shift {
  idShift: number;
  fkShow: number;
  type: ShiftType;
  maxUsers: number;
  startTime: string;
  endTime: string;
  indexForType: number;
  users: ShiftedUser[];

  constructor(data: Partial<Shift>) {
    this.idShift = data.idShift ?? 0;
    this.fkShow = data.fkShow ?? 0;
    this.type = data.type as ShiftType ?? 'bar';
    this.maxUsers = data.maxUsers ?? 0;
    this.startTime = data.startTime ?? '20:00';
    this.endTime = data.endTime ?? '00:00';
    this.indexForType = data.indexForType ?? 0;
    this.users = data.users ?? [];
  }

  // Domain-only helpers
  changeStartTime(newTime: string): Shift {
    this.startTime = newTime;
    return this;
  }

  changeEndTime(newTime: string): Shift {
    this.endTime = newTime;
    return this;
  }

  changeMaxUsers(newMax: number): Shift {
    this.maxUsers = newMax;
    return this;
  }

  addUser(user: ShiftedUser): Shift | string {
    if (this.users.some(u => u.idUser === user.idUser)) {
      return 'User already in shift';
    }
    this.users.push(user);
    return this;
  }

  removeUser(user: ShiftedUser): Shift {
    this.users = this.users.filter(u => u.idUser !== user.idUser);
    return this;
  }
}
