import { extendType, inputObjectType, nonNull, stringArg } from 'nexus';
import { MLModelVersion, ObjectionMLModelVersion } from './modelVersion.js';
import { ObjectionStorageProvider } from '../storage-provider/storageProvider.js';
import { CreateMultipartUpload } from '../../utils/s3-api.js';

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

                    console.log(modelStorageProvider);
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
                    console.log(mpu_url);

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
