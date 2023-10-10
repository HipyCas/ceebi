export default defineRedirect(
  () => {
    const route = useRoute();
    return `/admin/${route.params.project}/dashboard`;
  },
  {
    redirectCode: 301,
    replace: true,
  }
);
