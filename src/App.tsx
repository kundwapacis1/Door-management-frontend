
import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./Routes/Approutes"
import ScrollToTop from "./component/ScrollTop"
function App() {

  return (
    <div>
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes/>
    </BrowserRouter>
    </div>
     )
}

export default App
