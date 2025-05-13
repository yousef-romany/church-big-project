
'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInstallPWA } from '@/hooks/useInstallPWA';

export default function InstallPWAButton() {
  const { isInstallable, handleInstallClick, deferredPrompt } = useInstallPWA();

  if (!isInstallable || !deferredPrompt) {
     // console.log('InstallPWAButton: Not rendering, app not installable, already installed, or deferredPrompt not ready.');
    return null;
  }

  console.log('InstallPWAButton: Rendering install button as app is installable.');
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleInstallClick}
      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200 ease-in-out"
      aria-label="تثبيت التطبيق"
    >
      <Download className="me-2 h-4 w-4" />
      تثبيت التطبيق
    </Button>
  );
}
