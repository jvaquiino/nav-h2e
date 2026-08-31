'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Send, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { authClient } from '@/lib/auth-client';
import { streamChatResponse, type ChatMessage } from '@/actions/chat';
import { getErrorMessage } from '@/utils/api-error';

export function ChatWidget() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [teaserDismissed, setTeaserDismissed] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }));
  };

  const handleBubbleClick = () => {
    if (!session && !isPending) {
      router.push('/login');
      return;
    }
    setTeaserDismissed(true);
    setOpen((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: question }];
    setMessages([...nextMessages, { role: 'assistant', content: '' }]);
    setInput('');
    setLoading(true);
    scrollToBottom();

    try {
      let accumulated = '';
      await streamChatResponse(nextMessages, (delta) => {
        accumulated += delta;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: accumulated };
          return updated;
        });
        scrollToBottom();
      });
    } catch (error) {
      const message = getErrorMessage(error, 'Erro ao conversar com o assistente');
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: message };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex flex-col h-[60vh] w-[90vw] max-w-sm rounded-lg border border-border/50 bg-card shadow-glow overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-gradient-primary text-primary-foreground">
            <span className="font-display font-semibold text-sm">Assistente H₂ Naval</span>
            <button onClick={() => setOpen(false)} aria-label="Fechar chat">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Pergunte sobre hidrogênio como combustível, propulsão naval ou os documentos de
                pesquisa do projeto.
              </p>
            )}

            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap ${
                    message.role === 'user'
                      ? 'bg-gradient-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {message.content || (loading && index === messages.length - 1 ? '...' : '')}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-border/50 p-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Digite sua pergunta..."
              className="min-h-11 max-h-32 resize-none"
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !input.trim()} size="icon">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </form>
        </div>
      )}

      {!open && !teaserDismissed && (
        <div className="flex items-center gap-2 rounded-full bg-card border border-border/50 shadow-soft px-4 py-2 text-sm animate-fade-up">
          Tire suas dúvidas sobre Hidrogênio!
          <button
            onClick={() => setTeaserDismissed(true)}
            aria-label="Fechar aviso"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <button
        onClick={handleBubbleClick}
        aria-label="Abrir chat sobre hidrogênio"
        className="w-14 h-14 rounded-full bg-gradient-primary text-primary-foreground shadow-glow grid place-items-center hover:opacity-90 transition-smooth"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
