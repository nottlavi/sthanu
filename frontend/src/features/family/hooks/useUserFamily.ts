import { FamilyGroupResponse } from "@/types/family.types";
import { useQuery } from "@tanstack/react-query";
import { getFamily } from "../api/family.api";

export function useUserFamily() {
  return useQuery<FamilyGroupResponse | null>({
    queryKey: ["userFamily"],
    queryFn: getFamily,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: false,
  });
}
