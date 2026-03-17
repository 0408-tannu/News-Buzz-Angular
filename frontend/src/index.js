import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
  BrowserRouter,
} from 'react-router-dom'
import { Toaster } from "react-hot-toast";
import './CSS/index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-center"
        gutter={10}
        toastOptions={{
          duration: 3000,
          style: {
            zIndex: 9999,
            fontFamily: "'Quicksand', sans-serif",
            fontWeight: 600,
            fontSize: '14px',
            padding: '12px 20px',
            borderRadius: '14px',
            maxWidth: '420px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
            background: '#fff',
            color: '#1a1a2e',
          },
          success: {
            style: {
              background: '#fff',
              border: '1px solid rgba(34,197,94,0.2)',
            },
            iconTheme: {
              primary: '#22C55E',
              secondary: '#fff',
            },
          },
          error: {
            style: {
              background: '#fff',
              border: '1px solid rgba(239,68,68,0.2)',
            },
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
          loading: {
            style: {
              background: '#fff',
              border: '1px solid rgba(30,144,255,0.2)',
            },
            iconTheme: {
              primary: '#1E90FF',
              secondary: '#fff',
            },
          },
        }}
      />
    </QueryClientProvider>
  </BrowserRouter>
  //</React.StrictMode>
);