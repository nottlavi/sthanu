import { User } from "@/types/auth.types";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/auth.api";

export function useCurrentUser() {
  return useQuery<User | null>({
    queryKey: ["currUser"],
    queryFn: getCurrentUser,
  });
}
