import { ref } from 'vue';
import { wpapi } from './wpapi';
import { clearUser, setUser } from './user';
import { Preferences } from '@capacitor/preferences';
import { KEY_WP_TOKEN } from './vars';
import { HTTPError } from 'ky';

export const wpToken = ref(null as string | null);

export const wpLogin = async (username: string, password: string) => {
  const res = await wpapi
    .post('jwt-auth/v1/token', {
      json: {
        username,
        password,
      },
    })
    .json<WPJWTResponse>();

  setWPToken(res.token);

  Preferences.set({
    key: KEY_WP_TOKEN,
    value: res.token,
  });

  await updateUserFromServer();

  return res;
};

export const updateUserFromServer = async () => {
  const usr = await wpapi
    .get(`wp/v2/users/me?context=edit`, {
      headers: authHeaders({}),
    })
    .json<WPUser>();
  setUser(usr);
};

export const validateWPToken = async () => {
  try {
    const response = await wpapi.post('jwt-auth/v1/token/validate', {
      headers: authHeaders({}),
    });
    return {
      valid: true,
      reason: 'server validated',
      response,
    };
  } catch (e) {
    console.info('not valid', (e as HTTPError).response.status);
    if ((e as HTTPError).response.status == 403) {
      return {
        valid: false,
        reason: 'server rejected',
        httpError: e as HTTPError,
      };
    } else {
      return {
        valid: null,
        reason: 'unknown error',
        httpError: e as HTTPError,
      };
    }
  }
};

export const getWPToken = () => wpToken.value;

export const setWPToken = (tok: string) => (wpToken.value = tok);

export const clearWPToken = () => {
  wpToken.value = null;
  Preferences.remove({
    key: KEY_WP_TOKEN,
  });
  clearUser();
};

export const authHeaders = (actual: Record<string, string>) => ({
  Authorization: 'Bearer ' + getWPToken(),
  ...actual,
});

export interface WPJWTResponse {
  token: string;
  user_display_name: string;
  user_email: string;
  user_nickname: string;
}
