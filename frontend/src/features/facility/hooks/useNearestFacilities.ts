import { useQuery } from "@tanstack/react-query";
import { fetchFacilites } from "../api/facillity.api";
import { Facility } from "@/types/facility.types";

export function useNearestFacilites(
  latitude?: number | null,
  longitude?: number | null,
  incidentId?: string,
) {
  return useQuery<Facility[]>({
    queryKey: ["facilities", latitude, longitude, incidentId],

    queryFn: () =>
      fetchFacilites({
        latitude: latitude!,
        longitude: longitude!,
        incidentId: incidentId!,
      }),

    enabled: Boolean(latitude && longitude && incidentId),
  });
}
