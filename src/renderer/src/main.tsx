import './assets/main.css'
import { NextUIProvider } from "@nextui-org/react";

import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <NextUIProvider disableRipple>
        <main className='text-foreground bg-background'>
          <RouterProvider router={router} />
        </main>
      </NextUIProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
