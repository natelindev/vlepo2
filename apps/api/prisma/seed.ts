/* eslint-disable import/no-extraneous-dependencies */
import argon2 from 'argon2';
import cryptoRandomString from 'crypto-random-string';
import { OAuthConsts } from 'helpers';
import log from 'loglevel';

import { faker } from '@faker-js/faker';
import { OAuthGrant, PrismaClient, Visibility } from '@prisma/client';

import { genPostSlug } from '../src/util/genPostSlug.js';

const cleanDB = async (prisma: PrismaClient) => {
  await prisma.$executeRaw`
  do
  $$
  declare
    l_stmt text;
  begin
    select 'truncate ' || string_agg(format('%I.%I', schemaname, tablename), ',')
      into l_stmt
    from pg_tables
    where schemaname in ('public');

    execute l_stmt;
  end;
  $$
  `;
};

export const seedBD = async (prisma: PrismaClient) => {
  try {
    await prisma.oAuthScope.create({
      data: {
        name: 'Self',
        value: 'self',
        description: 'Create, update, delete all resources owned by you',
        childScopes: {
          createMany: {
            data: OAuthConsts.entities.map((entity) => ({
              name: `${entity.charAt(0).toUpperCase()}${entity.slice(1)}`,
              value: `self:${entity}`,
              description: `Create, update, or delete ${entity
                .charAt(0)
                .toUpperCase()}${entity.slice(1)} owned by you`,
            })),
          },
        },
      },
    });

    await Promise.all(
      [...OAuthConsts.entities].map(async (entity) => {
        await prisma.oAuthScope.create({
          data: {
            name: `${entity.charAt(0).toUpperCase()}${entity.slice(1)}`,
            value: entity,
            description: `Create, update, or delete all ${entity
              .charAt(0)
              .toUpperCase()}${entity.slice(1)}s`,
            parent: entity.includes('self')
              ? {
                  connect: {
                    value: `self:${entity}`,
                  },
                }
              : undefined,
            childScopes: {
              createMany: {
                data: [
                  {
                    name: `Create ${entity.charAt(0).toUpperCase()}${entity.slice(1)}`,
                    value: `${entity}:create`,
                    description: `Create ${entity.charAt(0).toUpperCase()}${entity.slice(1)}`,
                  },
                  {
                    name: `Update ${entity.charAt(0).toUpperCase()}${entity.slice(1)}`,
                    value: `${entity}:update`,
                    description: `Update ${entity.charAt(0).toUpperCase()}${entity.slice(1)}`,
                  },
                  {
                    name: `Delete ${entity.charAt(0).toUpperCase()}${entity.slice(1)}`,
                    value: `${entity}:delete`,
                    description: `Delete ${entity.charAt(0).toUpperCase()}${entity.slice(1)}`,
                  },
                ],
              },
            },
          },
        });
      }),
    );
    log.debug(`seeded default oauth scopes`);

    const adminRole = await prisma.userRole.create({
      data: {
        name: 'Administrator',
        value: 'admin',
        scopes: {
          connect: OAuthConsts.entities.map((e) => ({
            value: e,
          })),
        },
      },
    });

    await prisma.userRole.create({
      data: {
        name: 'Visitor',
        value: 'visitor',
        scopes: {
          connect: ['comment:create', 'image:create', 'self'].map((value) => ({
            value,
          })),
        },
      },
    });

    const admin = await prisma.user.create({
      data: {
        id: process.env.DEFAULT_ADMIN_ID,
        email: process.env.DEFAULT_ADMIN_EMAIL,
        password: await argon2.hash(process.env.DEFAULT_ADMIN_PASSWORD),
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        roles: {
          connect: {
            id: adminRole.id,
          },
        },
      },
    });
    log.debug(`seeded admin user`);

    await prisma.oAuthClient.create({
      data: {
        id: process.env.NEXT_PUBLIC_DEFAULT_CLIENT_ID,
        secret: cryptoRandomString({ length: 20, type: 'alphanumeric' }),
        owner: {
          connect: {
            id: admin.id,
          },
        },
        scopes: {
          connect: [...OAuthConsts.entities, 'self'].map((entity) => ({
            value: entity,
          })),
        },
        grants: Object.values(OAuthGrant),
      },
    });
    log.debug(`seeded default oauth client`);

    const defaultBlog = await prisma.blog.create({
      data: {
        id: process.env.DEFAULT_BLOG_ID,
        owner: {
          connect: {
            id: admin.id,
          },
        },
        name: process.env.NEXT_PUBLIC_DEFAULT_BLOG_NAME,
        visitorCount: 0,
      },
    });
    log.debug(`seeded default blog`);

    const posts = Array(100)
      .fill(null)
      .map(() => {
        const title = faker.lorem.sentence(3);
        return {
          title,
          content: faker.lorem.paragraphs(5),
          visibility: Visibility.PUBLISHED,
          ownerId: admin.id,
          blogId: defaultBlog.id,
          slug: genPostSlug(title),
        };
      });
    await prisma.post.createMany({
      data: posts,
    });
    log.debug(`seeded default posts`);
  } catch (err) {
    log.error(err);
    await cleanDB(prisma);
  }
};

(async () => {
  const prisma = new PrismaClient();
  await seedBD(prisma);
})();
