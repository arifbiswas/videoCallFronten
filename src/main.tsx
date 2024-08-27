import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import { routers } from './routers/routes.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={routers}>
       <App />
    </RouterProvider>
  
  </StrictMode>,
)
