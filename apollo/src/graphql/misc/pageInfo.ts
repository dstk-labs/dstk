import { builder } from '../../builder.js';

export const PageInfo = builder.objectRef<PageInfoClass>('PageInfo');

builder.objectType(PageInfo, {
    fields: (t) => ({
        hasPreviousPage: t.exposeBoolean('hasPreviousPage'),
        hasNextPage: t.exposeBoolean('hasNextPage'),
        continuationToken: t.exposeString('continuationToken'),
    }),
});

export class PageInfoClass {
    hasPreviousPage!: boolean;
    hasNextPage!: boolean;
    continuationToken?: string;
}
