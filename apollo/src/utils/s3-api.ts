import {
    AbortMultipartUploadCommand,
    CompleteMultipartUploadCommand,
    CreateMultipartUploadCommand,
    ListObjectsV2Command,
    S3Client,
    UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Security } from './encryption.js';
import { builder } from '../builder.js';
import type { KyselyStorageProvider } from '../graphql/index.js';

const EncryptoMatic = new Security();

export class PresignedUrlClass {
    url?: string;
    key?: string;
    uploadId?: string;
    partNumber?: number;
    ETag?: string;
}

export const PresignedURL = builder.objectRef<PresignedUrlClass>('PresignedURL').implement({
    fields: (t) => ({
        url: t.exposeString('url'),
        key: t.exposeString('key'),
        uploadId: t.exposeString('uploadId'),
        partNumber: t.exposeInt('partNumber'),
        ETag: t.exposeString('ETag'),
    }),
});

export async function CreateMultipartUpload(storageProvider: KyselyStorageProvider, key: string) {
    const client = new S3Client({
        apiVersion: '2006-03-01',
        region: storageProvider.region,
        endpoint: storageProvider.endpoint_url,
        credentials: {
            accessKeyId: EncryptoMatic.decrypt(storageProvider.access_key_id),
            secretAccessKey: EncryptoMatic.decrypt(storageProvider.secret_access_key),
        },
    });

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
    const client = new S3Client({
        apiVersion: '2006-03-01',
        region: storageProvider.region,
        endpoint: storageProvider.endpoint_url,
        credentials: {
            accessKeyId: EncryptoMatic.decrypt(storageProvider.access_key_id),
            secretAccessKey: EncryptoMatic.decrypt(storageProvider.secret_access_key),
        },
    });

    const command = new UploadPartCommand({
        Bucket: storageProvider.bucket,
        Key: key,
        UploadId: uploadId,
        PartNumber: partNumber,
    });
    return await getSignedUrl(client, command, { expiresIn: 3600 });
}

export interface CompletedPart {
    ETag?: string;
    PartNumber?: number;
}

export interface CompletedMultipartUpload {
    Parts?: CompletedPart[];
}

export async function FinalizeMultipartUpload(
    storageProvider: KyselyStorageProvider,
    key: string,
    uploadId: string,
    multipartUpload: CompletedMultipartUpload,
) {
    const client = new S3Client({
        apiVersion: '2006-03-01',
        region: storageProvider.region,
        endpoint: storageProvider.endpoint_url,
        credentials: {
            accessKeyId: EncryptoMatic.decrypt(storageProvider.access_key_id),
            secretAccessKey: EncryptoMatic.decrypt(storageProvider.secret_access_key),
        },
    });

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
    const client = new S3Client({
        apiVersion: '2006-03-01',
        region: storageProvider.region,
        endpoint: storageProvider.endpoint_url,
        credentials: {
            accessKeyId: EncryptoMatic.decrypt(storageProvider.access_key_id),
            secretAccessKey: EncryptoMatic.decrypt(storageProvider.secret_access_key),
        },
    });

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
    const client = new S3Client({
        apiVersion: '2006-03-01',
        region: storageProvider.region,
        endpoint: storageProvider.endpoint_url,
        credentials: {
            accessKeyId: EncryptoMatic.decrypt(storageProvider.access_key_id),
            secretAccessKey: EncryptoMatic.decrypt(storageProvider.secret_access_key),
        },
    });

    const command = new ListObjectsV2Command({
        Bucket: storageProvider.bucket,
        ContinuationToken: continuationToken,
        MaxKeys: maxKeys,
        Prefix: prefix,
    });

    const response = await client.send(command);
    return response;
}
