const REMEMBER_KEY = 'auth_remember';

export function getRememberMe(): boolean {
  return localStorage.getItem(REMEMBER_KEY) === 'true';
}

export function setRememberMe(value: boolean): void {
  if (value) {
    localStorage.setItem(REMEMBER_KEY, 'true');
  } else {
    localStorage.removeItem(REMEMBER_KEY);
  }
}

export function getStorage(): Storage {
  return getRememberMe() ? localStorage : sessionStorage;
}
