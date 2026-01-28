import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useThemeStore } from "./store/themeStore";
import './index.css'
import App from './App.jsx'

useThemeStore.getState().theme &&
document.documentElement.setAttribute(
  "data-theme",
  useThemeStore.getState().theme
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
