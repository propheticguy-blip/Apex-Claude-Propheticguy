import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {registerSW} from 'virtual:pwa-register';

// Register PWA service worker for offline caching & standalone installability
registerSW({
  immediate: true,
  onRegistered(r) {
    if (r) {
      console.log('ApexFlipper PWA Service Worker Registered');
    }
  },
  onRegisterError() {
    // Service worker registration optional in sandbox/iframe environment
  },
});

createRoot(document.getElementById('root')!).render(<App />);
