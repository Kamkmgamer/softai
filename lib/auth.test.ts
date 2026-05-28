import { beforeEach, describe, expect, it, vi } from "vitest";

const clerkMock = vi.hoisted(() => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}));

const envMock = vi.hoisted(() => ({
  getEnv: vi.fn(),
}));

const storeMock = vi.hoisted(() => ({
  findUserByClerkId: vi.fn(),
  upsertUser: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => clerkMock);
vi.mock("@/lib/env", () => envMock);
vi.mock("@/lib/store", () => storeMock);

async function loadAuth() {
  vi.resetModules();
  return import("./auth");
}

describe("getAppSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    envMock.getEnv.mockReturnValue({
      clerkPublishableKey: "pk_test",
      clerkSecretKey: "sk_test",
      adminEmails: [],
    });
  });

  it("treats pending Clerk sessions as unauthenticated", async () => {
    clerkMock.auth.mockResolvedValue({
      userId: "user_clerk",
      isAuthenticated: true,
      sessionStatus: "pending",
      sessionClaims: {},
    });

    const { getAppSession } = await loadAuth();

    await expect(getAppSession()).rejects.toThrow("Authentication required.");
    expect(storeMock.findUserByClerkId).not.toHaveBeenCalled();
  });

  it("creates a local user from Clerk user data for fresh sign-ups", async () => {
    clerkMock.auth.mockResolvedValue({
      userId: "user_clerk",
      isAuthenticated: true,
      sessionStatus: "active",
      sessionClaims: {},
    });
    clerkMock.currentUser.mockResolvedValue({
      primaryEmailAddress: { emailAddress: "new@softai.app" },
      emailAddresses: [],
      fullName: "New User",
      firstName: null,
      lastName: null,
    });
    storeMock.findUserByClerkId.mockResolvedValue(null);
    storeMock.upsertUser.mockResolvedValue({
      id: "app_user",
      clerkUserId: "user_clerk",
      email: "new@softai.app",
      name: "New User",
      bannedAt: null,
      createdAt: new Date().toISOString(),
    });

    const { getAppSession } = await loadAuth();

    await expect(getAppSession()).resolves.toMatchObject({
      userId: "app_user",
      clerkUserId: "user_clerk",
      email: "new@softai.app",
      name: "New User",
      isDemo: false,
    });
    expect(storeMock.upsertUser).toHaveBeenCalledWith({
      clerkUserId: "user_clerk",
      email: "new@softai.app",
      name: "New User",
    });
  });
});
