import type { Messages } from '../types/messages';

declare global {
  interface IntlMessages extends Messages {}
}

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module 'react-infinite-scroller';


export {};