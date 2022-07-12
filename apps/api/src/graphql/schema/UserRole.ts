import { DBUser } from '../../types/db.js';
import { builder } from '../builder.js';
import { connectionBuilder } from '../util/connectionBuilder.js';

export const UserRole = builder.prismaNode('UserRole', {
  id: { field: 'id' },
  authScopes: { loggedIn: true },
  fields: (t) => ({
    name: t.exposeString('name'),
    value: t.exposeString('value'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    usersConnection: t.relatedConnection('users', connectionBuilder<DBUser>(t, ['name'])),
  }),
});
