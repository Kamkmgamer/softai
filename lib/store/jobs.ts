import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import { db, databaseEnabled, ensureDatabase } from "@/lib/db";
import type { GenerationJobRecord, JobStatus, JobType } from "@/lib/types";
import { getState } from "./memory";
import { mapJob, now, revalidateProjectData } from "./helpers";

export async function createGenerationJob(
  userId: string,
  projectId: string,
  input: {
    type: JobType;
    status: JobStatus;
    providerKey?: string | null;
    modelKey?: string | null;
    providerJobId?: string | null;
    costEstimate?: number | null;
    attempts?: number;
    requestPayload: unknown;
    responsePayload?: unknown;
    errorMessage?: string | null;
  },
) {
  if (!databaseEnabled() || !db) {
    const job: GenerationJobRecord = {
      id: randomUUID(), projectId, userId, type: input.type, status: input.status,
      providerKey: input.providerKey ?? null, modelKey: input.modelKey ?? null,
      providerJobId: input.providerJobId ?? null, costEstimate: input.costEstimate ?? null,
      attempts: input.attempts ?? 0, requestPayload: input.requestPayload,
      responsePayload: input.responsePayload ?? null, errorMessage: input.errorMessage ?? null,
      createdAt: now(), updatedAt: now(),
    };
    getState().generationJobs.unshift(job);
    return job;
  }
  await ensureDatabase();
  const id = randomUUID();
  await db.insert(schema.generationJobs).values({
    id,
    projectId,
    userId,
    type: input.type,
    status: input.status,
    providerKey: input.providerKey ?? null,
    modelKey: input.modelKey ?? null,
    providerJobId: input.providerJobId ?? null,
    costEstimate: input.costEstimate ?? null,
    attempts: input.attempts ?? 0,
    requestPayload: input.requestPayload,
    responsePayload: input.responsePayload ?? null,
    errorMessage: input.errorMessage ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  revalidateProjectData(userId, projectId);
  return {
    id, projectId, userId, type: input.type, status: input.status,
    providerKey: input.providerKey ?? null, modelKey: input.modelKey ?? null,
    providerJobId: input.providerJobId ?? null, costEstimate: input.costEstimate ?? null,
    attempts: input.attempts ?? 0, requestPayload: input.requestPayload,
    responsePayload: input.responsePayload ?? null, errorMessage: input.errorMessage ?? null,
    createdAt: now(), updatedAt: now(),
  };
}

export async function updateGenerationJob(
  jobId: string,
  patch: Partial<Pick<GenerationJobRecord, "status" | "responsePayload" | "errorMessage" | "providerJobId" | "providerKey" | "modelKey" | "costEstimate" | "attempts">>,
  opts?: { onlyIfStatus?: JobStatus[] },
) {
  if (!databaseEnabled() || !db) {
    const job = getState().generationJobs.find((entry) => entry.id === jobId);
    if (!job) return null;
    if (opts?.onlyIfStatus && !opts.onlyIfStatus.includes(job.status)) return null;
    Object.assign(job, patch, { updatedAt: now() });
    return job;
  }
  await ensureDatabase();
  const existing = await db.query.generationJobs.findFirst({ where: eq(schema.generationJobs.id, jobId) });
  if (!existing) return null;
  if (opts?.onlyIfStatus && !opts.onlyIfStatus.includes(existing.status as JobStatus)) return null;
  await db.update(schema.generationJobs).set({ ...patch, updatedAt: new Date() }).where(eq(schema.generationJobs.id, jobId));
  revalidateProjectData(existing.userId, existing.projectId);
  return { ...mapJob(existing), ...patch, updatedAt: now() };
}

export async function updateGenerationJobByProviderJobId(
  providerJobId: string,
  patch: Partial<Pick<GenerationJobRecord, "status" | "responsePayload" | "errorMessage">>,
  opts?: { onlyIfStatus?: JobStatus[] },
) {
  if (!databaseEnabled() || !db) {
    const job = getState().generationJobs.find((entry) => entry.providerJobId === providerJobId);
    if (!job) return null;
    if (opts?.onlyIfStatus && !opts.onlyIfStatus.includes(job.status)) return null;
    Object.assign(job, patch, { updatedAt: now() });
    return job;
  }
  await ensureDatabase();
  const existing = await db.query.generationJobs.findFirst({
    where: eq(schema.generationJobs.providerJobId, providerJobId),
  });
  if (!existing) return null;
  if (opts?.onlyIfStatus && !opts.onlyIfStatus.includes(existing.status as JobStatus)) return null;
  await db.update(schema.generationJobs).set({ ...patch, updatedAt: new Date() }).where(eq(schema.generationJobs.id, existing.id));
  revalidateProjectData(existing.userId, existing.projectId);
  return { ...mapJob(existing), ...patch, updatedAt: now() };
}
