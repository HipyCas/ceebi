import { ref } from 'vue';

const wpToken = ref(null as string | null);

export const getWPToken = () => wpToken.value;

export const setWPToken = (tok: string) => (wpToken.value = tok);

export const clearWPToken = () => (wpToken.value = null);

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
