import { MLModel, ObjectionMLModel } from './model.js';
import { builder } from '../../builder.js';
import { MLModelConnection } from './modelConnection.js';
import { ObjectionCursor } from '../metadata/cursor.js';
import { CursorError } from '../../utils/errors.js';
import { Encoder } from '../../utils/encoder.js';

const encoder = new Encoder();

builder.queryFields((t) => ({
    listMLModels: t.field({
        type: MLModelConnection,
        args: {
            modelName: t.arg.string(),
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
            const query = ObjectionMLModel.query();

            if (args.modelName) {
                query.where('modelName', 'ILIKE', `%${args.modelName}%`);
            }

            if (args.after) {
                const cursor = await ObjectionCursor.query().findOne({
                    cursorToken: args.after,
                    cursorRelation: 'model',
                });

                /* This will always return true b/c we do not have a scheduled
                   system inplace to delete expired tokens. */
                if (cursor) {
                    if (cursor.expiration <= now) {
                        await cursor.$query().patch({ expiration: nowPlusFiveMins });
                    }

                    query.where('id', '>', cursor.resultId);
                } else {
                    throw new CursorError({ name: 'TOKEN_DOES_NOT_EXIST' });
                }
            }

            const mlModels = await query.limit(args.first + 1).orderBy('id');

            const hasPreviousPage = !!args.after;
            const hasNextPage = mlModels.length > 1 && mlModels.length > args.first;
            const edges = mlModels.slice(0, args.first);

            const cursor =
                edges.length > 0
                    ? await ObjectionCursor.query().findOne({
                          cursorRelation: 'model',
                          resultId: edges[edges.length - 1].id,
                      })
                    : undefined;

            const result = cursor
                ? await cursor.$query().patchAndFetch({ expiration: nowPlusFiveMins })
                : edges.length > 0
                ? await ObjectionCursor.query().insertAndFetch({
                      cursorToken: encoder.encode(edges[edges.length - 1].id.toString()),
                      cursorRelation: 'model',
                      resultId: edges[edges.length - 1].id,
                  })
                : undefined;

            const continuationToken = result?.cursorToken;

            return {
                edges: edges.map((mlModel) => ({
                    cursor: encoder.encode(mlModel.id.toString()),
                    node: mlModel,
                })),
                pageInfo: {
                    hasPreviousPage: hasPreviousPage,
                    hasNextPage: hasNextPage,
                    continuationToken: continuationToken,
                },
            };
        },
    }),
    getMLModel: t.field({
        type: MLModel,
        args: {
            modelId: t.arg.string({ required: true }),
        },
        async resolve(root, args, ctx) {
            const mlModel = (await ObjectionMLModel.query().findById(
                args.modelId,
            )) as typeof MLModel.$inferType;
            return mlModel;
        },
    }),
}));
