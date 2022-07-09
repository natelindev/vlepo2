import './Blog.js';
import './Comment.js';
import './Design.js';
import './Image.js';
import './Link.js';
import './Login.js';
import './Node.js';
import './Paper.js';
import './Post.js';
import './Project.js';
import './Rating.js';
import './Reaction.js';
import './Share.js';
import './Subscriber.js';
import './Tag.js';
import './Thought.js';
import './Translation.js';
import './User.js';
import './UserRole.js';
import './Viewer.js';
import './Query.js';

import { writeFile } from 'fs/promises';
import { lexicographicSortSchema, printSchema } from 'graphql';
import { envDetect } from 'helpers';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

/* eslint-disable @typescript-eslint/no-unused-vars */
import { builder } from '../builder.js';

builder.mutationType({});

export const schema = builder.toSchema({});

if (envDetect.isDev) {
  writeFile(
    `${dirname(fileURLToPath(import.meta.url))}/../../../../web/schema/schema.graphql`,
    printSchema(lexicographicSortSchema(schema)),
  );
}
