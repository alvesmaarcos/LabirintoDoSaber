import {
  FileStorage,
  ISaveFileRequest,
  ISaveFileResponse,
} from "../../application/services/file-storage";
import * as AWS from "aws-sdk";

export class AwsS3FileStorage implements FileStorage {
  AWS_S3_BUCKET: string;
  s3: AWS.S3;
  constructor() {
    if (!process.env.AWS_S3_BUCKET) {
      throw new Error("AWS_S3_BUCKET não está definido!");
    }
    this.AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async saveFile({
    taskId,
    file,
  }: ISaveFileRequest): Promise<ISaveFileResponse> {
    if (!this.AWS_S3_BUCKET) {
      throw new Error("AWS_S3_BUCKET não está definido!");
    }

    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: String(taskId) + Date.now().toString(),
      Body: file.buffer,
      ACL: "public-read",
      ContentType: file.mimetype,
      ContentDisposition: "inline",
    };
    const { Location } = await this.s3.upload(params).promise();

    return { url: Location };
  }
}
