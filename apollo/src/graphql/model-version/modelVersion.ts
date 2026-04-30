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
        return root.modelVersionId;
      },
    }),
    modelId: t.field({
      type: MLModel,
      async resolve(root: KyselyMLModelVersion, _args, _ctx) {
        const mlModel = await db
          .selectFrom("registry.models")
          .selectAll()
          .where("registry.models.modelId", "=", root.modelId)
          .executeTakeFirstOrThrow();
        return mlModel;
      },
    }),
    isArchived: t.exposeBoolean("isArchived"),
    isFinalized: t.exposeBoolean("isFinalized"),
    numericVersion: t.exposeInt("numericVersion"),
    description: t.exposeString("description"),
    dateCreated: t.field({
      type: "String",
      resolve(root: KyselyMLModelVersion, _args, _ctx) {
        return root.dateCreated.toISOString();
      },
    }),
    s3Prefix: t.exposeString("s3Prefix"),
    createdBy: t.field({
      type: User,
      async resolve(root: KyselyMLModelVersion, _args, _ctx) {
        const user = await db
          .selectFrom("dstkUser.users")
          .selectAll()
          .where("dstkUser.users.id", "=", root.createdById)
          .executeTakeFirstOrThrow();

        return user;
      },
    }),
  }),
});
