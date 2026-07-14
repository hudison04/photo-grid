import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { initCapacitor } from '@/lib/capacitorInit';

// Initialize Capacitor plugins before rendering
initCapacitor().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
  );
});