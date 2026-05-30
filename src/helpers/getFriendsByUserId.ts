import { cache } from "react";
import { fetchRedis } from "./redis";

export const getFriendsByUserId = cache(async (userId: string): Promise<User[]> => {
  const friendIds = (await fetchRedis(
    "smembers",
    `user:${userId}:friends`
  )) as string[];

  const friends = await Promise.all(
    friendIds.map(async (friendId) => {
      const friend = (await fetchRedis("get", `user:${friendId}`)) as string;
      return JSON.parse(friend) as User;
    })
  );

  return friends;
});
