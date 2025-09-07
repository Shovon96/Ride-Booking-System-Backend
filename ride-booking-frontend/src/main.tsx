import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { Provider as ReduxProvider } from 'react-redux'
import { routers } from './router/router.index.tsx'
import { ThemeProvider } from './providers/Theme.Providers.tsx'
import { store } from './redux/store.ts'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <ThemeProvider>
        <RouterProvider router={routers} />
        <Toaster />
      </ThemeProvider>
    </ReduxProvider>
  </StrictMode>,
)
