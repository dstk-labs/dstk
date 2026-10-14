import type { Selectable } from "kysely";
import type { DstkUserDeviceCodes } from "@/db/db.js";
import { builder } from "@/builder.js";
import { db } from "@/db/kysely.js";
import { AccountError } from "@/utils/errors.js";

export type KyselyDeviceCode = Selectable<DstkUserDeviceCodes>;

export const DeviceCode = builder.objectRef<KyselyDeviceCode>("DeviceCode");

builder.objectType(DeviceCode, {
  fields: t => ({
    id: t.field({
      type: "ID",
      resolve(root) {
        return root.id;
      },
    }),
    userCode: t.exposeString("userCode"),
    clientId: t.exposeString("clientId", { nullable: true }),
    status: t.exposeString("status"),
    expiresAt: t.field({
      type: "String",
      resolve(root) {
        return root.expiresAt.toISOString();
      },
    }),
  }),
});

// Mirrors better-auth's internal user code normalization, which it does not export.
function normalizeUserCode(userCode: string): string {
  return userCode.replace(/[^a-z0-9]/gi, "").toUpperCase();
}

export async function selectClaimedDeviceCode(userCode: string, userId: string) {
  return db
    .selectFrom("dstkUser.deviceCodes")
    .selectAll()
    .where("dstkUser.deviceCodes.userCode", "=", normalizeUserCode(userCode))
    .where("dstkUser.deviceCodes.userId", "=", userId)
    .executeTakeFirstOrThrow(
      () => new AccountError({ name: "DEVICE_CODE_ERROR" }),
    );
}
