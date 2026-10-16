import { builder } from "@/builder.js";
import { DeviceCode, selectClaimedDeviceCode } from "@/graphql/device/device.js";
import { mutationNamespace } from "@/graphql/misc/namespace.js";
import { auth } from "@/utils/auth.js";
import { AccountError } from "@/utils/errors.js";

const DeviceMutation = mutationNamespace("device", "DeviceMutation");

builder.objectFields(DeviceMutation, t => ({
  approve: t.field({
    type: DeviceCode,
    authScopes: {
      loggedIn: true,
    },
    args: {
      userCode: t.arg.string({ required: true }),
    },
    async resolve(_root, args, ctx) {
      try {
        await auth.api.deviceApprove({
          headers: ctx.headers,
          body: {
            userCode: args.userCode,
          },
        });
      }
      catch {
        throw new AccountError({ name: "DEVICE_AUTHORIZATION_ERROR" });
      }

      return selectClaimedDeviceCode(args.userCode, ctx.user.id);
    },
  }),
  deny: t.field({
    type: DeviceCode,
    authScopes: {
      loggedIn: true,
    },
    args: {
      userCode: t.arg.string({ required: true }),
    },
    async resolve(_root, args, ctx) {
      try {
        await auth.api.deviceDeny({
          headers: ctx.headers,
          body: {
            userCode: args.userCode,
          },
        });
      }
      catch {
        throw new AccountError({ name: "DEVICE_AUTHORIZATION_ERROR" });
      }

      return selectClaimedDeviceCode(args.userCode, ctx.user.id);
    },
  }),
}));
