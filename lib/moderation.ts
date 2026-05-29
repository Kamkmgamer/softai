const blockedPatterns = [
  { category: "illegal_weapons", pattern: /\b(build|make|assemble|print)\b.{0,40}\b(gun|bomb|explosive|weapon)\b/i },
  { category: "credential_abuse", pattern: /\b(steal|phish|bypass|hack)\b.{0,40}\b(password|account|login|credential|session)\b/i },
  { category: "sexual_content", pattern: /\b(explicit sexual|pornographic|non-consensual intimate|revenge porn)\b/i },
  { category: "self_harm", pattern: /\b(suicide instructions|self-harm instructions|how to kill myself)\b/i },
  { category: "hate_or_harassment", pattern: /\b(dehumanize|exterminate|racial slur|ethnic slur)\b/i },
];

export class ModerationError extends Error {
  constructor(public readonly category: string) {
    super(`This request was blocked by SoftAI safety checks (${category}). Please revise the prompt and try again.`);
    this.name = "ModerationError";
  }
}

export function assertPromptAllowed(input: string) {
  for (const rule of blockedPatterns) {
    if (rule.pattern.test(input)) {
      throw new ModerationError(rule.category);
    }
  }
}

export function buildProjectModerationText(input: {
  productName: string;
  offer: string;
  cta: string;
  targetAudience: string;
  brandVoice: string;
  script: string;
}) {
  return [
    input.productName,
    input.offer,
    input.cta,
    input.targetAudience,
    input.brandVoice,
    input.script,
  ].join("\n");
}
