import { error } from 'console';
import { SupabaseService } from './supabase';

describe('SupabaseService', () => {
  it('check equal instances', () => {
    const i1 = SupabaseService.getInstance();
    const i2 = SupabaseService.getInstance();
    expect(i1).toEqual(i2);
  });

  it('can access notifications', () => {
    SupabaseService.getInstance()
      .from('notifications')
      .select('*')
      .then(({ error }) => expect(error).toBeNull());
  });

  it('fails when selecting inexistent col', () => {
    SupabaseService.getInstance()
      .from('notifications')
      .select('qwerty')
      .then(({ error }) => expect(error).not.toBeNull());
  });

  it('fails when selecting inexistent table', () => {
    SupabaseService.getInstance()
      .from('qwerty')
      .select('*')
      .then(({ error }) => expect(error).not.toBeNull());
  });
});
