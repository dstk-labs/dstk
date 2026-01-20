import type { Selectable } from "kysely";
import type { RegistryModelVersions } from "../../db/db.js";
import { builder } from "../../builder.js";
import { db } from "../../db/kysely.js";
import { MLModel } from "../model/model.js";
import { User } from "../user/user.js";

export type KyselyMLModelVersion = Selectable<RegistryModelVersions>;

export const MLModelVersion = builder.objectRef<KyselyMLModelVersion>("MLModelVersion");
builder.objectType(MLModelVersion, {
  fields: t => ({
    modelVersionId: t.field({
      type: "ID",
      resolve(root: KyselyMLModelVersion, _args, _ctx) {
        return root.model_version_id;
      },
    }),
    modelId: t.field({
      type: MLModel,
      async resolve(root: KyselyMLModelVersion, _args, _ctx) {
        const mlModel = await db
          .selectFrom("registry.models")
          .selectAll()
          .where("registry.models.model_id", "=", root.model_id)
          .executeTakeFirstOrThrow();
        return mlModel;
      },
    }),
    isArchived: t.exposeBoolean("is_archived"),
    isFinalized: t.exposeBoolean("is_finalized"),
    numericVersion: t.exposeInt("numeric_version"),
    description: t.exposeString("description"),
    dateCreated: t.field({
      type: "String",
      resolve(root: KyselyMLModelVersion, _args, _ctx) {
        return root.date_created.toISOString();
      },
    }),
    s3Prefix: t.exposeString("s3_prefix"),
    createdBy: t.field({
      type: User,
      async resolve(root: KyselyMLModelVersion, _args, _ctx) {
        const user = await db
          .selectFrom("dstk_user.user")
          .selectAll()
          .where("dstk_user.user.user_id", "=", root.created_by_id)
          .executeTakeFirstOrThrow();

        return user;
      },
    }),
  }),
});
