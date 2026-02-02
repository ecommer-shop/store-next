'use client';

import { useEffect } from 'react';

export function WompiScrollGuard() {
  useEffect(() => {
    let wasLocked = false;

    const lockScroll = () => {
      if (!wasLocked) {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        wasLocked = true;
      }
    };

    const unlockScroll = () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      wasLocked = false;
    };

    const handleMessage = (event: MessageEvent) => {
      if (!event?.data) return;

      // Apertura
      if (
        typeof event.data === 'object' &&
        event.data?.type === 'WOMPI_WIDGET_OPENED'
      ) {
        lockScroll();
      }

      // Cierre
      if (
        typeof event.data === 'object' &&
        (
          event.data?.type === 'WOMPI_WIDGET_CLOSED' ||
          event.data?.event === 'close'
        )
      ) {
        unlockScroll();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      unlockScroll(); // safety net
    };
  }, []);

  return null;
}
