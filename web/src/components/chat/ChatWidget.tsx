'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Send, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { authClient } from '@/lib/auth-client';
import { streamChatResponse, type ChatMessage } from '@/actions/chat';
import { getErrorMessage } from '@/utils/api-error';
import { cn } from '@/lib/utils';

const OPEN_CHAT_EVENT = 'chat:open';

/** Abre o ChatWidget de qualquer lugar da página, opcionalmente com uma pergunta já digitada. */
export function OpenChatButton({ question, className, children }: { question?: string; className?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT, { detail: question }))}
    >
      {children}
    </button>
  );
}

export function ChatWidget() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [teaserDismissed, setTeaserDismissed] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }));
  };

  const requireLogin = () => {
    if (!session && !isPending) {
      router.push('/login');
      return true;
    }
    return false;
  };

  useEffect(() => {
    const onOpen = (e: Event) => {
      if (requireLogin()) return;
      const question = (e as CustomEvent<string | undefined>).detail;
      if (question) setInput(question);
      setTeaserDismissed(true);
      setOpen(true);
      requestAnimationFrame(() => inputRef.current?.focus());
    };
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  });

  const handleBubbleClick = () => {
    if (requireLogin()) return;
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
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      {open && (
        <div
          role="dialog"
          aria-label="Assistente Hidrogênio Naval"
          className="flex h-[min(70vh,560px)] w-[calc(100vw-2rem)] max-w-sm origin-bottom-right animate-in fade-in zoom-in-95 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-glow duration-200"
        >
          <div className="flex items-center justify-between bg-sea px-4 py-3 text-sea-foreground">
            <div>
              <p className="text-sm font-semibold">Assistente Hidrogênio Naval</p>
              <p className="text-xs text-sea-foreground/70">Responde com base nas pesquisas do projeto</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Fechar chat" className="rounded-sm p-1 hover:bg-white/10">
              <X className="size-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Pergunte sobre hidrogênio como combustível, propulsão naval ou as pesquisas do projeto.
              </p>
            )}

            {messages.map((message, index) => (
              <div key={index} className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'max-w-[85%] whitespace-pre-wrap rounded-lg px-3.5 py-2 text-sm leading-relaxed',
                    message.role === 'user'
                      ? 'rounded-br-sm bg-primary text-primary-foreground'
                      : 'rounded-bl-sm bg-accent/60 text-foreground'
                  )}
                >
                  {message.content || (loading && index === messages.length - 1 ? <Loader2 className="size-4 animate-spin" aria-label="Carregando" /> : '')}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-border p-3">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Digite sua pergunta"
              aria-label="Sua pergunta"
              className="max-h-32 min-h-11 resize-none"
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !input.trim()} size="icon" aria-label="Enviar pergunta">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </Button>
          </form>
        </div>
      )}

      {!open && !teaserDismissed && (
        <div className="hidden animate-fade-up items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm shadow-sm sm:flex">
          Tire suas dúvidas sobre hidrogênio
          <button
            onClick={() => setTeaserDismissed(true)}
            aria-label="Fechar aviso"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      <button
        onClick={handleBubbleClick}
        aria-label={open ? 'Fechar chat' : 'Abrir chat sobre hidrogênio'}
        aria-expanded={open}
        className="grid size-14 place-items-center rounded-full bg-sea text-sea-foreground shadow-glow ring-1 ring-sea-foreground/25 transition-transform hover:scale-105 active:scale-95"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>
    </div>
  );
}
