import { IUserProjection } from './../../../models/users/user';

export async function sendConfirmationEmail(
  _,
  { _id }: { _id: string },
  ctx: { user: IUserProjection | false },
) {
  if (ctx.user) {
    console.log('send confirmation email to ', _id);
    return true;
  } else {
    console.error('only authenticated users can do this');
  }
  return false;
}
