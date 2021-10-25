import { IUserProjection } from '../../../models/users/user';
import { FileUpload } from 'graphql-upload';
import { ReadStream } from 'fs';
import stream from 'stream';
import AWS from 'aws-sdk';

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

const saveFile = async (
  createReadStream: () => ReadStream,
  key: string,
  bucketName: string,
): Promise<boolean> => {
  const uploadStream = (S3: AWS.S3, Bucket: string, Key: string) => {
    const passT = new stream.PassThrough();
    return {
      writeStream: passT,
      promise: S3.upload({ Bucket, Key, Body: passT }).promise(),
    };
  };
  const { writeStream, promise } = uploadStream(s3Client, bucketName, key);
  createReadStream().pipe(writeStream); //  NOTE: Addition You can compress to zip by  .pipe(zlib.createGzip()).pipe(writeStream)
  let output = true;
  await promise.catch(reason => {
    output = reason;
  });
  return output;
};

export const singleUpload = async (
  parent: Record<string, unknown>,
  { file }: { file: Promise<FileUpload> },
  { user }: { user: IUserProjection | false },
): Promise<string> => {
  if (user) {
    const { createReadStream, filename, mimetype, encoding } = await file;
    const path = `${user._id}/${Date.now().toString()}/`;
    const response = await saveFile(createReadStream, `${path}${filename}`, '');
    if (typeof response !== 'string') {
      return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${path}${filename}`;
    }
    return response;
  }
  return 'Please authenticate in order to upload';
};
