
import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./Routes/Approutes"
import ScrollToTop from "./component/ScrollTop"
import { AuthProvider } from "./contexts/AuthContext"

function App() {

  return (
    <div>
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <AppRoutes/>
      </AuthProvider>
    </BrowserRouter>
    </div>
     )
}

export default App
