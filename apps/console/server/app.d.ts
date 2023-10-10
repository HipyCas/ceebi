/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import('./utils/lucia').Auth;
  type DatabaseUserAttributes = {
    email: string;
    email_verified: boolean;
    organizations: import('@prisma/client').Organization[];
    dev: boolean;
  };
  type DatabaseSessionAttributes = {};
}
