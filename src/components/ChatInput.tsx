"use client";
import { FC, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Button from "./ui/Button";
import axios from "axios";
import toast from "react-hot-toast";
import { nanoid } from "nanoid";
import { Message } from "@/lib/validations/message";

interface ChatInputProps {
  chatPartner: User;
  chatId: string;
  sessionId: string;
  onMessageSent: (msg: Message) => void;
  onMessageRollback: (messageId: string) => void;
}

const ChatInput: FC<ChatInputProps> = ({
  chatPartner,
  chatId,
  sessionId,
  onMessageSent,
  onMessageRollback,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!input || isLoading) return;
    setIsLoading(true);

    const messageId = nanoid();
    const optimisticMsg: Message = {
      id: messageId,
      senderId: sessionId,
      text: input,
      timestamp: Date.now(),
    };

    onMessageSent(optimisticMsg);
    setInput("");
    textareaRef.current?.focus();

    try {
      await axios.post("/api/message/send", {
        text: optimisticMsg.text,
        chatId,
        messageId,
      });
    } catch {
      onMessageRollback(messageId);
      setInput(optimisticMsg.text);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
      <div className="relative flex overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
        <TextareaAutosize
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${chatPartner.name}`}
          className="block w-full resize-none border-none bg-transparent sm:py-1.5 pl-3 pr-10 text-gray-900 placeholder:text-gray-400 focus:ring-0 outline-none focus:outline-none sm:text-sm sm:leading-6"
        />

        <div
          onClick={() => textareaRef.current?.focus()}
          className="py-2"
          aria-hidden="true"
        >
          <div className="py-px">
            <div className="h-19" />
          </div>
        </div>

        <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
          <div className="flex-shrink-0">
            <Button isLoading={isLoading} onClick={sendMessage} type="submit">
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
