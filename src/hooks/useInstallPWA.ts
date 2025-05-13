
'use client';

import { useState, useEffect, useCallback } from 'react';

// TypeScript interface for the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function useInstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      event.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      // Update UI to notify the user they can add to home screen
      setIsInstallable(true);
      console.log('`beforeinstallprompt` event was fired and caught.');
    };

    // Check if PWA was already installed or running in standalone mode.
    // The `beforeinstallprompt` event will not be fired if the app is already installed.
    if (typeof window !== 'undefined') {
      if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
        console.log('App is already installed or running in standalone mode. Install button will not be shown.');
        setIsInstallable(false);
      } else {
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        console.log('Event listener for `beforeinstallprompt` added.');
      }
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        console.log('Event listener for `beforeinstallprompt` removed.');
      }
    };
  }, []);

  const handleInstallClick = useCallback(async () => {
    if (!deferredPrompt) {
      console.log('PWA install prompt not available (deferredPrompt is null).');
      return;
    }
    try {
      // Show the install prompt
      console.log('Attempting to show PWA install prompt...');
      await deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the PWA install prompt: ${outcome}`);
      // Optionally, send analytics event with outcome of user choice
      // We've used the prompt, and can't use it again, discard it
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('Error during PWA installation prompt:', error);
      // If an error occurs, reset state to potentially allow re-capturing the event.
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  }, [deferredPrompt]);

  return { isInstallable, handleInstallClick, deferredPrompt };
}
