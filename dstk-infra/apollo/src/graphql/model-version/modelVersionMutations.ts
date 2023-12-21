import { extendType, inputObjectType, nonNull, stringArg } from 'nexus';
import { MLModelVersion, ObjectionMLModelVersion } from './modelVersion.js';
import { ObjectionStorageProvider } from '../storage-provider/storageProvider.js';
import {
    CreateMultipartUpload,
    PresignedURL,
    CreatePresignedURLForPart,
} from '../../utils/s3-api.js';

export const ModelVersionInputType = inputObjectType({
    name: 'ModelVersionInput',
    definition(t) {
        t.nonNull.string('modelId');
        t.string('description');
    },
});

export const CreateModelVersionMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('createModelVersion', {
            type: MLModelVersion,
            args: { data: ModelVersionInputType },
            async resolve(root, args, ctx) {
                const results = ObjectionMLModelVersion.transaction(async (trx) => {
                    const modelStorageProvider = await ObjectionStorageProvider.query()
                        .select(
                            'registry.storageProviders.endpointUrl',
                            'registry.storageProviders.region',
                            'registry.storageProviders.bucket',
                            'registry.storageProviders.accessKeyId',
                            'registry.storageProviders.secretAccessKey',
                        )
                        .innerJoin(
                            'registry.models as m',
                            'registry.storageProviders.providerId',
                            'm.storageProviderId',
                        )
                        .where('m.modelId', args.data.modelId)
                        .first();

                    const lastModelVersion = await ObjectionMLModelVersion.query()
                        .select('numericVersion')
                        .where('modelId', args.data.modelId)
                        .orderBy('numericVersion', 'DESC')
                        .first();
                    const incrementedVersion = (lastModelVersion?.numericVersion || 0) + 1;

                    // TODO: We will need to parameterize the team subpath once
                    // user auth stuff gets set up; just hardcoding it to a dummy
                    // location for now
                    const key = `teams/DEFAULT/models/${args.data.modelId}/versions/${incrementedVersion}`;
                    const mpu_url = await CreateMultipartUpload(modelStorageProvider, key);

                    const mlModelVersion = await ObjectionMLModelVersion.query(trx)
                        .insertAndFetch({
                            modelId: args.data.modelId,
                            description: args.data.description,
                            numericVersion: incrementedVersion,
                            uploadId: mpu_url.UploadId,
                        })
                        .first();

                    return mlModelVersion;
                });

                return results;
            },
        });
    },
});

export const PresignedURLInputType = inputObjectType({
    name: 'PresignedURLInput',
    definition(t) {
        t.nonNull.string('modelVersionId');
        t.nonNull.string('uploadId');
        t.nonNull.int('partNumber');
    },
});

export const PresignURLForModelVersion = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('presignURL', {
            type: PresignedURL,
            args: { data: PresignedURLInputType },
            async resolve(root, args, ctx) {
                const results = ObjectionMLModelVersion.transaction(async (trx) => {
                    // TODO: abstract this into a getStorageProviderForModel thingy...
                    // could also do some withRelated thing to query the model version
                    // and pull through the model and storage provider with it
                    const modelStorageProvider = await ObjectionStorageProvider.query()
                        .select(
                            'registry.storageProviders.endpointUrl',
                            'registry.storageProviders.region',
                            'registry.storageProviders.bucket',
                            'registry.storageProviders.accessKeyId',
                            'registry.storageProviders.secretAccessKey',
                        )
                        .innerJoin(
                            'registry.models as m',
                            'registry.storageProviders.providerId',
                            'm.storageProviderId',
                        )
                        .innerJoin('registry.modelVersions as mv', 'm.modelId', 'mv.modelId')
                        .where('mv.modelId', args.data.modelVersionId)
                        .first();

                    console.log(modelStorageProvider);

                    const modelVersion = await ObjectionMLModelVersion.query()
                        .where('modelVersionId', args.data.modelVersionId)
                        .first();

                    // TODO: We will need to parameterize the team subpath once
                    // user auth stuff gets set up; just hardcoding it to a dummy
                    // location for now
                    const key = `teams/DEFAULT/models/${modelVersion.modelId}/versions/${modelVersion.numericVersion}`;
                    const mpu_url = await CreatePresignedURLForPart(
                        modelStorageProvider,
                        key,
                        args.data.uploadId,
                        args.data.partNumber,
                    );
                    console.log(mpu_url);

                    const result = {
                        url: mpu_url,
                        key: args.data.key,
                        uploadId: args.data.uploadId,
                        partNumber: args.data.partNumber,
                    };

                    return result;
                });

                return results;
            },
        });
    },
});
