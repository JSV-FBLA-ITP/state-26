'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

declare global {
  interface Window {
    chatbase: {
      (...args: unknown[]): unknown;
      q?: unknown[][];
    };
  }
}

export function ChatbaseWidget() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const chatbaseElements = document.querySelectorAll('#chatbase-bubble, #chatbase-message-container, iframe[src*="chatbase.co"]');
    chatbaseElements.forEach(el => el.remove());

    const existingScript = document.getElementById('yNvNySL5dk4GONkyHXlUH');
    if (existingScript) {
      existingScript.remove();
    }
    (window as any).chatbase = undefined;

    if (!isAuthenticated) {
      return;
    }

    const chatbaseFn = (...args: unknown[]) => {
      // Create chatbase if it doesn't exist to avoid undefined error on q
      if (!window.chatbase) {
        window.chatbase = chatbaseFn as Window['chatbase'];
      }
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

    if (!document.getElementById('yNvNySL5dk4GONkyHXlUH')) {
      const script = document.createElement('script');
      script.src = 'https://www.chatbase.co/embed.min.js';
      script.id = 'yNvNySL5dk4GONkyHXlUH';
      script.setAttribute('domain', 'www.chatbase.co');
      script.defer = true;
      document.body.appendChild(script);
    }
  }, [isAuthenticated]);

  return null;
}
