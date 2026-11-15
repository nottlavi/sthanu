import { useQuery } from "@tanstack/react-query";
import { ReqModeType } from "@/types/leaderboard.types";
import { getLeaderBoard } from "../api/leaderboard.api";

export function useLeaderBoard(mode: ReqModeType) {
  return useQuery({
    queryKey: ["leaderboard", mode],
    queryFn: () => {
      return getLeaderBoard({ mode });
    },
  });
}
