import { CREDIT_COSTS } from "@/lib/constants";
import { addCreditEvent, addCreditEventIfSufficient, getCreditBalance } from "@/lib/store";

export async function requireCredits(userId: string, amount: number) {
  const balance = await getCreditBalance(userId);

  if (balance < amount) {
    throw new Error(`Insufficient credits. Required ${amount}, available ${balance}.`);
  }
}

export async function burnStoryboardCredits(userId: string, projectId: string | null) {
  await requireCredits(userId, CREDIT_COSTS.storyboard);
  return addCreditEvent(userId, {
    projectId,
    reason: "storyboard_burn",
    amount: -CREDIT_COSTS.storyboard,
    note: "Storyboard generation",
  });
}

export async function holdChatCredits(userId: string, projectId: string | null) {
  return addCreditEventIfSufficient(userId, {
    projectId,
    reason: "chat_hold",
    amount: -CREDIT_COSTS.chatResponse,
    note: "Assistant response hold",
  });
}

export function settleChatCredits(userId: string, projectId: string | null) {
  return addCreditEvent(userId, {
    projectId,
    reason: "chat_burn",
    amount: 0,
    note: "Assistant response hold converted to burn",
  });
}

export function refundChatCredits(userId: string, projectId: string | null) {
  return addCreditEvent(userId, {
    projectId,
    reason: "refund",
    amount: CREDIT_COSTS.chatResponse,
    note: "Assistant response refund",
  });
}

export async function holdImageCredits(userId: string, projectId: string) {
  await requireCredits(userId, CREDIT_COSTS.imageBatch);
  return addCreditEvent(userId, {
    projectId,
    reason: "image_hold",
    amount: -CREDIT_COSTS.imageBatch,
    note: "Image generation hold",
  });
}

export function settleImageCredits(userId: string, projectId: string) {
  return addCreditEvent(userId, {
    projectId,
    reason: "image_burn",
    amount: 0,
    note: "Image generation hold converted to burn",
  });
}

export function refundImageCredits(userId: string, projectId: string) {
  return addCreditEvent(userId, {
    projectId,
    reason: "refund",
    amount: CREDIT_COSTS.imageBatch,
    note: "Image generation refund",
  });
}

export async function holdVideoCredits(userId: string, projectId: string) {
  await requireCredits(userId, CREDIT_COSTS.videoRender);
  return addCreditEvent(userId, {
    projectId,
    reason: "video_hold",
    amount: -CREDIT_COSTS.videoRender,
    note: "Video generation hold",
  });
}

export function settleVideoCredits(userId: string, projectId: string) {
  return addCreditEvent(userId, {
    projectId,
    reason: "video_burn",
    amount: 0,
    note: "Video generation hold converted to burn",
  });
}

export function refundVideoCredits(userId: string, projectId: string) {
  return addCreditEvent(userId, {
    projectId,
    reason: "refund",
    amount: CREDIT_COSTS.videoRender,
    note: "Video generation refund",
  });
}
