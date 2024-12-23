import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import './style.css'
import { RouterProvider } from 'react-router-dom'
import Router from './Routers/Router.jsx'
import { AuthProvider } from './Provider/AuthProvider.jsx'
import { CssBaseline, ThemeProvider } from '@mui/material'
import theme from './utility/theme.js'
// import AuthProvider from './Provider/AuthProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
    <ThemeProvider theme={theme}>
    <CssBaseline /> {/* Optional: Reset CSS for consistency */}
      <RouterProvider router={Router} />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
)