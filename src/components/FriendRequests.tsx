"use client";
import apiClient from "@/lib/apiClient";
import { toPusherKey } from "@/lib/utils";
import { usePusherEvent } from "@/lib/hooks/usePusherEvent";
import { useMutation } from "@tanstack/react-query";
import { Check, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import toast from "react-hot-toast";

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[];
  sessionId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingFriendRequests,
  sessionId,
}) => {
  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  );
  const router = useRouter();

  usePusherEvent<IncomingFriendRequest>(
    toPusherKey(`user:${sessionId}:incoming_friend_requests`),
    "incoming_friend_requests",
    ({ senderId, senderEmail }) => {
      setFriendRequests((prev) => [...prev, { senderId, senderEmail }]);
    }
  );

  const { mutate: acceptFriend } = useMutation({
    mutationFn: (senderId: string) =>
      apiClient.post("/api/friends/accept", { id: senderId }),
    onSuccess: (_, senderId) => {
      setFriendRequests((prev) =>
        prev.filter((r) => r.senderId !== senderId)
      );
      router.refresh();
    },
    onError: () => toast.error("Failed to accept friend request."),
  });

  const { mutate: denyFriend } = useMutation({
    mutationFn: (senderId: string) =>
      apiClient.post("/api/friends/deny", { id: senderId }),
    onSuccess: (_, senderId) => {
      setFriendRequests((prev) =>
        prev.filter((r) => r.senderId !== senderId)
      );
      router.refresh();
    },
    onError: () => toast.error("Failed to deny friend request."),
  });

  return (
    <>
      {friendRequests.length === 0 ? (
        <p className="text-sm text-zinc-500">Nothing to show here...</p>
      ) : (
        friendRequests.map((request) => (
          <div key={request.senderId} className="flex gap-4 items-center">
            <UserPlus className="text-black" />
            <p className="font-medium text-lg">{request.senderEmail}</p>
            <button
              aria-label="Accept friend"
              onClick={() => acceptFriend(request.senderId)}
              className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center transition hover:bg-indigo-700 hover:shadow-md"
            >
              <Check className="font-semibold text-white w-3/4 h-3/4 cursor-pointer" />
            </button>
            <button
              aria-label="Deny friend"
              onClick={() => denyFriend(request.senderId)}
              className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center transition hover:bg-red-700 hover:shadow-md"
            >
              <X className="font-semibold text-white w-3/4 h-3/4 cursor-pointer" />
            </button>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;
