import { StrictMode } from 'react'
import App from './App.jsx'
import { MyProvider } from './Context.jsx'
import { createRoot } from 'react-dom/client'
import './index.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MyProvider>
    <App />
    </MyProvider>
  </StrictMode>,
)
