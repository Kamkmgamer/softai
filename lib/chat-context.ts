import type { ChatMessageRecord, ProjectBundle } from "@/lib/types";

const MAX_HISTORY_MESSAGES = 12;

export function buildProjectChatSystemPrompt(bundle: ProjectBundle) {
  const { project, storyboard, scenes, assets, outputs } = bundle;
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
    platformTarget: project.platformTarget,
    language: project.language,
    script: project.script,
    storyboard: storyboard
      ? { headline: storyboard.headline, hook: storyboard.hook, cta: storyboard.cta, status: storyboard.status }
      : null,
    scenes: scenes.slice(0, 6).map((scene) => ({
      order: scene.order,
      title: scene.title,
      narration: scene.narration,
      visualDirection: scene.visualDirection,
      overlayText: scene.overlayText,
    })),
    assets: assets.map((asset) => ({ type: asset.type, name: asset.name })),
    outputs: outputs.map((output) => ({ type: output.type, title: output.title })),
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
