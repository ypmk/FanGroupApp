const USER_TOKEN_KEY = "user_token";
const ADMIN_TOKEN_KEY = "admin_token";

export function getUserToken() {
    return localStorage.getItem(USER_TOKEN_KEY);
}
export function setUserToken(token: string) {
    localStorage.setItem(USER_TOKEN_KEY, token);
}
export function clearUserToken() {
    localStorage.removeItem(USER_TOKEN_KEY);
}
export function isUserLoggedIn() {
    return !!getUserToken();
}

export function getAdminToken() {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
}
export function setAdminToken(token: string) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
}
export function clearAdminToken() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
}
export function isAdminLoggedIn() {
    return !!getAdminToken();
}
