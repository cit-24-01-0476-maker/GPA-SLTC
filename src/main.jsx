import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GpaProvider } from './context/GpaContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GpaProvider>
      <App />
    </GpaProvider>
  </StrictMode>,
)
