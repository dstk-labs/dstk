import { MLModelVersion, ObjectionMLModelVersion } from './modelVersion.js';
import { ObjectionMLModel } from '../model/model.js';
import { ObjectionStorageProvider } from '../storage-provider/storageProvider.js';
import { RegistryOperationError } from '../../utils/errors.js';
import {
    AbortMultipartUpload,
    CreateMultipartUpload,
    CreatePresignedURLForPart,
    FinalizeMultipartUpload,
    PresignedURL,
} from '../../utils/s3-api.js';
import { raw } from 'objection';
import { builder } from '../../builder.js';

export const ModelVersionInputType = builder.inputType('ModelVersionInputType', {
    fields: (t) => ({
        modelId: t.string({ required: true }),
        description: t.string(),
    }),
});

builder.mutationFields((t) => ({
    createModelVersion: t.field({
        type: MLModelVersion,
        args: {
            data: t.arg({ type: ModelVersionInputType, required: true }),
        },
        async resolve(root, args, ctx) {
            const results = ObjectionMLModelVersion.transaction(async (trx) => {
                const parentModel = (await ObjectionMLModel.query()
                    .where('modelId', args.data.modelId)
                    .first()) as ObjectionMLModel;
                if (parentModel.isArchived === true) {
                    throw new RegistryOperationError({ name: 'ARCHIVED_MODEL_ERROR' });
                }
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
                        description: args.data?.description || raw('NULL'),
                        numericVersion: incrementedVersion,
                        s3Prefix: s3_prefix,
                    })
                    .first();

                return mlModelVersion as typeof MLModelVersion.$inferType;
            });

            return results;
        },
    }),
    publishModelVersion: t.field({
        type: MLModelVersion,
        args: {
            modelVersionId: t.arg.string({ required: true }),
        },
        async resolve(root, args, ctx) {
            const results = ObjectionMLModelVersion.transaction(async (trx) => {
                const mlModelVersion = await ObjectionMLModelVersion.query(trx).updateAndFetchById(
                    args.modelVersionId,
                    {
                        isFinalized: true,
                    },
                );

                // since we're wrapping everything in a transaction, throwing
                // will cause a rollback
                if (mlModelVersion.isArchived === true) {
                    throw new RegistryOperationError({ name: 'ARCHIVED_MODEL_VERSION_ERROR' });
                }

                return mlModelVersion as typeof MLModelVersion.$inferType;
            });

            return results;
        },
    }),
    archiveModelVersion: t.field({
        type: MLModelVersion,
        args: {
            modelVersionId: t.arg.string({ required: true }),
        },
        async resolve(root, args, ctx) {
            const results = ObjectionMLModelVersion.transaction(async (trx) => {
                // Intentionally don't throw an error here on archived storage
                // providers or models. It's not unreasonable to want to mark old
                // assets as archived if a parent object goes bye-bye
                const mlModelVersion = await ObjectionMLModelVersion.query(trx).updateAndFetchById(
                    args.modelVersionId,
                    {
                        isArchived: raw('NOT is_archived'),
                    },
                );

                return mlModelVersion as typeof MLModelVersion.$inferType;
            });

            return results;
        },
    }),
}));

// export const CompletedPartInputType = inputObjectType({
//     name: 'CompletedPartUploadInput',
//     definition(t) {
//         t.nonNull.string('ETag');
//         t.nonNull.int('PartNumber');
//     },
// });

// export const PartsInputType = inputObjectType({
//     name: 'PartsInputType',
//     definition(t) {
//         t.list.field(
//             'Parts', // This is capitalized to conform to the AWS SDK
//             { type: CompletedPartInputType },
//         );
//     },
// });

// const PresignMethod = enumType({
//     name: 'method',
//     members: [
//         'createMultipartUpload',
//         'uploadPart',
//         'finalizeMultipartUpload',
//         'abortMultipartUpload',
//     ],
// });

// export const PresignedURLInputType = inputObjectType({
//     name: 'PresignedURLInput',
//     definition(t) {
//         t.nonNull.string('modelVersionId');
//         t.nonNull.field('method', {
//             type: PresignMethod,
//         });
//         t.nonNull.string('filename');
//         t.string('uploadId');
//         t.int('partNumber');
//         t.field('multipartUpload', {
//             type: PartsInputType,
//         });
//     },
// });

// export const PresignURLForModelVersion = extendType({
//     type: 'Mutation',
//     definition(t) {
//         t.field('presignURL', {
//             type: PresignedURL,
//             args: { data: PresignedURLInputType },
//             async resolve(root, args, ctx) {
//                 const modelStorageProvider = (await ObjectionMLModelVersion.relatedQuery(
//                     'storageProvider',
//                 )
//                     .for(args.data.modelVersionId)
//                     .first()) as ObjectionStorageProvider;
//                 if (modelStorageProvider.isArchived === true) {
//                     throw new RegistryOperationError({ name: 'ARCHIVED_STORAGE_ERROR' });
//                 }

//                 const parentModel = (await ObjectionMLModelVersion.relatedQuery('model')
//                     .for(args.data.modelVersionId)
//                     .first()) as ObjectionMLModel;
//                 if (parentModel.isArchived === true) {
//                     throw new RegistryOperationError({ name: 'ARCHIVED_MODEL_ERROR' });
//                 }

//                 const modelVersion = await ObjectionMLModelVersion.query()
//                     .where('modelVersionId', args.data.modelVersionId)
//                     .first();
//                 if (modelVersion.isArchived === true) {
//                     throw new RegistryOperationError({ name: 'ARCHIVED_MODEL_VERSION_ERROR' });
//                 } else if (modelVersion.isFinalized === true) {
//                     throw new RegistryOperationError({ name: 'PUBLISHED_MODEL_VERSION_ERROR' });
//                 }

//                 let mpu_url;
//                 const key = `${modelVersion.s3Prefix}/${args.data.filename}`;

//                 if (args.data.method === 'createMultipartUpload') {
//                     const result = await CreateMultipartUpload(modelStorageProvider, key);

//                     mpu_url = {
//                         uploadId: result.UploadId,
//                         key: result.Key,
//                     };
//                 } else if (args.data.method === 'uploadPart') {
//                     const result = await CreatePresignedURLForPart(
//                         modelStorageProvider,
//                         key,
//                         args.data.uploadId,
//                         args.data.partNumber,
//                     );

//                     mpu_url = {
//                         uploadId: args.data.uploadId,
//                         key: key,
//                         partNumber: args.data.partNumber,
//                         url: result,
//                     };
//                 } else if (args.data.method === 'finalizeMultipartUpload') {
//                     const result = await FinalizeMultipartUpload(
//                         modelStorageProvider,
//                         key,
//                         args.data.uploadId,
//                         args.data.multipartUpload,
//                     );
//                     mpu_url = {
//                         uploadId: args.data.uploadId,
//                         key: key,
//                         ETag: result.ETag,
//                         url: result.Location,
//                     };
//                 } else if (args.data.method === 'abortMultipartUpload') {
//                     const result = await AbortMultipartUpload(
//                         modelStorageProvider,
//                         key,
//                         args.data.uploadId,
//                     );
//                     mpu_url = {};
//                 } else {
//                     mpu_url = {};
//                 }

//                 return mpu_url;
//             },
//         });
//     },
// });
