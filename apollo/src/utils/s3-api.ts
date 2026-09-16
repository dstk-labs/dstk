import type { KyselyStorageProvider } from "@/graphql/index.js";
import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  ListObjectsV2Command,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { builder } from "@/builder.js";
import { Security } from "./encryption.js";

const EncryptoMatic = new Security();

function createS3Client(storageProvider: KyselyStorageProvider) {
  return new S3Client({
    apiVersion: "2006-03-01",
    region: storageProvider.region,
    endpoint: storageProvider.endpointUrl,
    forcePathStyle: true,
    credentials: {
      accessKeyId: EncryptoMatic.decrypt(storageProvider.accessKeyId),
      secretAccessKey: EncryptoMatic.decrypt(storageProvider.secretAccessKey),
    },
  });
}

export class PresignedUrlClass {
  url?: string;
  key?: string;
  uploadId?: string;
  partNumber?: number;
  ETag?: string;
}

export const PresignedURL = builder.objectRef<PresignedUrlClass>("PresignedURL").implement({
  fields: t => ({
    url: t.exposeString("url"),
    key: t.exposeString("key"),
    uploadId: t.exposeString("uploadId"),
    partNumber: t.exposeInt("partNumber"),
    ETag: t.exposeString("ETag"),
  }),
});

export async function CreateMultipartUpload(storageProvider: KyselyStorageProvider, key: string) {
  const client = createS3Client(storageProvider);

  const command = new CreateMultipartUploadCommand({
    Bucket: storageProvider.bucket,
    Key: key,
  });
  const response = client.send(command);
  return response;
}

export async function CreatePresignedURLForPart(
  storageProvider: KyselyStorageProvider,
  key: string,
  uploadId: string,
  partNumber: number,
) {
  const client = createS3Client(storageProvider);

  const command = new UploadPartCommand({
    Bucket: storageProvider.bucket,
    Key: key,
    UploadId: uploadId,
    PartNumber: partNumber,
  });
  return await getSignedUrl(client, command, { expiresIn: 3600 });
}

export type CompletedPart = {
  ETag?: string;
  PartNumber?: number;
};

export type CompletedMultipartUpload = {
  Parts?: CompletedPart[];
};

export async function FinalizeMultipartUpload(
  storageProvider: KyselyStorageProvider,
  key: string,
  uploadId: string,
  multipartUpload: CompletedMultipartUpload,
) {
  const client = createS3Client(storageProvider);

  const command = new CompleteMultipartUploadCommand({
    Bucket: storageProvider.bucket,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: multipartUpload,
  });
  const response = client.send(command);
  return response;
}

export async function AbortMultipartUpload(
  storageProvider: KyselyStorageProvider,
  key: string,
  uploadId: string,
) {
  const client = createS3Client(storageProvider);

  const command = new AbortMultipartUploadCommand({
    Bucket: storageProvider.bucket,
    Key: key,
    UploadId: uploadId,
  });
  const response = client.send(command);
  return response;
}

export async function ListObjects(
  storageProvider: KyselyStorageProvider,
  maxKeys: number,
  prefix: string,
  continuationToken?: string,
) {
  const client = createS3Client(storageProvider);

  const command = new ListObjectsV2Command({
    Bucket: storageProvider.bucket,
    ContinuationToken: continuationToken,
    MaxKeys: maxKeys,
    Prefix: prefix,
  });

  const response = await client.send(command);
  return response;
}
