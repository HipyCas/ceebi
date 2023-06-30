import type { Database } from '@code/supabase';
import type { WPUser } from '@code/wp-types';
import { shallowRef } from 'vue';

const user = shallowRef(null as null | User);

export const getUser = () => user;

export const setUser = (usr: User) => (user.value = usr);

export const clearUser = () => (user.value = null);

export type User = {
  wp: WPUser;
  supabase: Database['public']['Tables']['users']['Row'];
};
