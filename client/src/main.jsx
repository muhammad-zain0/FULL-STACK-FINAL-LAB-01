/**
 * =============================================================================
 * SMART LIBRARY SYSTEM - Main Entry Point
 * =============================================================================
 * 
 * This is the main entry point for the React application.
 * It renders the root App component into the DOM.
 * 
 * Author: Smart Library Team
 * Version: 1.0.0
 * =============================================================================
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Import global styles
import './styles/index.css'

/**
 * Render the React application
 * Uses StrictMode for development warnings and checks
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
