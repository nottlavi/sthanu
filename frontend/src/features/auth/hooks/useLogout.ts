import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useLogout() {
  const queryClient = useQueryClient();

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");

      queryClient.clear();

      window.location.href = "/onboarding";
    } catch (err) {
      console.error("Logout failed: ", err);
    }
  };

  return { logout };
}
