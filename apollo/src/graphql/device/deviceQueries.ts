import { builder } from "@/builder.js";
import { DeviceCode, selectClaimedDeviceCode } from "@/graphql/device/device.js";
import { queryNamespace } from "@/graphql/misc/namespace.js";
import { auth } from "@/utils/auth.js";
import { AccountError } from "@/utils/errors.js";

const DeviceQuery = queryNamespace("device", "DeviceQuery");

builder.objectFields(DeviceQuery, t => ({
  verify: t.field({
    type: DeviceCode,
    authScopes: {
      loggedIn: true,
    },
    args: {
      userCode: t.arg.string({ required: true }),
    },
    async resolve(_root, args, ctx) {
      try {
        await auth.api.deviceVerify({
          headers: ctx.headers,
          query: {
            user_code: args.userCode,
          },
        });
      }
      catch {
        throw new AccountError({ name: "DEVICE_CODE_ERROR" });
      }

      return selectClaimedDeviceCode(args.userCode, ctx.user.id);
    },
  }),
}));
