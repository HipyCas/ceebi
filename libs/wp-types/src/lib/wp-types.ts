/**
 * @context edit
 */
export interface WPUser {
  id: number;
  username: string;
  /** Not a reliable field for a common name, most equal the email, better use `first_name` */
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  url: '';
  description: string;
  link: string;
  /** Locale of the form `es_ES` (language_country) */
  locale: string;
  nickname: string;
  slug: string;
  roles: Array<'administrator' | 'subscriber'>; // TODO Put more roles
  registered_date: string;
  capabilities: {
    level_0?: true;
    read?: true;
    upload_files?: true;
    subscriber?: true;
  };
  extra_capabilities: {
    administrator?: true;
    subscriber?: true;
  };
  avatar_urls: {
    '24': string;
    '48': string;
    '96': string;
  };
  meta: {
    persisted_preferences: [];
  };
  acf: {
    id_base_de_datos_app: string;
  };
  yoast_head: string;
  yoast_head_json: {
    title: string;
    robots: {
      index: string; // TODO Place propper options
      follow: string;
    };
    og_locale: string;
    og_type: string; // TODO Update to options
    og_title: string;
    og_url: string;
    og_site_name: 'CEEBI';
    og_image: Array<{
      url: string;
    }>;
    twitter_card: 'summary_large_image';
    schema: Record<any, any>;
  } /** Do not use this field to check for admins, it seems to always return true. To check for admin, check `roles.includes('administrator')` */;
  is_super_admin: boolean;
  woocomerce_meta: Record<string, ''>; // TODO Check if this works well
  _links: {
    self: Array<{
      href: string;
    }>;
    collection: Array<{
      href: string;
    }>;
  };
}
