import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import {HelmetProvider} from 'react-helmet-async'
import { initAnalytics } from "./services/analytics.js";

initAnalytics();
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <HelmetProvider>
      <App/>
      </HelmetProvider>
      </AuthProvider>
  </StrictMode>,
)
