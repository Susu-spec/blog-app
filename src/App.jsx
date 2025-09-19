import { RouterProvider } from "react-router"
import { routes } from "./routes"
import { Toaster } from "./components/ui/toaster"
import { AnimatePresence } from "framer-motion"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { supabase } from "./lib/supabase"

function App() {

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <AnimatePresence>
        <RouterProvider router={routes} />
        <Toaster />
      </AnimatePresence>
    </SessionContextProvider>
    
  )
}

export default App
