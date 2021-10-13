declare module 'userfront__react' {
  export interface IUserfrontUser {
    email: string;
    username: string;
    name: string;
    image: string;
    data: any;
    confirmedAt: string;
    createdAt: string;
    updatedAt: string;
    mode: string;
    userId: number;
    userUuid: string;
    tenantId: string;
    isConfirmed: boolean;
  }
  export interface IUserfrontAuthorizationPayload {
    mode: 'test' | 'production',
    tenantId: string,
    userId: number,
    authorization: {
      [tenantId: string]: {
        roles: string[]
      }
    }
  }
}