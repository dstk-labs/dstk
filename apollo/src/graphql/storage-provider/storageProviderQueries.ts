import type { Expression, SqlBool } from "kysely";
import { builder } from "@/builder.js";
import { db } from "@/db/kysely.js";
import { queryNamespace } from "@/graphql/misc/namespace.js";
import { pageArgs, paginate } from "@/graphql/misc/pagination.js";
import { StorageProviderObjectConnection } from "@/graphql/storage-provider/storageProviderObjectConnection.js";
import { RegistryOperationError } from "@/utils/errors.js";
import { ListObjects } from "@/utils/s3-api.js";
import { StorageProvider } from "./storageProvider.js";
import { StorageProviderConnection } from "./storageProviderConnection.js";

const StorageProviderQuery = queryNamespace("storageProvider", "StorageProviderQuery");

builder.objectFields(StorageProviderQuery, t => ({
  list: t.field({
    type: StorageProviderConnection,
    authScopes: {
      loggedIn: true,
    },
    args: {
      includeArchived: t.arg.boolean({ required: true, defaultValue: false }),
      bucket: t.arg.string(),
      teamId: t.arg.string({ required: true }),
      ...pageArgs,
    },
    async resolve(_root, args, ctx) {
      await db
        .selectFrom("dstkUser.members")
        .select("dstkUser.members.id")
        .where("dstkUser.members.userId", "=", ctx.user.id)
        .where("dstkUser.members.teamId", "=", args.teamId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "PROVIDER_PERMISSION_ERROR" }),
        );

      const query = db
        .selectFrom("registry.storageProviders")
        .selectAll()
        .where((eb) => {
          const statements: Expression<SqlBool>[] = [];

          statements.push(eb(
            "registry.storageProviders.teamId",
            "=",
            args.teamId,
          ));

          if (!args.includeArchived) {
            statements.push(eb(
              "registry.storageProviders.isArchived",
              "is",
              false,
            ));
          }

          if (args.bucket) {
            statements.push(eb(
              "registry.storageProviders.bucket",
              "ilike",
              `%${args.bucket}%`,
            ));
          }

          return eb.and(statements);
        });

      return paginate(query, ["registry.storageProviders.dateCreated", "registry.storageProviders.id"], args);
    },
  }),
  get: t.field({
    type: StorageProvider,
    authScopes: {
      loggedIn: true,
    },
    args: {
      storageProviderId: t.arg.string({ required: true }),
    },
    async resolve(_root, args, ctx) {
      const storageProvider = await db
        .selectFrom("registry.storageProviders")
        .selectAll()
        .where("registry.storageProviders.providerId", "=", args.storageProviderId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "PROVIDER_NOT_FOUND_ERROR" }),
        );

      await db
        .selectFrom("dstkUser.members")
        .select("dstkUser.members.id")
        .where("dstkUser.members.userId", "=", ctx.user.id)
        .where("dstkUser.members.teamId", "=", storageProvider.teamId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "PROVIDER_PERMISSION_ERROR" }),
        );

      return storageProvider;
    },
  }),
  listObjects: t.field({
    type: StorageProviderObjectConnection,
    authScopes: {
      loggedIn: true,
    },
    args: {
      modelVersionId: t.arg.string({ required: true }),
      ...pageArgs,
      prefix: t.arg.string(),
    },
    async resolve(_root, args, ctx) {
      const modelVersion = await db
        .selectFrom("registry.modelVersions")
        .select(["registry.modelVersions.modelId", "registry.modelVersions.s3Prefix"])
        .where("registry.modelVersions.modelVersionId", "=", args.modelVersionId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "VERSION_PERMISSION_ERROR" }),
        );

      const parentModel = await db
        .selectFrom("registry.models")
        .select(["registry.models.projectId", "registry.models.storageProviderId"])
        .where("registry.models.modelId", "=", modelVersion.modelId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "MODEL_PERMISSION_ERROR" }),
        );

      const project = await db
        .selectFrom("dstkUser.projects")
        .select("dstkUser.projects.teamId")
        .where("dstkUser.projects.projectId", "=", parentModel.projectId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" }),
        );

      await db
        .selectFrom("dstkUser.members")
        .select("dstkUser.members.id")
        .where("dstkUser.members.userId", "=", ctx.user.id)
        .where("dstkUser.members.teamId", "=", project.teamId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "VERSION_PERMISSION_ERROR" }),
        );

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

      const prefix = `${modelVersion.s3Prefix}`.concat(args.prefix ? `/${args.prefix}` : "");

      /* If no continuation token, the s3 api will always
         return the root directory as an object. We do not want
         this returned to the client. */
      const limit = !args.after ? args.first + 1 : args.first;

      const continuationToken = args.after || undefined;

      const { Contents, IsTruncated, NextContinuationToken, Prefix } = await ListObjects(
        modelStorageProvider,
        limit,
        prefix,
        continuationToken,
      );

      const objects = Contents
        ? Contents.filter(Content => Content.Key?.slice(0, -1) !== Prefix).map(
            Content => ({
              name: Content.Key && Content.Key.replace(`${prefix}/`, ""),
              size: Content.Size,
              lastModified: Content.LastModified && Content.LastModified.toISOString(),
            }),
          )
        : [];

      return {
        edges: objects.map(object => ({
          cursor: NextContinuationToken ?? "",
          node: object,
        })),
        pageInfo: {
          hasPreviousPage: !!args.after,
          hasNextPage: IsTruncated ?? false,
          continuationToken: NextContinuationToken,
        },
      };
    },
  }),
}));
