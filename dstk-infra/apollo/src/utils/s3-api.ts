import { ObjectionStorageProvider } from '../graphql';
import {
    AbortMultipartUploadCommand,
    CompleteMultipartUploadCommand,
    CreateMultipartUploadCommand,
    S3Client,
    UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { objectType } from 'nexus';
import Security from './encryption.js';

const EncryptoMatic = new Security();

export const PresignedURL = objectType({
    name: 'PresignedURL',
    definition(t) {
        t.string('url');
        t.string('key');
        t.string('uploadId');
        t.string('partNumber');
        t.string('ETag');
    },
});

export async function CreateMultipartUpload(
    storageProvider: ObjectionStorageProvider,
    key: string,
) {
    const client = new S3Client({
        apiVersion: '2006-03-01',
        region: storageProvider.region,
        endpoint: storageProvider.endpointUrl,
        credentials: {
            accessKeyId: EncryptoMatic.decrypt(storageProvider.accessKeyId),
            secretAccessKey: EncryptoMatic.decrypt(storageProvider.secretAccessKey),
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
    storageProvider: ObjectionStorageProvider,
    key: string,
    uploadId: string,
    partNumber: number,
) {
    const client = new S3Client({
        apiVersion: '2006-03-01',
        region: storageProvider.region,
        endpoint: storageProvider.endpointUrl,
        credentials: {
            accessKeyId: EncryptoMatic.decrypt(storageProvider.accessKeyId),
            secretAccessKey: EncryptoMatic.decrypt(storageProvider.secretAccessKey),
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
    storageProvider: ObjectionStorageProvider,
    key: string,
    uploadId: string,
    multipartUpload: CompletedMultipartUpload,
) {
    const client = new S3Client({
        apiVersion: '2006-03-01',
        region: storageProvider.region,
        endpoint: storageProvider.endpointUrl,
        credentials: {
            accessKeyId: EncryptoMatic.decrypt(storageProvider.accessKeyId),
            secretAccessKey: EncryptoMatic.decrypt(storageProvider.secretAccessKey),
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
    storageProvider: ObjectionStorageProvider,
    key: string,
    uploadId: string,
) {
    const client = new S3Client({
        apiVersion: '2006-03-01',
        region: storageProvider.region,
        endpoint: storageProvider.endpointUrl,
        credentials: {
            accessKeyId: EncryptoMatic.decrypt(storageProvider.accessKeyId),
            secretAccessKey: EncryptoMatic.decrypt(storageProvider.secretAccessKey),
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
