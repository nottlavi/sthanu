import { apiClient } from "@/lib/api/client";
import { leaderBoardReq } from "@/types/leaderboard.types";

export async function getLeaderBoard(payload: leaderBoardReq) {
  const res = await apiClient.get("/leaderboard/get-leaderboard", {
    params: payload,
  });

  return res.data;
}
