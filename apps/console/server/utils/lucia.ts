import { lucia } from 'lucia';
import { prisma } from '@lucia-auth/adapter-prisma';
import { h3 } from 'lucia/middleware';
import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();

export const auth = lucia({
  adapter: prisma(client),
  env: process.dev ? 'DEV' : 'PROD',
  middleware: h3(),

  getUserAttributes: ({ email, email_verified, organizations, dev }) => {
    return {
      email,
      email_verified,
      organizations,
      dev,
    };
  },
});

export type Auth = typeof auth;
