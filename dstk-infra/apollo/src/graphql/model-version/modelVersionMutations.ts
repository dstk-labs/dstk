import { extendType, inputObjectType, enumType } from 'nexus';
import { MLModelVersion, ObjectionMLModelVersion } from './modelVersion.js';
import { ObjectionStorageProvider } from '../storage-provider/storageProvider.js';
import {
    CreateMultipartUpload,
    PresignedURL,
    CreatePresignedURLForPart,
} from '../../utils/s3-api.js';
import { ObjectionMLModel } from '../model/model.js';

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
                    const modelStorageProvider = (await ObjectionMLModel.relatedQuery(
                        'storageProvider',
                    )
                        .for(args.data.modelId)
                        .first()) as ObjectionStorageProvider;

                    const lastModelVersion = await ObjectionMLModelVersion.query()
                        .select('numericVersion')
                        .where('modelId', args.data.modelId)
                        .orderBy('numericVersion', 'DESC')
                        .first();
                    const incrementedVersion = (lastModelVersion?.numericVersion || 0) + 1;

                    // TODO: We will need to parameterize the team subpath once
                    // user auth stuff gets set up; just hardcoding it to a dummy
                    // location for now
                    const s3_prefix = `teams/DEFAULT/models/${args.data.modelId}/versions/${incrementedVersion}`;

                    const mlModelVersion = await ObjectionMLModelVersion.query(trx)
                        .insertAndFetch({
                            modelId: args.data.modelId,
                            description: args.data.description,
                            numericVersion: incrementedVersion,
                            s3Prefix: s3_prefix,
                        })
                        .first();

                    return mlModelVersion;
                });

                return results;
            },
        });
    },
});

const PresignMethod = enumType({
    name: 'method',
    members: [
        'createMultipartUpload',
        'uploadPart',
        'finalizeMultipartUpload',
        'abortMultipartUpload',
    ],
});

export const PresignedURLInputType = inputObjectType({
    name: 'PresignedURLInput',
    definition(t) {
        t.nonNull.string('modelVersionId');
        t.nonNull.field('method', {
            type: PresignMethod,
        });
        t.nonNull.string('filename');
        t.string('uploadId');
        t.int('partNumber');
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
                    const modelStorageProvider = (await ObjectionMLModelVersion.relatedQuery(
                        'storageProvider',
                    )
                        .for(args.data.modelVersionId)
                        .first()) as ObjectionStorageProvider;

                    const modelVersion = await ObjectionMLModelVersion.query()
                        .where('modelVersionId', args.data.modelVersionId)
                        .first();

                    let mpu_url;
                    const key = `${modelVersion.s3Prefix}/${args.data.filename}`;

                    if (args.data.method === 'createMultipartUpload') {
                        const result = await CreateMultipartUpload(modelStorageProvider, key);

                        mpu_url = {
                            uploadId: result.UploadId,
                            key: result.Key,
                        };
                    } else if (args.data.method === 'uploadPart') {
                        const result = await CreatePresignedURLForPart(
                            modelStorageProvider,
                            key,
                            args.data.uploadId,
                            args.data.partNumber,
                        );

                        mpu_url = {
                            uploadId: args.data.uploadId,
                            key: key,
                            partNumber: args.data.partNumber,
                            url: result,
                        };
                    } else {
                        mpu_url = {};
                    }

                    return mpu_url;
                });

                return results;
            },
        });
    },
});
