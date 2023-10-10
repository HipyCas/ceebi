export default defineNuxtRouteMiddleware(async (route) => {
  const user = useUser();
  console.log('dev check ', user.value, 'is dev?', user.value?.dev);
  if (!user.value?.dev) return navigateTo('/admin');
});
