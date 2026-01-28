import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter, HashRouter } from "react-router-dom";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexQueryCacheProvider } from 'convex-helpers/react/cache';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string, { verbose: false, });

const Router = true ? HashRouter : BrowserRouter;

console.log('BASE_URL:', import.meta.env.BASE_URL);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexAuthProvider client={convex}>
      <ConvexQueryCacheProvider>
        <Router>
          <App />
        </Router>
      </ConvexQueryCacheProvider>
    </ConvexAuthProvider>
  </StrictMode>
);
