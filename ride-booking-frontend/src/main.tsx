import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { routers } from './router/router.index.tsx'
import { ThemeProvider } from './providers/Theme.Providers.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={routers} />
    </ThemeProvider>
  </StrictMode>,
)
