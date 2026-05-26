import { CREDIT_COSTS } from "@/lib/constants";
import { addCreditEvent, getCreditBalance } from "@/lib/store";

export function requireCredits(userId: string, amount: number) {
  const balance = getCreditBalance(userId);

  if (balance < amount) {
    throw new Error(`Insufficient credits. Required ${amount}, available ${balance}.`);
  }
}

export function burnStoryboardCredits(userId: string, projectId: string) {
  requireCredits(userId, CREDIT_COSTS.storyboard);
  return addCreditEvent(userId, {
    projectId,
    reason: "storyboard_burn",
    amount: -CREDIT_COSTS.storyboard,
    note: "Storyboard generation",
  });
}

export function holdImageCredits(userId: string, projectId: string) {
  requireCredits(userId, CREDIT_COSTS.imageBatch);
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

export function holdVideoCredits(userId: string, projectId: string) {
  requireCredits(userId, CREDIT_COSTS.videoRender);
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
