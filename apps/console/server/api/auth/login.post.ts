import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { LuciaError } from 'lucia';

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
  const query = getQuery(event);
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
    const key = await auth.useKey('email', email, password);
    const session = await auth.createSession({
      userId: key.userId,
      attributes: {},
    });
    const authRequest = auth.handleRequest(event);
    authRequest.setSession(session);
    return sendRedirect(event, query.next || '/admin');
  } catch (e) {
    if (
      e instanceof LuciaError &&
      (e.message === 'AUTH_INVALID_KEY_ID' ||
        e.message === 'AUTH_INVALID_PASSWORD')
    )
      throw createError({
        message: 'incorrect email or password',
        statusCode: 400,
      });
    throw createError({
      message: 'unknown error from server',
      statusCode: 500,
    });
  }
});
