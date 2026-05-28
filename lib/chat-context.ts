import type { ChatMessageRecord, ProjectBundle } from "@/lib/types";

const MAX_HISTORY_MESSAGES = 12;

export function buildProjectChatSystemPrompt(bundle: ProjectBundle) {
  const { project, scenes } = bundle;
  const languageInstruction = project.language === "ar"
    ? "Reply in natural Modern Standard Arabic unless the user explicitly asks for another language. Keep the tone practical, warm, and business-focused."
    : "Reply in clear, practical English unless the user explicitly asks for another language.";

  const projectContext = {
    title: project.title,
    productName: project.productName,
    offer: project.offer,
    cta: project.cta,
    targetAudience: project.targetAudience,
    brandVoice: project.brandVoice,
    language: project.language,
    script: project.script,
    scenes: scenes.slice(0, 3).map((scene) => ({
      title: scene.title,
      narration: scene.narration,
      overlayText: scene.overlayText,
    })),
  };

  return [
    "You are SoftAI's project-aware campaign assistant for small business owners.",
    languageInstruction,
    "Help with campaign ideas, ad angles, hook refinement, offer rewrites, CTA improvement, script editing, captions, summaries, and practical campaign planning.",
    "Use the project context below when relevant. If information is missing, say what is missing and suggest the smallest useful next step.",
    "Do not claim that generated content is guaranteed to perform, comply with laws, or be professional legal/financial advice.",
    "Prefer concise, directly usable answers. Use bullets only when they improve readability.",
    `Project context JSON: ${JSON.stringify(projectContext)}`,
  ].join("\n\n");
}

export function buildChatHistory(messages: ChatMessageRecord[]) {
  return messages
    .filter((message) => message.role === "user" || message.role === "assistant")
    .slice(-MAX_HISTORY_MESSAGES)
    .map((message) => ({ role: message.role, content: message.content }));
}
