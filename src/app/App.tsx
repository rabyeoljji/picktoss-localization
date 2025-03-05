import { Route, Routes } from "react-router"
import { BrowserRouter } from "react-router"
import { AuthLayout } from "./layout/auth-layout"
import { LoginPage } from "@/pages/auth/login-page"
import { PWAOnlyMobileLayout } from "./layout/pwa-only-mobile-layout"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          {/* PC에서는 항상 접근 가능하지만 모바일에서는 PWA로만 접근 가능하게 하는 Layout */}
          <Route element={<PWAOnlyMobileLayout />}>
            <Route index element={<div>띠용</div>} />
          </Route>
        </Route>

        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
