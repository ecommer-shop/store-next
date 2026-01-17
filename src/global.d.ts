import type { Messages } from '../types/messages';

declare global {
  interface IntlMessages extends Messages {}
}

export {};