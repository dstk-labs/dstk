import { builder } from "../../builder.js";

export const Status = builder.enumType('Status', {
    values: ['ALL', 'ARCHIVED_ONLY', 'ACTIVE_ONLY'] as const,
});
