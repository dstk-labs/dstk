import { MLModel, ObjectionMLModel } from './model.js';
import { builder } from '../../builder.js';
import { MLModelConnection } from './modelConnection.js';
import { ObjectionCursor } from '../metadata/cursor.js';
import { CursorError } from '../../utils/errors.js';
import { Encoder } from '../../utils/encoder.js';
import { ObjectionTeamEdge } from '../user/team.js';

const encoder = new Encoder();

builder.queryFields((t) => ({
    listMLModels: t.field({
        type: MLModelConnection,
        authScopes: {
            loggedIn: true,
        },
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
            const userTeams = await ObjectionTeamEdge.query()
                .where({ userId: _ctx.user.$id() })
                .select(['teamId']);

            const now = new Date(Date.now()).toISOString();
            const nowPlusFiveMins = new Date(Date.now() + 5 * 60 * 1000).toISOString();
            const query = ObjectionMLModel.query()
                .withGraphJoined('projects')
                .whereIn('projects.teamId', userTeams.map(edge => edge.teamId));

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

                    const [id, dateCreated] = encoder.decode(cursor.cursorToken);

                    query
                        .where('dateCreated', '>=', new Date(dateCreated).toISOString())
                        .andWhere('id', '>', id);
                } else {
                    throw new CursorError({ name: 'TOKEN_DOES_NOT_EXIST' });
                }
            }

            const mlModels = await query.limit(args.first + 1).orderBy(['dateCreated', 'id']);

            const hasPreviousPage = !!args.after;
            const hasNextPage = mlModels.length > 1 && mlModels.length > args.first;
            const edges = mlModels.slice(0, args.first);

            const lastResult = edges[edges.length - 1];

            const cursor =
                edges.length > 0
                    ? await ObjectionCursor.query().findOne({
                          cursorRelation: 'model',
                          cursorToken: encoder.encode(
                              lastResult.id.toString(),
                              lastResult.dateCreated,
                          ),
                      })
                    : undefined;

            const result = cursor
                ? await cursor.$query().patchAndFetch({ expiration: nowPlusFiveMins })
                : edges.length > 0
                ? await ObjectionCursor.query().insertAndFetch({
                      cursorToken: encoder.encode(
                          edges[edges.length - 1].id,
                          edges[edges.length - 1].dateCreated,
                      ),
                      cursorRelation: 'model',
                  })
                : undefined;

            const continuationToken = result?.cursorToken;

            return {
                edges: edges.map((mlModel) => ({
                    cursor: encoder.encode(mlModel.id.toString(), mlModel.dateCreated),
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
        authScopes: {
            loggedIn: true,
        },
        args: {
            modelId: t.arg.string({ required: true }),
        },
        async resolve(root, args, ctx) {
            const userTeams = await ObjectionTeamEdge.query()
                .where({ userId: ctx.user.$id() })
                .select(['teamId']);

            const mlModel = await ObjectionMLModel.query()
                .findById(args.modelId)
                .withGraphJoined('projects')
                .whereIn('projects.teamId', userTeams.map(edge => edge.teamId));
            return mlModel;
        },
    }),
}));
