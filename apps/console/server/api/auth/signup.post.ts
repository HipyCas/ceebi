import { z } from 'zod';
import { Prisma } from '@prisma/client';

const schema = z.object({
  email: z
    .string({
      required_error: 'missing email field',
      invalid_type_error: 'email must be a string',
    })
    .email({ message: 'email must be a valid email' })
    .trim()
    .toLowerCase(),
  password: z
    .string({
      required_error: 'missing password field',
      invalid_type_error: 'password must be a string',
    })
    .min(10, { message: 'password must be at least 10 characters long' }),
});

export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event);
  const zodParse = schema.safeParse(rawBody);
  if (!zodParse.success) {
    throw createError({
      statusCode: 400,
      message: zodParse.error.message,
    });
  }

  const { email, password } = zodParse.data;

  try {
    const user = await auth.createUser({
      key: {
        providerId: 'email',
        providerUserId: email,
        password,
      },
      attributes: {
        email,
        email_verified: false,
        //@ts-expect-error This is actually the correct thing to do with Prisma
        organizations: {},
      },
    });
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const authRequest = auth.handleRequest(event);
    authRequest.setSession(session);
    return sendRedirect(event, '/admin');
  } catch (e) {
    console.error('error', e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002')
        throw createError({
          message: 'email already registered',
          statusCode: 400,
        });
    }
    throw createError({
      message: 'unknown error from server',
      statusCode: 500,
    });
  }
});
