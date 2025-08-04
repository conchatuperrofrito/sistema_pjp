import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const { user, logout, loading, fetchUser } = useAuthStore((state) => state);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const handleLogout = async () => {
    const response = await logout();

    if (response.type === "success_logout") {
      queryClient.clear();

      toast.success(response.message, {
        id: "toast",
        duration: 1500
      });

      navigate("/");
    } else {
      toast.error(response.message, {
        id: "toast",
        duration: 1500
      });
    }
  };

  return { handleLogout, loading, user, fetchUser };
};
