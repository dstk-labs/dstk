import { ObjectionStorageProvider } from '../graphql';
import { S3Client, CreateMultipartUploadCommand, UploadPartCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function CreateMultipartUpload(
    storageProvider: ObjectionStorageProvider,
    key: string,
) {
    console.log(storageProvider.endpointUrl);
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

// export async function PresignedURLForObject(storageProvider: ObjectionStorageProvider, key: string): string {
//     const client = new S3Client({
//         apiVersion: '2006-03-01',
//         region: storageProvider.region,
//         endpoint: storageProvider.endpointUrl
//     });

//     const params = {
//         Bucket: storageProvider.bucket,
//         Key: key,
//         UploadId: storageProvider.uploadId
//     }
//     const command = new UploadPartCommand({ params });
//     return await getSignedUrl(client, command, { expiresIn: 3600 });
// };
