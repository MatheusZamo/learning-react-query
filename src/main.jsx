import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./app.jsx"
import "./index.css"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router"
import { IssueDetails } from "./issue-details.jsx"
import { issueDetailsLoader } from "./issue-details-loader.js"

const rootElement = document.querySelector('[data-js="root"]')
const root = createRoot(rootElement)
const queryClient = new QueryClient()

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route index element={<App />} />
      <Route
        path="issues/:issueNumber"
        element={<IssueDetails />}
        loader={issueDetailsLoader(queryClient)}
      />
    </Route>,
  ),
)

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
