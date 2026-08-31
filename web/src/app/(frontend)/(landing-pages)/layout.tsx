import { ChatWidget } from "@/components/chat/ChatWidget";

export default function LandingPagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ChatWidget />
    </>
  );
}
