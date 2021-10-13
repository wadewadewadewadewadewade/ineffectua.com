export interface IUser {
  mode: 'test' | 'live',
  userId: number,
  tenantId: string,
  uuid: string,
  username: string,
  email: string,
  name: string,
  image: string,
  locked: boolean,
  data: Record<string, any>,
  isConfirmed: boolean,
  lastActiveAt: string,
  lastMessagedAt: string,
  confirmedAt: string,
  updatedAt: string,
  createdAt: string,
  tenant: {
    tenantId: string,
    name: string
  },
  authorization: {
    [tenantId: string]: {
      roles: string[]
    }
  }
}
