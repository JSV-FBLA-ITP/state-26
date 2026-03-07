'use client';

import { useEffect } from 'react';

export function ChatbaseWidget() {
  useEffect(() => {
    if (window.chatbase && window.chatbase('getState') === 'initialized') {
      return;
    }

    window.chatbase = (...args: unknown[]) => {
      if (!window.chatbase.q) {
        window.chatbase.q = [];
      }
      window.chatbase.q.push(args);
    };

    window.chatbase = new Proxy(window.chatbase, {
      get(target, prop) {
        if (prop === 'q') {
          return target.q;
        }
        return (...args: unknown[]) => target(prop as string, ...args);
      },
    });

    const script = document.createElement('script');
    script.src = 'https://www.chatbase.co/embed.min.js';
    script.id = 'yNvNySL5dk4GONkyHXlUH';
    script.domain = 'www.chatbase.co';
    document.body.appendChild(script);
  }, []);

  return null;
}

declare global {
  interface Window {
    chatbase: unknown;
  }
}
