import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { createPortal } from "react-dom";

interface PopupNotificationProps {
  isVisible: boolean;
  onComplete: () => void;
  message?: string;
  type?: 'error' | 'warning' | 'info';
  topOffset?: number;
}

export function PopupNotification({ 
  isVisible, 
  onComplete, 
  message = "Action not allowed",
  type = 'error',
  topOffset = 64 // 默认 64px
}: PopupNotificationProps) {
  const [animationState, setAnimationState] = useState<'hidden' | 'entering' | 'shaking' | 'exiting'>('hidden');

  useEffect(() => {
    if (isVisible) {
      // Start the animation sequence
      setAnimationState('entering');
      
      // After slide in, start shaking
      const shakeTimer = setTimeout(() => {
        setAnimationState('shaking');
      }, 200);

      // After shaking, start exit animation
      const exitTimer = setTimeout(() => {
        setAnimationState('exiting');
      }, 1000); // 1000ms shaking + 200ms entering

      // Complete the animation and hide
      const completeTimer = setTimeout(() => {
        setAnimationState('hidden');
        onComplete();
      }, 1200); // 1000ms + 200ms exiting

      // Cleanup timers on unmount or if isVisible changes
      return () => {
        clearTimeout(shakeTimer);
        clearTimeout(exitTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isVisible, onComplete]);

  if (!isVisible && animationState === 'hidden') {
    return null;
  }

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'error':
        return 'bg-destructive/10 border-destructive/20';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800/30';
      default:
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30';
    }
  };

  return createPortal(
    <div
      className={`
        fixed left-1/2 -translate-x-1/2
        flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg backdrop-blur-sm
        ${getBackgroundColor()}
        transition-all duration-300 ease-out
        ${animationState === 'entering' ? 'animate-popup-slide-in' : ''}
        ${animationState === 'shaking' ? 'animate-popup-shake' : ''}
        ${animationState === 'exiting' ? 'animate-popup-slide-out' : ''}
      `}
      style={{
        top: (animationState === 'entering' || animationState === 'shaking')
          ? `${topOffset}px`
          : '0'
      }}
    >
      {getIcon()}
      <span className="text-sm font-medium text-foreground whitespace-nowrap">
        {message}
      </span>
    </div>, document.body
  );
}