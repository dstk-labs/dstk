import { MLModelVersion } from './modelVersion.js';
import { RegistryOperationError } from '../../utils/errors.js';
import {
    AbortMultipartUpload,
    CreateMultipartUpload,
    CreatePresignedURLForPart,
    FinalizeMultipartUpload,
    PresignedURL,
} from '../../utils/s3-api.js';
import { builder } from '../../builder.js';
import { db } from '../../db/kysely.js';
import { userHasRole } from '../../utils/rls.js';

export const ModelVersionInputType = builder.inputType('ModelVersionInput', {
    fields: (t) => ({
        modelId: t.string({ required: true }),
        description: t.string(),
    }),
});

export const EditModelVersionInputType = builder.inputType('EditModelVersion', {
    fields: (t) => ({
        description: t.string(),
    }),
});

export const CompletedPartInputType = builder.inputType('CompletedPartInput', {
    fields: (t) => ({
        ETag: t.string({ required: true }),
        PartNumber: t.int({ required: true }),
    }),
});

export const PartsInputType = builder.inputType('PartsInput', {
    fields: (t) => ({
        Parts: t.field({
            required: true,
            type: [CompletedPartInputType],
        }),
    }),
});

export const PresignMethod = builder.enumType('PresignMethod', {
    values: [
        'createMultipartUpload',
        'uploadPart',
        'finalizeMultipartUpload',
        'abortMultipartUpload',
    ] as const,
});

export const PresignedURLInputType = builder.inputType('PresignedURLInput', {
    fields: (t) => ({
        modelVersionId: t.string({ required: true }),
        method: t.field({
            required: true,
            type: PresignMethod,
        }),
        filename: t.string(),
        uploadId: t.string(),
        partNumber: t.int(),
        multipartUpload: t.field({
            type: PartsInputType,
        }),
    }),
});

builder.mutationFields((t) => ({
    createModelVersion: t.field({
        authScopes: {
            loggedIn: true,
        },
        type: MLModelVersion,
        args: {
            data: t.arg({ type: ModelVersionInputType, required: true }),
        },
        async resolve(_root, args, ctx) {
            const results = await db.transaction().execute(async (trx) => {
                const parentModel = await trx
                    .selectFrom('registry.models')
                    .select(['registry.models.is_archived', 'registry.models.project_id'])
                    .where('registry.models.model_id', '=', args.data.modelId)
                    .executeTakeFirstOrThrow(
                        () => new RegistryOperationError({ name: 'MODEL_PERMISSION_ERROR' }),
                    );

                const project = await trx
                    .selectFrom('dstk_user.projects')
                    .select('dstk_user.projects.team_id')
                    .where('dstk_user.projects.project_id', '=', parentModel.project_id)
                    .executeTakeFirstOrThrow(
                        () => new RegistryOperationError({ name: 'PROJECT_PERMISSION_ERROR' }),
                    );

                await userHasRole({
                    userId: ctx.user.user_id,
                    teamId: project.team_id,
                    roles: ['owner', 'member'],
                });

                if (parentModel.is_archived === true) {
                    throw new RegistryOperationError({ name: 'ARCHIVED_MODEL_ERROR' });
                }
                const lastModelVersion = await trx
                    .selectFrom('registry.model_versions')
                    .select('registry.model_versions.numeric_version')
                    .where('registry.model_versions.model_id', '=', args.data.modelId)
                    .orderBy('registry.model_versions.numeric_version desc')
                    .executeTakeFirst();

                const incrementedVersion = (lastModelVersion?.numeric_version || 0) + 1;

                // TODO: Will add organizations to path once set up
                const s3_prefix = `organizations/DEFAULT/teams/${project.team_id}/models/${args.data.modelId}/versions/${incrementedVersion}`;

                const mlModelVersion = await trx
                    .insertInto('registry.model_versions')
                    .values({
                        model_id: args.data.modelId,
                        description: args.data.description,
                        numeric_version: incrementedVersion,
                        s3_prefix: s3_prefix,
                        created_by_id: ctx.user.user_id,
                    })
                    .returningAll()
                    .executeTakeFirstOrThrow();

                await trx
                    .updateTable('registry.models')
                    .set({
                        current_model_version_id: mlModelVersion.model_version_id,
                    })
                    .where('registry.models.model_id', '=', args.data.modelId)
                    .execute();

                return mlModelVersion;
            });

            return results;
        },
    }),
    editModelVersion: t.field({
        type: MLModelVersion,
        authScopes: {
            loggedIn: true,
        },
        args: {
            modelVersionId: t.arg.string({ required: true }),
            data: t.arg({ type: EditModelVersionInputType, required: true }),
        },
        async resolve(_root, args, ctx) {
            const results = await db.transaction().execute(async (trx) => {
                const mlModelVersion = await trx
                    .selectFrom('registry.model_versions')
                    .select(['registry.model_versions.is_archived', 'registry.model_versions.model_id'])
                    .where('registry.model_versions.model_version_id', '=', args.modelVersionId)
                    .executeTakeFirstOrThrow(() => new RegistryOperationError({ name: 'VERSION_PERMISSION_ERROR' }));

                const parentModel = await trx
                    .selectFrom('registry.models')
                    .select(['registry.models.project_id'])
                    .where('registry.models.model_id', '=', mlModelVersion.model_id)
                    .executeTakeFirstOrThrow(
                        () => new RegistryOperationError({ name: 'MODEL_PERMISSION_ERROR' }),
                    );
                
                const project = await trx
                    .selectFrom('dstk_user.projects')
                    .select('dstk_user.projects.team_id')
                    .where('dstk_user.projects.project_id', '=', parentModel.project_id)
                    .executeTakeFirstOrThrow(
                        () => new RegistryOperationError({ name: 'PROJECT_PERMISSION_ERROR' }),
                    );

                await userHasRole({
                    userId: ctx.user.user_id,
                    teamId: project.team_id,
                    roles: ['owner', 'member'],
                });

                if (mlModelVersion.is_archived === true) {
                    throw new RegistryOperationError({ name: 'ARCHIVED_MODEL_VERSION_ERROR' });
                }

                // TODO: Add Date Modified and Modified By ID
                const result = await trx
                    .updateTable('registry.model_versions')
                    .set({
                        description: args.data.description,
                    })
                    .where('registry.model_versions.model_version_id', '=', args.modelVersionId)
                    .returningAll()
                    .executeTakeFirst();

                return result;
            });

            return results;
        },
    }),
    publishModelVersion: t.field({
        type: MLModelVersion,
        authScopes: {
            loggedIn: true,
        },
        args: {
            modelVersionId: t.arg.string({ required: true }),
        },
        async resolve(_root, args, ctx) {
            const results = await db.transaction().execute(async (trx) => {
                const mlModelVersion = await trx
                    .selectFrom('registry.model_versions')
                    .select([
                        'registry.model_versions.model_id',
                        'registry.model_versions.is_archived',
                    ])
                    .where('registry.model_versions.model_version_id', '=', args.modelVersionId)
                    .executeTakeFirstOrThrow(
                        () => new RegistryOperationError({ name: 'VERSION_PERMISSION_ERROR' }),
                    );

                const parentModel = await trx
                    .selectFrom('registry.models')
                    .select([
                        'registry.models.model_id',
                        'registry.models.project_id',
                        'registry.models.is_archived',
                    ])
                    .where('registry.models.model_id', '=', mlModelVersion.model_id)
                    .executeTakeFirstOrThrow(
                        () => new RegistryOperationError({ name: 'MODEL_PERMISSION_ERROR' }),
                    );

                const project = await trx
                    .selectFrom('dstk_user.projects')
                    .select('dstk_user.projects.team_id')
                    .where('dstk_user.projects.project_id', '=', parentModel.project_id)
                    .executeTakeFirstOrThrow(
                        () => new RegistryOperationError({ name: 'PROJECT_PERMISSION_ERROR' }),
                    );

                await userHasRole({
                    userId: ctx.user.user_id,
                    teamId: project.team_id,
                    roles: ['owner', 'member'],
                });

                if (parentModel.is_archived === true) {
                    throw new RegistryOperationError({ name: 'ARCHIVED_MODEL_ERROR' });
                }
                if (mlModelVersion.is_archived === true) {
                    throw new RegistryOperationError({ name: 'ARCHIVED_MODEL_VERSION_ERROR' });
                }

                const publishedMlModelVersion = await trx
                    .updateTable('registry.model_versions')
                    .set({
                        is_finalized: true,
                    })
                    .where('registry.model_versions.model_version_id', '=', args.modelVersionId)
                    .returningAll()
                    .executeTakeFirstOrThrow();

                return publishedMlModelVersion;
            });

            return results;
        },
    }),
    archiveModelVersion: t.field({
        type: MLModelVersion,
        authScopes: {
            loggedIn: true,
        },
        args: {
            modelVersionId: t.arg.string({ required: true }),
        },
        async resolve(_root, args, ctx) {
            const results = await db.transaction().execute(async (trx) => {
                // Intentionally don't throw an error here on archived storage
                // providers or models. It's not unreasonable to want to mark old
                // assets as archived if a parent object goes bye-bye
                const mlModelVersion = await trx
                    .selectFrom('registry.model_versions')
                    .select([
                        'registry.model_versions.model_id',
                        'registry.model_versions.is_archived',
                    ])
                    .where('registry.model_versions.model_version_id', '=', args.modelVersionId)
                    .executeTakeFirstOrThrow(
                        () => new RegistryOperationError({ name: 'VERSION_PERMISSION_ERROR' }),
                    );

                const parentModel = await trx
                    .selectFrom('registry.models')
                    .select('registry.models.project_id')
                    .where('registry.models.model_id', '=', mlModelVersion.model_id)
                    .executeTakeFirstOrThrow(
                        () => new RegistryOperationError({ name: 'MODEL_PERMISSION_ERROR' }),
                    );

                const project = await trx
                    .selectFrom('dstk_user.projects')
                    .select('team_id')
                    .where('dstk_user.projects.project_id', '=', parentModel.project_id)
                    .executeTakeFirstOrThrow(
                        () => new RegistryOperationError({ name: 'PROJECT_PERMISSION_ERROR' }),
                    );

                await userHasRole({
                    userId: ctx.user.user_id,
                    teamId: project.team_id,
                    roles: ['owner', 'member'],
                });

                const archivedModelVersion = await trx
                    .updateTable('registry.model_versions')
                    .set({
                        is_archived: !mlModelVersion.is_archived,
                    })
                    .where('registry.model_versions.model_version_id', '=', args.modelVersionId)
                    .returningAll()
                    .executeTakeFirstOrThrow();

                return archivedModelVersion;
            });

            return results;
        },
    }),
    // TODO: Users must setup appropriate CORS permissions for these operations to work
    // they must also expose the ETag header
    presignURL: t.field({
        type: PresignedURL,
        authScopes: {
            loggedIn: true,
        },
        args: {
            data: t.arg({ type: PresignedURLInputType, required: true }),
        },
        async resolve(_root, args, ctx) {
            const mlModelVersion = await db
                .selectFrom('registry.model_versions')
                .select([
                    'registry.model_versions.model_id',
                    'registry.model_versions.is_archived',
                    'registry.model_versions.is_finalized',
                    'registry.model_versions.s3_prefix',
                ])
                .where('registry.model_versions.model_version_id', '=', args.data.modelVersionId)
                .executeTakeFirstOrThrow(
                    () => new RegistryOperationError({ name: 'VERSION_PERMISSION_ERROR' }),
                );
            
            if (mlModelVersion.is_archived) {
                throw new RegistryOperationError({ name: 'ARCHIVED_MODEL_VERSION_ERROR' });
            }

            if (mlModelVersion.is_finalized === true) {
                throw new RegistryOperationError({ name: 'PUBLISHED_MODEL_VERSION_ERROR' });
            }

            const parentModel = await db
                .selectFrom('registry.models')
                .select([
                    'registry.models.storage_provider_id',
                    'registry.models.project_id',
                    'registry.models.is_archived',
                ])
                .where('registry.models.model_id', '=', mlModelVersion.model_id)
                .executeTakeFirstOrThrow(
                    () => new RegistryOperationError({ name: 'MODEL_PERMISSION_ERROR' }),
                );

            if (parentModel.is_archived === true) {
                throw new RegistryOperationError({ name: 'ARCHIVED_MODEL_ERROR' });
            }

            const modelStorageProvider = await db
                .selectFrom('registry.storage_providers')
                .selectAll()
                .where(
                    'registry.storage_providers.provider_id',
                    '=',
                    parentModel.storage_provider_id,
                )
                .executeTakeFirstOrThrow(
                    () => new RegistryOperationError({ name: 'PROVIDER_NOT_FOUND_ERROR' }),
                );

            if (modelStorageProvider.is_archived === true) {
                throw new RegistryOperationError({ name: 'ARCHIVED_STORAGE_ERROR' });
            }

            const project = await db
                .selectFrom('dstk_user.projects')
                .select('dstk_user.projects.team_id')
                .where('dstk_user.projects.project_id', '=', parentModel.project_id)
                .executeTakeFirstOrThrow(
                    () => new RegistryOperationError({ name: 'PROJECT_PERMISSION_ERROR' }),
                );

            // Project viewers are not granted permission to download
            // model objects because I'm feeling petty tonight
            await userHasRole({
                userId: ctx.user.user_id,
                teamId: project.team_id,
                roles: ['owner', 'member'],
            });

            const key = `${mlModelVersion.s3_prefix}/${args.data.filename}`;

            if (args.data.method === 'createMultipartUpload') {
                const result = await CreateMultipartUpload(modelStorageProvider, key);

                return {
                    uploadId: result.UploadId,
                    key: result.Key,
                };
            }

            if (!args.data.uploadId) {
                throw new RegistryOperationError({ name: 'MISSING_UPLOAD_ID_ERROR' });
            }
            if (args.data.method === 'uploadPart') {
                if (!args.data.partNumber) {
                    throw new RegistryOperationError({ name: 'MISSING_PART_NUM_ERROR' });
                }

                const result = await CreatePresignedURLForPart(
                    modelStorageProvider,
                    key,
                    args.data.uploadId,
                    args.data.partNumber,
                );

                return {
                    uploadId: args.data.uploadId,
                    key: key,
                    partNumber: args.data.partNumber,
                    url: result,
                };
            } else if (args.data.method === 'abortMultipartUpload') {
                await AbortMultipartUpload(modelStorageProvider, key, args.data.uploadId);

                return {};
            }

            if (!args.data.multipartUpload) {
                throw new RegistryOperationError({ name: 'MULTIPART_FINALIZATION_ERROR' });
            }
            if (args.data.method === 'finalizeMultipartUpload') {
                const result = await FinalizeMultipartUpload(
                    modelStorageProvider,
                    key,
                    args.data.uploadId,
                    args.data.multipartUpload,
                );
                return {
                    uploadId: args.data.uploadId,
                    key: key,
                    ETag: result.ETag,
                    url: result.Location,
                };
            }

            return {};
        },
    }),
}));
