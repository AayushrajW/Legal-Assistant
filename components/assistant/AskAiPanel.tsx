"use client";

import { Alert } from "@/components/ui/Display";
import type { ChatMessage } from "@/domain/chat";
import { geminiReady } from "@/lib/features";
import { chatService } from "@/services";
import { Send, Sparkles } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

const SUGGESTIONS = [
  "What dates should I watch?",
  "What should I do next?",
  "When should I speak to an advocate?",
];

export function AskAiPanel({ caseId }: { caseId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void chatService.list(caseId).then((result) => {
      if (result.ok) setMessages(result.data);
    });
  }, [caseId]);

  async function send(content: string) {
    const trimmed = content.trim();
    if (!trimmed) return;
    setError(null);
    const result = await chatService.send(caseId, trimmed);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setMessages(result.data);
    setText("");
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(text);
  }

  return (
    <div className="flex h-full min-h-[28rem] flex-col">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Sparkles className="size-4 text-accent" aria-hidden />
        <div>
          <h2 className="text-lg font-bold text-navy">Ask AI</h2>
          <p className="text-xs text-demo">
            {geminiReady() ? "Gemini · not a lawyer" : "Demo replies only · not a lawyer"}
          </p>
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto py-3" aria-live="polite">
        {messages.length === 0 ? (
          <p className="text-sm text-demo">
            Ask about this case. Answers are scripted from the sample analysis and labelled as demo.
          </p>
        ) : null}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${
              m.role === "user"
                ? "ml-auto rounded-tr-md bg-navy text-white"
                : "mr-auto rounded-tl-md bg-bg text-ink"
            }`}
          >
            <p className="whitespace-pre-wrap">{m.content}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 pb-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            className="rounded-full border border-border px-3 py-1 text-xs font-medium text-navy"
            onClick={() => void send(s)}
          >
            {s}
          </button>
        ))}
      </div>
      {error ? (
        <p className="pb-2 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
      <form className="flex items-center gap-2" onSubmit={onSubmit}>
        <label htmlFor="ai-q" className="sr-only">
          Question about this case
        </label>
        <input
          id="ai-q"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-11 flex-1 rounded-2xl border border-border bg-bg px-3 text-sm"
          placeholder="Ask about this case"
        />
        <button
          type="submit"
          aria-label="Send"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-white hover:bg-accent-600"
        >
          <Send className="size-4" aria-hidden />
        </button>
      </form>
      <div className="mt-3">
        <Alert tone="info" title="Not legal advice">
          Do not treat assistant replies as an opinion of an advocate.
        </Alert>
      </div>
    </div>
  );
}
