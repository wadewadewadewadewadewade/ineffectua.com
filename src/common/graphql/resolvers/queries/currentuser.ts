import { IUserProjection } from '../../../models/users/user';

export const currentUser = async (
  _parent,
  _args,
  _context: { user: IUserProjection | undefined },
  _info,
): Promise<IUserProjection | false> => {
  return _context.user || undefined;
};
