'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { MessageCircle } from 'lucide-react';
import { AuthModal } from '@/components/auth/AuthModal';
import { motion } from 'framer-motion';
import { checkAIUsage, incrementAIUsage } from '@/lib/aiLimit';

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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const constraintsRef = useRef(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadChatbase = useCallback(() => {
    // Clean up existing elements if any
    const chatbaseElements = document.querySelectorAll('#chatbase-bubble, #chatbase-message-container, iframe[src*="chatbase.co"]');
    chatbaseElements.forEach(el => el.remove());

    const existingScript = document.getElementById('yNvNySL5dk4GONkyHXlUH');
    if (existingScript) {
      existingScript.remove();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).chatbase = undefined;

    const chatbaseFn = (...args: unknown[]) => {
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  }, []);

  const handleChatClick = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setShowAuthModal(true);
      return;
    }

    const { allowed } = await checkAIUsage('chatbot');
    
    if (!allowed) {
      alert("You have reached your limit of 3 AI assistant uses! This feature is restricted for the competition demo.");
      return;
    }
    
    // Toggle Chatbase
    if (window.chatbase) {
      // Chatbase API: 'open' opens the chat window
      try {
        window.chatbase('open');
        await incrementAIUsage('chatbot');
      } catch (e) {
        console.warn('Chatbase not ready, attempting reload', e);
        loadChatbase();
      }
    } else {
      loadChatbase();
      // Wait a bit for load then open
      setTimeout(async () => {
        try {
          window.chatbase('open');
          await incrementAIUsage('chatbot');
        } catch (e) { console.error(e); }
      }, 1000);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadChatbase();
    } else {
      const chatbaseElements = document.querySelectorAll('#chatbase-bubble, #chatbase-message-container, iframe[src*="chatbase.co"]');
      chatbaseElements.forEach(el => el.remove());
      const existingScript = document.getElementById('yNvNySL5dk4GONkyHXlUH');
      if (existingScript) {
        existingScript.remove();
      }
    }
  }, [isAuthenticated, loadChatbase]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        #chatbase-bubble {
          display: none !important;
        }
      `}} />

      {/* Invisible container to define drag boundaries (viewport) */}
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-[49]" />

      <motion.button
        drag
        dragConstraints={constraintsRef}
        dragMomentum={false}
        dragElastic={0.1}
        onClick={handleChatClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-28 md:bottom-6 right-4 md:right-6 z-50 w-14 h-14 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/50 cursor-grab active:cursor-grabbing"
        aria-label="Open AI Chatbot"
      >
        <MessageCircle className="w-7 h-7 text-primary-foreground" />
      </motion.button>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        featureName="AI Chatbot"
        title="Sign in to chat with your AI assistant"
        description="Connect your PetPal account to chat with your AI-powered financial assistant. We'll help you learn about money management while taking care of your virtual pet!"
      />
    </>
  );
}

