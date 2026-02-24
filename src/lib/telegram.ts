import WebApp from '@twa-dev/sdk';

export const isTelegramWebApp =
  typeof window !== 'undefined' &&
  typeof WebApp.ready === 'function';

export function initTelegram() {
  if (!isTelegramWebApp) return;
  WebApp.ready();
  WebApp.expand();
}

export function getTelegramUser() {
  if (!isTelegramWebApp) return undefined;
  return WebApp.initDataUnsafe?.user;
}

export function getInitData() {
  if (!isTelegramWebApp) return '';
  return WebApp.initData;
}

export function getStartParam() {
  if (!isTelegramWebApp) return undefined;
  return WebApp.initDataUnsafe?.start_param;
}

export { WebApp };
