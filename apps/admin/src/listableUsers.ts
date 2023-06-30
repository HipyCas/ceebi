const listableUsers: Ref<WPUser[]> = ref([]);

export const getListableUsers = () => listableUsers;

export const setListableUsers = (users: WPUser[]) =>
  (listableUsers.value = users);
