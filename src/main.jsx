import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./app.jsx"
import "./index.css"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const rootElement = document.querySelector('[data-js="root"]')
const root = createRoot(rootElement)
const queryClient = new QueryClient()

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
