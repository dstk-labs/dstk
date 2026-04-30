import { builder } from "@/builder.js";
import { db } from "@/db/kysely.js";
import { auth } from "@/utils/auth.js";
import { RegistryOperationError } from "@/utils/errors.js";
import {
  AbortMultipartUpload,
  CreateMultipartUpload,
  CreatePresignedURLForPart,
  FinalizeMultipartUpload,
  PresignedURL,
} from "@/utils/s3-api.js";
import { MLModelVersion } from "./modelVersion.js";

export const ModelVersionInputType = builder.inputType("ModelVersionInput", {
  fields: t => ({
    modelId: t.string({ required: true }),
    description: t.string(),
  }),
});

export const EditModelVersionInputType = builder.inputType("EditModelVersion", {
  fields: t => ({
    description: t.string(),
  }),
});

export const CompletedPartInputType = builder.inputType("CompletedPartInput", {
  fields: t => ({
    ETag: t.string({ required: true }),
    PartNumber: t.int({ required: true }),
  }),
});

export const PartsInputType = builder.inputType("PartsInput", {
  fields: t => ({
    Parts: t.field({
      required: true,
      type: [CompletedPartInputType],
    }),
  }),
});

export const PresignMethod = builder.enumType("PresignMethod", {
  values: [
    "createMultipartUpload",
    "uploadPart",
    "finalizeMultipartUpload",
    "abortMultipartUpload",
  ] as const,
});

export const PresignedURLInputType = builder.inputType("PresignedURLInput", {
  fields: t => ({
    modelVersionId: t.string({ required: true }),
    method: t.field({
      required: true,
      type: PresignMethod,
    }),
    filename: t.string({ required: true }),
    uploadId: t.string(),
    partNumber: t.int(),
    multipartUpload: t.field({
      type: PartsInputType,
    }),
  }),
});

builder.mutationFields(t => ({
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
          .selectFrom("registry.models")
          .select(["registry.models.isArchived", "registry.models.projectId"])
          .where("registry.models.modelId", "=", args.data.modelId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "MODEL_PERMISSION_ERROR" }),
          );

        const project = await trx
          .selectFrom("dstkUser.projects")
          .select(["dstkUser.projects.teamId", "dstkUser.projects.projectId"])
          .where("dstkUser.projects.projectId", "=", parentModel.projectId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" }),
          );

        if (parentModel.isArchived === true) {
          throw new RegistryOperationError({ name: "ARCHIVED_MODEL_ERROR" });
        }

        const { success } = await auth.api.hasPermission({
          headers: ctx.headers,
          body: {
            permissions: {
              modelVersion: ["create"],
            },
            organizationId: project.teamId,
          },
        });

        if (!success) {
          throw new RegistryOperationError({ name: "VERSION_PERMISSION_ERROR" });
        }
        const lastModelVersion = await trx
          .selectFrom("registry.modelVersions")
          .select("registry.modelVersions.numericVersion")
          .where("registry.modelVersions.modelId", "=", args.data.modelId)
          .orderBy("registry.modelVersions.numericVersion", "desc")
          .executeTakeFirst();

        const incrementedVersion = (lastModelVersion?.numericVersion || 0) + 1;

        const s3Prefix = `teams/${project.teamId}/projects/${project.projectId}/models/${args.data.modelId}/versions/${incrementedVersion}`;

        const mlModelVersion = await trx
          .insertInto("registry.modelVersions")
          .values({
            modelId: args.data.modelId,
            description: args.data.description,
            numericVersion: incrementedVersion,
            s3Prefix,
            createdById: ctx.user.id,
          })
          .returningAll()
          .executeTakeFirstOrThrow();

        await trx
          .updateTable("registry.models")
          .set({
            currentModelVersionId: mlModelVersion.modelVersionId,
          })
          .where("registry.models.modelId", "=", args.data.modelId)
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
          .selectFrom("registry.modelVersions")
          .select(["registry.modelVersions.isArchived", "registry.modelVersions.modelId"])
          .where("registry.modelVersions.modelVersionId", "=", args.modelVersionId)
          .executeTakeFirstOrThrow(() => new RegistryOperationError({ name: "VERSION_PERMISSION_ERROR" }));

        const parentModel = await trx
          .selectFrom("registry.models")
          .select(["registry.models.projectId"])
          .where("registry.models.modelId", "=", mlModelVersion.modelId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "MODEL_PERMISSION_ERROR" }),
          );

        const project = await trx
          .selectFrom("dstkUser.projects")
          .select("dstkUser.projects.teamId")
          .where("dstkUser.projects.projectId", "=", parentModel.projectId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" }),
          );

        const { success } = await auth.api.hasPermission({
          headers: ctx.headers,
          body: {
            permissions: {
              modelVersion: ["edit"],
            },
            organizationId: project.teamId,
          },
        });

        if (!success) {
          throw new RegistryOperationError({ name: "VERSION_PERMISSION_ERROR" });
        }

        if (mlModelVersion.isArchived === true) {
          throw new RegistryOperationError({ name: "ARCHIVED_MODEL_VERSION_ERROR" });
        }

        const result = await trx
          .updateTable("registry.modelVersions")
          .set({
            description: args.data.description,
            dateModified: new Date(),
            modifiedById: ctx.user.id,
          })
          .where("registry.modelVersions.modelVersionId", "=", args.modelVersionId)
          .returningAll()
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "MODEL_VERSION_WRITE_ERROR" }),
          );

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
          .selectFrom("registry.modelVersions")
          .select([
            "registry.modelVersions.modelId",
            "registry.modelVersions.isArchived",
          ])
          .where("registry.modelVersions.modelVersionId", "=", args.modelVersionId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "VERSION_PERMISSION_ERROR" }),
          );

        const parentModel = await trx
          .selectFrom("registry.models")
          .select([
            "registry.models.modelId",
            "registry.models.projectId",
            "registry.models.isArchived",
          ])
          .where("registry.models.modelId", "=", mlModelVersion.modelId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "MODEL_PERMISSION_ERROR" }),
          );

        const project = await trx
          .selectFrom("dstkUser.projects")
          .select("dstkUser.projects.teamId")
          .where("dstkUser.projects.projectId", "=", parentModel.projectId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" }),
          );

        const { success } = await auth.api.hasPermission({
          headers: ctx.headers,
          body: {
            permissions: {
              modelVersion: ["publish"],
            },
            organizationId: project.teamId,
          },
        });

        if (!success) {
          throw new RegistryOperationError({ name: "VERSION_PERMISSION_ERROR" });
        }

        if (parentModel.isArchived === true) {
          throw new RegistryOperationError({ name: "ARCHIVED_MODEL_ERROR" });
        }
        if (mlModelVersion.isArchived === true) {
          throw new RegistryOperationError({ name: "ARCHIVED_MODEL_VERSION_ERROR" });
        }

        const publishedMlModelVersion = await trx
          .updateTable("registry.modelVersions")
          .set({
            isFinalized: true,
            dateModified: new Date(),
            modifiedById: ctx.user.id,
          })
          .where("registry.modelVersions.modelVersionId", "=", args.modelVersionId)
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
          .selectFrom("registry.modelVersions")
          .select([
            "registry.modelVersions.modelId",
            "registry.modelVersions.isArchived",
          ])
          .where("registry.modelVersions.modelVersionId", "=", args.modelVersionId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "VERSION_PERMISSION_ERROR" }),
          );

        const parentModel = await trx
          .selectFrom("registry.models")
          .select("registry.models.projectId")
          .where("registry.models.modelId", "=", mlModelVersion.modelId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "MODEL_PERMISSION_ERROR" }),
          );

        const project = await trx
          .selectFrom("dstkUser.projects")
          .select("teamId")
          .where("dstkUser.projects.projectId", "=", parentModel.projectId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" }),
          );

        const { success } = await auth.api.hasPermission({
          headers: ctx.headers,
          body: {
            permissions: {
              modelVersion: ["archive"],
            },
            organizationId: project.teamId,
          },
        });

        if (!success) {
          throw new RegistryOperationError({ name: "VERSION_PERMISSION_ERROR" });
        }

        const archivedModelVersion = await trx
          .updateTable("registry.modelVersions")
          .set({
            isArchived: !mlModelVersion.isArchived,
            dateModified: new Date(),
            modifiedById: ctx.user.id,
          })
          .where("registry.modelVersions.modelVersionId", "=", args.modelVersionId)
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
        .selectFrom("registry.modelVersions")
        .select([
          "registry.modelVersions.modelId",
          "registry.modelVersions.isArchived",
          "registry.modelVersions.isFinalized",
          "registry.modelVersions.s3Prefix",
        ])
        .where("registry.modelVersions.modelVersionId", "=", args.data.modelVersionId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "VERSION_PERMISSION_ERROR" }),
        );

      if (mlModelVersion.isArchived) {
        throw new RegistryOperationError({ name: "ARCHIVED_MODEL_VERSION_ERROR" });
      }

      if (mlModelVersion.isFinalized === true) {
        throw new RegistryOperationError({ name: "PUBLISHED_MODEL_VERSION_ERROR" });
      }

      const parentModel = await db
        .selectFrom("registry.models")
        .select([
          "registry.models.storageProviderId",
          "registry.models.projectId",
          "registry.models.isArchived",
        ])
        .where("registry.models.modelId", "=", mlModelVersion.modelId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "MODEL_PERMISSION_ERROR" }),
        );

      if (parentModel.isArchived === true) {
        throw new RegistryOperationError({ name: "ARCHIVED_MODEL_ERROR" });
      }

      const modelStorageProvider = await db
        .selectFrom("registry.storageProviders")
        .selectAll()
        .where(
          "registry.storageProviders.providerId",
          "=",
          parentModel.storageProviderId,
        )
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "PROVIDER_NOT_FOUND_ERROR" }),
        );

      if (modelStorageProvider.isArchived === true) {
        throw new RegistryOperationError({ name: "ARCHIVED_STORAGE_ERROR" });
      }

      const project = await db
        .selectFrom("dstkUser.projects")
        .select("dstkUser.projects.teamId")
        .where("dstkUser.projects.projectId", "=", parentModel.projectId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" }),
        );

      // Project viewers are not granted permission to download
      // model objects because I'm feeling petty tonight
      const { success } = await auth.api.hasPermission({
        headers: ctx.headers,
        body: {
          permissions: {
            modelVersion: ["download"],
          },
          organizationId: project.teamId,
        },
      });

      if (!success) {
        throw new RegistryOperationError({ name: "VERSION_PERMISSION_ERROR" });
      }

      const key = `${mlModelVersion.s3Prefix}/${args.data.filename}`;

      if (args.data.method === "createMultipartUpload") {
        const result = await CreateMultipartUpload(modelStorageProvider, key);

        return {
          uploadId: result.UploadId,
          key: result.Key,
        };
      }

      if (!args.data.uploadId) {
        throw new RegistryOperationError({ name: "MISSING_UPLOAD_ID_ERROR" });
      }
      if (args.data.method === "uploadPart") {
        if (!args.data.partNumber) {
          throw new RegistryOperationError({ name: "MISSING_PART_NUM_ERROR" });
        }

        const result = await CreatePresignedURLForPart(
          modelStorageProvider,
          key,
          args.data.uploadId,
          args.data.partNumber,
        );

        return {
          uploadId: args.data.uploadId,
          key,
          partNumber: args.data.partNumber,
          url: result,
        };
      }
      else if (args.data.method === "abortMultipartUpload") {
        await AbortMultipartUpload(modelStorageProvider, key, args.data.uploadId);

        return {};
      }

      if (!args.data.multipartUpload) {
        throw new RegistryOperationError({ name: "MULTIPART_FINALIZATION_ERROR" });
      }
      if (args.data.method === "finalizeMultipartUpload") {
        const result = await FinalizeMultipartUpload(
          modelStorageProvider,
          key,
          args.data.uploadId,
          args.data.multipartUpload,
        );
        return {
          uploadId: args.data.uploadId,
          key,
          ETag: result.ETag,
          url: result.Location,
        };
      }

      return {};
    },
  }),
}));
