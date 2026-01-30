import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'

// eslint-disable-next-line no-console
console.log('Starting frontend main.tsx')

const root = createRoot(document.getElementById('root')!)
root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
)
