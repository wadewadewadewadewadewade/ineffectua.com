import { Config } from 'apollo-server-micro';
import { IUserProjection } from './../users/user';

export function currentUser(_, __, { user }) {
  return user;
}

export const resolvers: Config['resolvers'] = {
  Query: {
    async currentUser(
      _parent,
      _args,
      _context: { user: IUserProjection | undefined },
      _info,
    ): Promise<IUserProjection | false> {
      console.log({ _context });
      return _context.user || undefined;
    },
  },
};
