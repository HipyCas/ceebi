export default defineEventHandler(async (event) => {
  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();
  if (!session) {
    throw createError({
      message: 'Unauthorized',
      statusCode: 401,
    });
  }

  // invalidate current session
  await auth.invalidateSession(session.sessionId);
  // delete session cookie
  authRequest.setSession(null);

  return sendRedirect(event, '/auth/login');
});
