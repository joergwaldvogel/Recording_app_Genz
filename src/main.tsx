// src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import './theme/variables.css';

import { StatusBar, Style } from '@capacitor/status-bar';

// StatusBar korrekt konfigurieren (Fix: Header nicht unter der Notch)
(async () => {
  try {
    await StatusBar.setOverlaysWebView({ overlay: false }); // WebView NICHT unter Statusleiste
    await StatusBar.setStyle({ style: Style.Light });  // Statusleiste hell
  } catch {
  }
})();

const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);