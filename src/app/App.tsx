import { Route, Routes, BrowserRouter } from "react-router"
import { AuthLayout } from "./layout/auth-layout"
import { LoginPage } from "@/pages/auth/login-page"
import { PWAOnlyMobileLayout } from "./layout/pwa-only-mobile-layout"
import { Providers } from "./providers"
import { RootLayout } from "./layout/root-layout"
import { HomePage } from "@/pages/home-page"

function App() {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  )
}

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route element={<AuthLayout />}>
            {/* PC에서는 항상 접근 가능하지만 모바일에서는 PWA로만 접근 가능하게 하는 Layout */}
            <Route element={<PWAOnlyMobileLayout />}>
              <Route index element={<HomePage />} />
            </Route>
            <Route path="/collection">
              <Route index element={<div>Collection</div>} />
              <Route path=":id" element={<div>Collection 상세</div>} />
            </Route>
          </Route>

          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
