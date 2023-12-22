import { ObjectionStorageProvider } from '../graphql';
import { S3Client, CreateMultipartUploadCommand, UploadPartCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { objectType } from 'nexus';

export const PresignedURL = objectType({
    name: 'PresignedURL',
    definition(t) {
        t.string('url');
        t.string('key');
        t.string('uploadId');
        t.string('partNumber');
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
            accessKeyId: storageProvider.accessKeyId,
            secretAccessKey: storageProvider.secretAccessKey,
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
            accessKeyId: storageProvider.accessKeyId,
            secretAccessKey: storageProvider.secretAccessKey,
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