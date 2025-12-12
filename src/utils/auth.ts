const TokenKey = 'Admin-Token';
const ClientIdKey = 'Client-Id';
const tokenStorage = useStorage<null | string>(TokenKey, null);
const clientIdStorage = useStorage<null | string>(ClientIdKey, null);

export const getToken = () => tokenStorage.value;

export const setToken = (access_token: string) => (tokenStorage.value = access_token);

export const removeToken = () => (tokenStorage.value = null);

export const getClientId = () => clientIdStorage.value;

export const setClientId = (clientId: string) => (clientIdStorage.value = clientId);
export const removeClientId = () => (clientIdStorage.value = null);