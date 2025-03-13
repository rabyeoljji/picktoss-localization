import { Navigate } from "react-router"

const LoginPage = () => {
  const token = true

  if (token) {
    return <Navigate to="/" />
  }

  return <div>login</div>
}

export default LoginPage
