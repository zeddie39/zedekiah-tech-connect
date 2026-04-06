import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

/**
 * Handles the Android hardware back button so it navigates
 * to the previous page instead of closing the app.
 */
export function useAndroidBackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const handler = App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack && location.pathname !== '/') {
        navigate(-1);
      } else {
        // On home page, minimize the app instead of closing
        App.minimizeApp();
      }
    });

    return () => {
      handler.then(h => h.remove());
    };
  }, [navigate, location.pathname]);
}
