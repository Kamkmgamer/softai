import { NextResponse } from "next/server";
import { buildChatHistory, buildProjectChatSystemPrompt } from "@/lib/chat-context";
import { holdChatCredits, refundChatCredits, settleChatCredits } from "@/lib/credits";
import { apiError, readJson, requireAppUser } from "@/lib/api";
import { getChatUnavailableMessage, streamChatCompletion } from "@/lib/openrouter";
import { chatMessageSchema } from "@/lib/validators";
import { createChatMessage, deleteChatMessage, getChatConversation, getProjectBundle, listChatMessages } from "@/lib/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  try {
    const user = await requireAppUser();
    const { conversationId } = await params;
    const conversation = await getChatConversation(user.id, conversationId);

    if (!conversation) {
      return apiError(new Error("Conversation not found."), 404);
    }

    const messages = await listChatMessages(user.id, conversationId);
    return NextResponse.json({ messages });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  try {
    const user = await requireAppUser();
    const { conversationId } = await params;
    const input = await readJson(request, chatMessageSchema);
    const conversation = await getChatConversation(user.id, conversationId);

    if (!conversation) {
      return apiError(new Error("Conversation not found."), 404);
    }

    if (!conversation.projectId) {
      return apiError(new Error("Project context is required for assistant chat."), 409);
    }

    const bundle = await getProjectBundle(user.id, conversation.projectId);
    if (!bundle) {
      return apiError(new Error("Project not found."), 404);
    }

    await holdChatCredits(user.id, conversation.projectId);

    let userMessage: Awaited<ReturnType<typeof createChatMessage>>;

    try {
      userMessage = await createChatMessage(user.id, {
        conversationId,
        role: "user",
        content: input.content,
        metadata: null,
      });

      if (!userMessage) {
        throw new Error("Conversation not found.");
      }
    } catch (error) {
      await refundChatCredits(user.id, conversation.projectId);
      throw error;
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        let assistantContent = "";

        try {
          const messages = await listChatMessages(user.id, conversationId);
          const chatMessages = [
            { role: "system" as const, content: buildProjectChatSystemPrompt(bundle) },
            ...buildChatHistory(messages),
          ];

          for await (const chunk of streamChatCompletion(chatMessages, request.signal)) {
            assistantContent += chunk;
            controller.enqueue(encoder.encode(chunk));
          }

          const trimmedContent = assistantContent.trim();
          if (!trimmedContent) {
            throw new Error("Assistant response was empty.");
          }

          await createChatMessage(user.id, {
            conversationId,
            role: "assistant",
            content: trimmedContent,
            metadata: { provider: "openrouter" },
          });
          await settleChatCredits(user.id, conversation.projectId);
          controller.close();
        } catch (error) {
          const trimmedContent = assistantContent.trim();

          if (trimmedContent) {
            try {
              await createChatMessage(user.id, {
                conversationId,
                role: "assistant",
                content: trimmedContent,
                metadata: { provider: "openrouter", interrupted: true },
              });
            } finally {
              await settleChatCredits(user.id, conversation.projectId);
            }
          } else {
            try {
              await deleteChatMessage(user.id, userMessage.id);
            } finally {
              await refundChatCredits(user.id, conversation.projectId);
            }

            controller.enqueue(encoder.encode(getChatUnavailableMessage()));
          }
          console.error("Assistant chat stream failed", error);
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return apiError(error);
  }
}
