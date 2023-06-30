const _user: Ref<WPUser> = ref(null);

export const setUser = (user: any) => (_user.value = user);

export const getUser = () => _user;

export const clearUser = () => (_user.value = null);
