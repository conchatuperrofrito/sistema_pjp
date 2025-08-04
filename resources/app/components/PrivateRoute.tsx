import { Outlet, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import { useAuthStore } from "@/store/authStore";

interface PrivateRouteProps {
  roles?: string[];
  children?: React.ReactNode;
}

const PrivateRoute = ({ children, roles }: PrivateRouteProps) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Login />;
  }

  if (user) {
    if (roles && !roles.includes(user.role.id)) {
      return <Navigate to="/dashboard" />;
    }
  }

  return children || <Outlet />;
};

export default PrivateRoute;
