import { MLModelVersion, ObjectionMLModelVersion } from './modelVersion.js';
import { builder } from '../../builder.js';
import { MLModelVersionConnection } from './modelVersionConnection.js';
import { ObjectionCursor } from '../metadata/cursor.js';
import { Encoder } from '../../utils/encoder.js';
import { CursorError } from '../../utils/errors.js';

const encoder = new Encoder();

builder.queryFields((t) => ({
    listMLModelVersions: t.field({
        type: MLModelVersionConnection,
        authScopes: {
            loggedIn: true,
        },
        args: {
            modelId: t.arg.string({ required: true }),
            // TODO: Putting defaultValue & required overrides defaultValue
            first: t.arg({
                type: 'Limit',
                defaultValue: 10,
                required: true,
            }),
            after: t.arg.string(),
        },
        async resolve(_root, args, _ctx) {
            const now = new Date(Date.now()).toISOString();
            const nowPlusFiveMins = new Date(Date.now() + 5 * 60 * 1000).toISOString();
            const query = ObjectionMLModelVersion.query();

            if (args.after) {
                const cursor = await ObjectionCursor.query().findOne({
                    cursorToken: args.after,
                    cursorRelation: 'model_version',
                });

                /* This will always return true b/c we do not have a scheduled
                   system inplace to delete expired tokens. */
                if (cursor) {
                    if (cursor.expiration <= now) {
                        await cursor.$query().patch({ expiration: nowPlusFiveMins });
                    }

                    const [id, numericVersion] = encoder.decode(cursor.cursorToken);

                    query.where('numericVersion', '>', numericVersion).andWhere('id', '>', id);
                } else {
                    throw new CursorError({ name: 'TOKEN_DOES_NOT_EXIST' });
                }
            }

            const mlModelVersions = await query
                .where('modelId', '=', args.modelId)
                .limit(args.first + 1)
                .orderBy(['numericVersion', 'id']);

            const hasPreviousPage = !!args.after;
            const hasNextPage = mlModelVersions.length > 1 && mlModelVersions.length > args.first;
            const edges = mlModelVersions.slice(0, args.first);

            const lastResult = edges[edges.length - 1];

            const cursor =
                edges.length > 0
                    ? await ObjectionCursor.query().findOne({
                          cursorRelation: 'model_version',
                          cursorToken: encoder.encode(lastResult.id, lastResult.numericVersion),
                      })
                    : undefined;

            const result = cursor
                ? await cursor.$query().patchAndFetch({ expiration: nowPlusFiveMins })
                : edges.length > 0
                ? await ObjectionCursor.query().insertAndFetch({
                      cursorToken: encoder.encode(
                          edges[edges.length - 1].id,
                          edges[edges.length - 1].numericVersion,
                      ),
                      cursorRelation: 'model_version',
                  })
                : undefined;

            const continuationToken = result?.cursorToken;

            return {
                edges: edges.map((mlModelVersion) => ({
                    cursor: encoder.encode(mlModelVersion.id, mlModelVersion.numericVersion),
                    node: mlModelVersion,
                })),
                pageInfo: {
                    hasPreviousPage: hasPreviousPage,
                    hasNextPage: hasNextPage,
                    continuationToken: continuationToken,
                },
            };
        },
    }),
    getMLModelVersion: t.field({
        type: MLModelVersion,
        authScopes: {
            loggedIn: true,
        },
        args: {
            modelVersionId: t.arg.string({ required: true }),
        },
        async resolve(_root, args, _ctx) {
            const mlModelVersion = (await ObjectionMLModelVersion.query().findById(
                args.modelVersionId,
            )) as typeof MLModelVersion.$inferType;

            return mlModelVersion;
        },
    }),
}));
