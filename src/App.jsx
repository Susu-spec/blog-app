import { RouterProvider } from "react-router"
import { routes } from "./routes"
import { Toaster } from "./components/ui/toaster"
import { AnimatePresence } from "framer-motion"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { supabase } from "./lib/supabase"
import { AuthProvider } from "./providers/AuthProvider"
import { PostsProvider } from "./providers/PostsProvider"
import { HelmetProvider } from "@dr.pogodin/react-helmet"

function App() {

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <AuthProvider>
        <HelmetProvider>
          <PostsProvider>
            <AnimatePresence>
              <RouterProvider router={routes} />
              <Toaster />
            </AnimatePresence>
          </PostsProvider>
        </HelmetProvider>
      </AuthProvider>
    </SessionContextProvider>
    
  )
}

export default App
