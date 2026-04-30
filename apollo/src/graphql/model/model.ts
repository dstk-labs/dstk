import type { Selectable } from "kysely";
import type { RegistryModels } from "@/db/db.js";
import { builder } from "@/builder.js";
import { db } from "@/db/kysely.js";
import { MLModelVersion } from "@/graphql/model-version/modelVersion.js";
import { Project } from "@/graphql/project/project.js";
import { StorageProvider } from "@/graphql/storage-provider/storageProvider.js";
import { User } from "@/graphql/user/user.js";

export type KyselyMLModel = Selectable<RegistryModels>;

export const MLModel = builder.objectRef<KyselyMLModel>("MLModel");

builder.objectType(MLModel, {
  fields: t => ({
    modelId: t.field({
      type: "ID",
      resolve(root: KyselyMLModel, _args, _ctx) {
        return root.modelId;
      },
    }),
    storageProvider: t.field({
      type: StorageProvider,
      async resolve(root: KyselyMLModel, _args, _ctx) {
        const storageProvider = await db
          .selectFrom("registry.storageProviders")
          .selectAll()
          .where("registry.storageProviders.providerId", "=", root.storageProviderId)
          .executeTakeFirstOrThrow();

        return storageProvider;
      },
    }),

    currentModelVersion: t.field({
      type: MLModelVersion,
      async resolve(root: KyselyMLModel, _args, _ctx) {
        const currentModelVersion = await db
          .selectFrom("registry.modelVersions")
          .selectAll()
          .where("registry.modelVersions.modelId", "=", root.currentModelVersionId)
          .executeTakeFirst();
        return currentModelVersion;
      },
    }),

    project: t.field({
      type: Project,
      async resolve(root: KyselyMLModel, _args, _ctx) {
        const project = await db
          .selectFrom("dstkUser.projects")
          .selectAll()
          .where("dstkUser.projects.projectId", "=", root.projectId)
          .executeTakeFirstOrThrow();

        return project;
      },
    }),

    isArchived: t.exposeBoolean("isArchived"),
    modelName: t.exposeString("modelName"),
    dateCreated: t.field({
      type: "String",
      resolve(root: KyselyMLModel, _args, _ctx) {
        return root.dateCreated.toISOString();
      },
    }),
    dateModified: t.field({
      type: "String",
      resolve(root: KyselyMLModel, _args, _ctx) {
        return root.dateModified.toISOString();
      },
    }),
    description: t.exposeString("description"),
    createdBy: t.field({
      type: User,
      async resolve(root: KyselyMLModel, _args, _ctx) {
        const user = await db
          .selectFrom("dstkUser.users")
          .selectAll()
          .where("dstkUser.users.id", "=", root.createdById)
          .executeTakeFirstOrThrow();
        return user;
      },
    }),
    modifiedBy: t.field({
      type: User,
      async resolve(root: KyselyMLModel, _args, _ctx) {
        const user = await db
          .selectFrom("dstkUser.users")
          .selectAll()
          .where("dstkUser.users.id", "=", root.modifiedById)
          .executeTakeFirstOrThrow();
        return user;
      },
    }),
  }),
});
