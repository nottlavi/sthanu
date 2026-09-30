"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUserIncidents } from "../api/incident.api";

export function useUserIncidents() {
  return useQuery({
    queryKey: ["my-incidents"],
    queryFn: fetchUserIncidents,
  });
}
