'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    chatbase: {
      (...args: unknown[]): unknown;
      q?: unknown[][];
    };
  }
}

export function ChatbaseWidget() {
  useEffect(() => {
    if (window.chatbase && window.chatbase('getState') === 'initialized') {
      return;
    }

    const chatbaseFn = (...args: unknown[]) => {
      if (!window.chatbase.q) {
        window.chatbase.q = [];
      }
      window.chatbase.q.push(args);
    };

    window.chatbase = chatbaseFn as Window['chatbase'];

    window.chatbase = new Proxy(window.chatbase, {
      get(target, prop) {
        if (prop === 'q') {
          return target.q;
        }
        return (...args: unknown[]) => (target as any)(prop as string, ...args);
      },
    });

    const script = document.createElement('script');
    script.src = 'https://www.chatbase.co/embed.min.js';
    script.id = 'yNvNySL5dk4GONkyHXlUH';
    script.setAttribute('domain', 'www.chatbase.co');
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return null;
}
