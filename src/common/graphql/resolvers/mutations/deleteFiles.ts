import AWS from 'aws-sdk';
import { ObjectIdentifierList } from 'aws-sdk/clients/s3';
import { IUserProjection } from '../../../models/users/user';

if (!process.env.AWS_S3_BUCKET) {
  throw new Error('Please add your S3 bucket name to .env.local');
}
if (!process.env.AWS_S3_REGION) {
  throw new Error('Please add your S3 bucket region to .env.local');
}
if (!process.env.AWS_S3_KEY) {
  throw new Error('Please add your S3 bucket key to .env.local');
}
if (!process.env.AWS_S3_SECRET) {
  throw new Error('Please add your S3 bucket secret to .env.local');
}

const s3Client = new AWS.S3({
  accessKeyId: process.env.AWS_S3_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET,
  // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
});

export const deleteFiles = async (
  parent: Record<string, unknown>,
  { urls }: { urls: string[] },
  { user }: { user: IUserProjection | false },
): Promise<boolean> => {
  if (user) {
    if (Array.isArray(urls) && urls.length > 0) {
      const prefix = `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${user._id}`;
      const keys: ObjectIdentifierList = [];
      urls.forEach((imageUrl: string) => {
        if (imageUrl.startsWith(prefix)) {
          const key = imageUrl.substr(prefix.length);
          keys.push({ Key: key });
        }
      });
      if (keys.length === 0) {
        return false;
      }
      const result: boolean = await new Promise(resolve => {
        s3Client.deleteObjects(
          {
            Bucket: process.env.AWS_S3_BUCKET,
            Delete: {
              Objects: keys,
            },
          },
          function (err, data) {
            if (err) {
              console.error(err);
              resolve(false);
            } else {
              // data.Deleted
              resolve(true);
            }
          },
        );
      });
      return result;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
