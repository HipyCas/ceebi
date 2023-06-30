import { createClient } from '@supabase/supabase-js';
import type {
  SupabaseClient as SC,
  SupabaseClientOptions,
} from '@supabase/supabase-js';
import type { Database } from '../types';

export * from './composable'

export class SupabaseService {
  private static instance: ReturnType<typeof createClient<Database>>;
  private static options: SupabaseClientOptions<'public'> = {}; // TODO Make this a parameter of getInstance and recreate client if new ones differ from actual

  private static create(supabaseUrl: string, supabaseKey: string) {
    const client = createClient<Database>(supabaseUrl, supabaseKey);
    return client;
  }

  public static getInstance() {
    if (!SupabaseService.instance) {
      // FIXME Move to env or something, maybe use nx to crete the a env project somewhere and import it
      SupabaseService.instance = SupabaseService.create(
        'https://wdnhocgzsoziljwnvvbo.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkbmhvY2d6c296aWxqd252dmJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQyODYzMjEsImV4cCI6MTk3OTg2MjMyMX0.G_bwQSuNMjgTWmex3RoIJysEmZ1w00H7AAXTIyTvPlM'
      );
    }

    return SupabaseService.instance;
  }
}
