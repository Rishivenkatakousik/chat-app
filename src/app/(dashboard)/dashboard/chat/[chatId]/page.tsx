import ChatLayout from "@/components/ChatLayout";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { messageArrayValidator } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

interface pageProps {
  params: Promise<{
    chatId: string;
  }>;
}

async function getChatMessages(chatId: string) {
  try {
    const result: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    );

    const dbMessages = result.map((message) => JSON.parse(message) as Message);
    const reversedDbMessages = dbMessages.reverse();

    const messages = messageArrayValidator.parse(reversedDbMessages);
    return messages;
  } catch {
    notFound();
  }
}

const page = async ({ params }: pageProps) => {
  const { chatId } = await params;
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;
  const [userId1, userId2] = chatId.split("--");
  if (user.id !== userId1 && user.id !== userId2) notFound();

  const chatPartnerId = user.id == userId1 ? userId2 : userId1;
  const chatPartnerRaw = (await fetchRedis(
    "get",
    `user:${chatPartnerId}`
  )) as string;
  const chatPartner = JSON.parse(chatPartnerRaw) as User;
  const initialMessages = await getChatMessages(chatId);

  return (
    <ChatLayout
      initialMessages={initialMessages}
      sessionId={session.user.id}
      sessionImage={session.user.image}
      chatPartner={chatPartner}
      chatId={chatId}
    />
  );
};

export default page;
