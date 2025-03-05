import { Navigate } from "react-router"

export const LoginPage = () => {
  const token = true

  if (token) {
    return <Navigate to="/" />
  }

  return <div>login</div>
}
