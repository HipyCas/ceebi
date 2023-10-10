export default defineNuxtRouteMiddleware(async (route) => {
  const user = useUser();
  console.log('protected check', user);
  if (!user.value) return navigateTo(`/auth/login?next=${route.path}`);
});
