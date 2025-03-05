import { Navigate, Outlet } from "react-router"

export const AuthLayout = () => {
  const token = false

  if (token) {
    return <Navigate to="/login" />
  }

  return (
    <>
      어라
      <Outlet />
    </>
  )
}
