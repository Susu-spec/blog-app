import { RouterProvider } from "react-router"
import { routes } from "./routes"
import { Toaster } from "./components/ui/toaster"
import { AnimatePresence } from "framer-motion"

function App() {

  return (
    <AnimatePresence>
      <RouterProvider router={routes} />
      <Toaster />
    </AnimatePresence>
  )
}

export default App
