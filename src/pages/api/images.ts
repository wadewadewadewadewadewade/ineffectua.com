import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import AWS from 'aws-sdk';
import multiparty from 'multiparty';
import { ObjectIdentifierList } from 'aws-sdk/clients/s3';

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

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nextConnect<NextApiRequest, NextApiResponse>();

const s3Client = new AWS.S3({
  accessKeyId: process.env.AWS_S3_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET,
  // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
});

handler.post(async (req, res) => {
  const form = new multiparty.Form();
  try {
    const result = await new Promise<string>((yay, boo) => {
      form.on('part', function (part) {
        const path = `${Date.now().toString()}/`; // TODO: add userid to image path
        const filename = part.filename;
        s3Client.putObject(
          {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `${path}${filename}`,
            ACL: 'public-read',
            Body: part,
            ContentLength: part.byteCount,
          },
          function (err) {
            if (err) {
              boo(err);
            } else {
              yay(
                `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${path}${filename}`,
              );
            }
          },
        );
      });
      form.parse(req);
    });
    res.status(200).json(result);
  } catch (ex) {
    res.status(500).json(ex);
  }
});

handler.delete(async (req, res) => {
  const body = [];
  req.on('data', chunk => {
    body.push(chunk);
  });
  req.on('end', () => {
    const parsedBody = JSON.parse(Buffer.concat(body).toString());
    if (Array.isArray(parsedBody) && parsedBody.length > 0) {
      const prefix = `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/`;
      const keys: ObjectIdentifierList = [];
      parsedBody.forEach((imageUrl: string) => {
        if (imageUrl.startsWith(prefix)) {
          const key = imageUrl.substr(prefix.length);
          keys.push({ Key: key });
        }
      });
      s3Client.deleteObjects(
        {
          Bucket: process.env.AWS_S3_BUCKET,
          Delete: {
            Objects: keys,
          },
        },
        function (err, data) {
          if (err) {
            res.status(500).json({ err });
          } else {
            res.status(200).json(data.Deleted);
          }
        },
      );
    }
  });
});

export default handler;
