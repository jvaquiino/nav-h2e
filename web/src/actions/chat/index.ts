export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export const streamChatResponse = async (
  messages: ChatMessage[],
  onDelta: (delta: string) => void
): Promise<void> => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  if (response.status === 401) {
    throw new Error('Sua sessão expirou. Faça login novamente para continuar.');
  }

  if (response.status === 429) {
    throw new Error('Muitas mensagens em pouco tempo. Tente novamente mais tarde.');
  }

  if (!response.ok || !response.body) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || errorData.error || 'Erro ao conversar com o assistente');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onDelta(decoder.decode(value, { stream: true }));
  }
};
