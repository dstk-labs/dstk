import { builder } from '../../builder.js';
import { StorageProvider } from '../storage-provider/storageProvider.js';
import { User } from '../user/user.js';
import { Project } from '../user/project.js';
import { db } from '../../db/kysely.js';
import type { RegistryModels } from '../../db/db.js';
import type { Selectable } from 'kysely';
import { MLModelVersion } from '../model-version/modelVersion.js';

export type KyselyMLModel = Selectable<RegistryModels>;

export const MLModel = builder.objectRef<KyselyMLModel>('MLModel');

builder.objectType(MLModel, {
    fields: (t) => ({
        modelId: t.field({
            type: 'ID',
            resolve(root: KyselyMLModel, _args, _ctx) {
                return root.model_id;
            },
        }),
        storageProvider: t.field({
            type: StorageProvider,
            async resolve(root: KyselyMLModel, _args, _ctx) {
                const storageProvider = await db
                    .selectFrom('registry.storage_providers')
                    .selectAll()
                    .where('registry.storage_providers.provider_id', '=', root.storage_provider_id)
                    .executeTakeFirstOrThrow();

                return storageProvider;
            },
        }),

        currentModelVersion: t.field({
            type: MLModelVersion,
            async resolve(root: KyselyMLModel, _args, _ctx) {
                const currentModelVersion = await db
                    .selectFrom('registry.model_versions')
                    .selectAll()
                    .where('registry.model_versions.model_id', '=', root.current_model_version_id)
                    .executeTakeFirst();
                return currentModelVersion;
            },
        }),

        project: t.field({
            type: Project,
            async resolve(root: KyselyMLModel, _args, _ctx) {
                const project = await db
                    .selectFrom('dstk_user.projects')
                    .selectAll()
                    .where('dstk_user.projects.project_id', '=', root.project_id)
                    .executeTakeFirstOrThrow();

                return project;
            },
        }),

        isArchived: t.exposeBoolean('is_archived'),
        modelName: t.exposeString('model_name'),
        dateCreated: t.field({
            type: 'String',
            resolve(root: KyselyMLModel, _args, _ctx) {
                return root.date_created.toISOString();
            },
        }),
        dateModified: t.field({
            type: 'String',
            resolve(root: KyselyMLModel, _args, _ctx) {
                return root.date_modified.toISOString();
            },
        }),
        description: t.exposeString('description'),
        createdBy: t.field({
            type: User,
            async resolve(root: KyselyMLModel, _args, _ctx) {
                const user = await db
                    .selectFrom('dstk_user.user')
                    .selectAll()
                    .where('dstk_user.user.user_id', '=', root.created_by_id)
                    .executeTakeFirstOrThrow();
                return user;
            },
        }),
        modifiedBy: t.field({
            type: User,
            async resolve(root: KyselyMLModel, _args, _ctx) {
                const user = await db
                    .selectFrom('dstk_user.user')
                    .selectAll()
                    .where('dstk_user.user.user_id', '=', root.modified_by_id)
                    .executeTakeFirstOrThrow();
                return user;
            },
        }),
    }),
});
