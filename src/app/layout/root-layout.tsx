import { Outlet } from "react-router"

export const RootLayout = () => {
  return (
    <div className="mx-auto min-h-screen max-w-xl bg-gray-50">
      <Outlet />
    </div>
  )
}
