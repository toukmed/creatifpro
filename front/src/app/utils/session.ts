export const token = window.localStorage.getItem('auth_token');
export const session = !!token;