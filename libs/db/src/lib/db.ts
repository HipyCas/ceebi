import { useSupabase } from '@code/supabase';

export const notifications = {
  getAll() {
    useSupabase().from('notifications').select('*');
  },
};
