import { useQuery } from "@tanstack/react-query";
import { fetchUserAddress } from "../api/address.api";
import type { Address } from "@/types/address.types";

export function useUserAddress() {
  return useQuery<Address | null>({
    queryKey: ["userAddress"],
    queryFn: fetchUserAddress,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    retry: 1,
  });
}
