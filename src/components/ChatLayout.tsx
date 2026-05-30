"use client";
import { FC, useCallback, useState } from "react";
import Image from "next/image";
import { toPusherKey } from "@/lib/utils";
import { usePusherEvent } from "@/lib/hooks/usePusherEvent";
import { Message } from "@/lib/validations/message";
import Messages from "./Messages";
import ChatInput from "./ChatInput";

interface ChatLayoutProps {
  initialMessages: Message[];
  sessionId: string;
  sessionImage?: string | null;
  chatPartner: User;
  chatId: string;
}

const ChatLayout: FC<ChatLayoutProps> = ({
  initialMessages,
  sessionId,
  sessionImage,
  chatPartner,
  chatId,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const addMessage = useCallback((incoming: Message) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === incoming.id)) return prev;
      return [incoming, ...prev];
    });
  }, []);

  const rollbackMessage = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  }, []);

  usePusherEvent<Message>(
    toPusherKey(`chat:${chatId}`),
    "incoming-message",
    addMessage
  );

  return (
    <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative w-8 sm:w-12 h-8 sm:h-12">
              <Image
                fill
                referrerPolicy="no-referrer"
                src={chatPartner.image}
                alt={`${chatPartner.name} profile picture`}
                className="rounded-full"
              />
            </div>
          </div>

          <div className="flex flex-col leading-tight">
            <div className="text-xl flex items-center">
              <span className="text-gray-700 mr-3 font-semibold">
                {chatPartner.name}
              </span>
            </div>
            <span className="text-sm text-gray-600">{chatPartner.email}</span>
          </div>
        </div>
      </div>

      <Messages
        messages={messages}
        sessionId={sessionId}
        sessionImage={sessionImage}
        chatPartner={chatPartner}
      />
      <ChatInput
        chatPartner={chatPartner}
        chatId={chatId}
        sessionId={sessionId}
        onMessageSent={addMessage}
        onMessageRollback={rollbackMessage}
      />
    </div>
  );
};

export default ChatLayout;
