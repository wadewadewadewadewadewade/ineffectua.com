import { signIn } from './signin';
import { signOut } from './signout';
import { signUp } from './signup';
import { sendConfirmationEmail } from './sendconfirmationemail';
import { addPost } from './addPost';
import { deletePost } from './deletePost';
import { singleUpload, multipleUpload } from './upload';
import { deleteFiles } from './deleteFiles';

export default {
  signIn,
  signOut,
  signUp,
  sendConfirmationEmail,
  addPost,
  deletePost,
  singleUpload,
  multipleUpload,
  deleteFiles,
};
