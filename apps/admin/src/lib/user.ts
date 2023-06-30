import { ref } from 'vue';

export interface IUser {
  username: string;
  password: string;
}

export const user = ref(null as null | IUser);
