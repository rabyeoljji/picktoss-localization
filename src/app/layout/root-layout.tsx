import { Outlet } from "react-router"

export const RootLayout = () => {
  return (
    <div className="fixed w-full bg-gray-100">
      <div className="mx-auto min-h-screen max-w-xl bg-gray-50">
        <Outlet />
      </div>
    </div>
  )
}
