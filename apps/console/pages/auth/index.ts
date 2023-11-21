export default defineRedirect(() =>
  useUser().value ? '/admin' : '/auth/login',
);
