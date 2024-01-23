import { builder } from '../../builder.js';
import { ObjectionEdge, Role } from './edges.js';

builder.queryFields((t) =>({
    listRoles: t.field({
        type: [Role],
        authScopes: {
            loggedIn: true,
        },
        async resolve(root, args, ctx) {
            const roles = await ObjectionEdge.query() as [ObjectionEdge];
            return roles;
        },
    }),
}));