import { User } from 'lucia';

export default defineNuxtRouteMiddleware(async () => {
  console.log('auth middleware');
  const user = useUser();
  const res = await $fetch<{ user: User | null }>('/api/auth/user');
  user.value = res.user ?? null;

  // const { data, error } = await useFetch<{ user: User | null }>(
  //   '/api/auth/user'
  // );
  // if (error.value) throw createError('Failed to fetch data');
  // user.value = data.value?.user ?? null;
});

// Attempt at unctx error reproduction: https://stackblitz.com/edit/github-slnawg?file=middleware%2Frequest.global.ts
