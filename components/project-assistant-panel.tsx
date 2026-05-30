"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Send } from "lucide-react";
import { CREDIT_COSTS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ChatMessageRecord, ProjectRecord } from "@/lib/types";

type Props = {
  conversationId: string;
  projectLanguage: ProjectRecord["language"];
  initialMessages: ChatMessageRecord[];
};

const englishSuggestions = [
  "Give me 5 ad angles",
  "Rewrite the offer",
  "Improve the hook",
  "Tighten the script",
];

const arabicSuggestions = [
  "اقترح 5 زوايا إعلانية",
  "حسّن العرض",
  "اكتب افتتاحية أقوى",
  "اختصر النص",
];

function createLocalMessage(role: "user" | "assistant", content: string): ChatMessageRecord {
  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `local-${Date.now()}`,
    conversationId: "local",
    userId: "local",
    role,
    content,
    metadata: null,
    createdAt: new Date().toISOString(),
  };
}

export function ProjectAssistantPanel({ conversationId, projectLanguage, initialMessages }: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const suggestions = projectLanguage === "ar" ? arabicSuggestions : englishSuggestions;
  const isArabic = projectLanguage === "ar";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  async function sendMessage(nextContent = input) {
    const content = nextContent.trim();
    if (!content || isPending) return;

    setError(null);
    setInput("");

    const assistantMessage = createLocalMessage("assistant", "");
    setMessages((current) => [
      ...current,
      createLocalMessage("user", content),
      assistantMessage,
    ]);

    startTransition(async () => {
      try {
        const response = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });

        if (!response.ok || !response.body) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error ?? "Assistant response failed.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let streamed = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          streamed += decoder.decode(value, { stream: true });
          setMessages((current) => current.map((message) => (
            message.id === assistantMessage.id ? { ...message, content: streamed } : message
          )));
        }

        router.refresh();
      } catch (caught) {
        const message = caught instanceof Error ? caught.message : "Assistant response failed.";
        setError(message);
        setMessages((current) => current.filter((entry) => entry.id !== assistantMessage.id));
      }
    });
  }

  return (
    <section className="overflow-hidden rounded-[28px] border border-border bg-surface shadow-[var(--shadow-sm)]">
      <div className="border-b border-border bg-surface-raised/70 px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-text-tertiary" />
              <h2 className="text-[0.9375rem] font-semibold text-text">
                {isArabic ? "مساعد الحملة" : "Campaign assistant"}
              </h2>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-text-secondary">
              {isArabic
                ? "اسأل عن الزوايا، العرض، النص، أو تحسين الستوري بورد بناءً على هذا المشروع."
                : "Ask for angles, offer rewrites, script edits, or storyboard improvements using this project context."}
            </p>
          </div>
          <span className="shrink-0 rounded-md border border-border bg-bg px-2 py-1 text-[11px] font-medium text-text-secondary">
            {CREDIT_COSTS.chatResponse} credits
          </span>
        </div>
      </div>

      <div className="max-h-[440px] space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="rounded-[var(--radius-md)] border border-dashed border-border bg-surface-raised px-4 py-8 text-center">
            <p className="text-sm font-medium text-text">{isArabic ? "ابدأ بسؤال عن هذه الحملة" : "Start with a campaign question"}</p>
            <p className="mt-1 text-xs text-text-secondary">{isArabic ? "سأستخدم موجز المشروع الحالي للإجابة." : "I will use the current project brief to answer."}</p>
          </div>
        ) : null}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[88%] break-words whitespace-pre-wrap rounded-[14px] px-3.5 py-2.5 text-[13px] leading-relaxed",
                message.role === "user"
                  ? "bg-text text-bg"
                  : "border border-border bg-bg text-text-secondary",
              )}
            >
              {message.content || (isArabic ? "جار الكتابة..." : "Writing...")}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-border bg-surface px-4 py-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              disabled={isPending}
              onClick={() => sendMessage(suggestion)}
              className="rounded-md border border-border bg-bg px-2.5 py-1 text-[11px] font-medium text-text-secondary transition-colors hover:border-border-strong hover:bg-surface-raised hover:text-text disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage();
          }}
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isPending}
            className="control-field min-w-0 flex-1"
            placeholder={isArabic ? "اكتب سؤالك..." : "Ask about this campaign..."}
          />
          <button type="submit" disabled={isPending || !input.trim()} className="btn btn-primary shrink-0">
            <Send className="h-4 w-4" />
            <span className="sr-only">{isArabic ? "إرسال" : "Send"}</span>
          </button>
        </form>

        {error ? <p className="mt-2 text-xs text-danger">{error}</p> : null}
      </div>
    </section>
  );
}
