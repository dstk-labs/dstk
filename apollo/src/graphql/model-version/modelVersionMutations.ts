import { extendType, inputObjectType, enumType, nonNull, stringArg } from 'nexus';
import { MLModelVersion, ObjectionMLModelVersion } from './modelVersion.js';
import { ObjectionStorageProvider } from '../storage-provider/storageProvider.js';
import {
    AbortMultipartUpload,
    CreateMultipartUpload,
    CreatePresignedURLForPart,
    FinalizeMultipartUpload,
    PresignedURL,
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

export const CompletedPartInputType = inputObjectType({
    name: 'CompletedPartUploadInput',
    definition(t) {
        t.nonNull.string('ETag');
        t.nonNull.int('PartNumber');
    },
});

export const PartsInputType = inputObjectType({
    name: 'PartsInputType',
    definition(t) {
        t.list.field(
            'Parts', // This is capitalized to conform to the AWS SDK
            { type: CompletedPartInputType },
        );
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
        t.field('multipartUpload', {
            type: PartsInputType,
        });
    },
});

export const PresignURLForModelVersion = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('presignURL', {
            type: PresignedURL,
            args: { data: PresignedURLInputType },
            async resolve(root, args, ctx) {
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
                } else if (args.data.method === 'finalizeMultipartUpload') {
                    const result = await FinalizeMultipartUpload(
                        modelStorageProvider,
                        key,
                        args.data.uploadId,
                        args.data.multipartUpload,
                    );
                    mpu_url = {
                        uploadId: args.data.uploadId,
                        key: key,
                        ETag: result.ETag,
                        url: result.Location,
                    };
                } else if (args.data.method === 'abortMultipartUpload') {
                    const result = await AbortMultipartUpload(
                        modelStorageProvider,
                        key,
                        args.data.uploadId,
                    );
                    mpu_url = {};
                } else {
                    mpu_url = {};
                }

                return mpu_url;
            },
        });
    },
});

export const PublishModelVersionMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('publishModelVersion', {
            type: MLModelVersion,
            args: { modelVersionId: nonNull(stringArg()) },
            async resolve(root, args, ctx) {
                const results = ObjectionMLModelVersion.transaction(async (trx) => {
                    const mlModelVersion = await ObjectionMLModelVersion.query(
                        trx,
                    ).updateAndFetchById(args.modelVersionId, {
                        isFinalized: true,
                    });

                    return mlModelVersion;
                });

                return results;
            },
        });
    },
});
