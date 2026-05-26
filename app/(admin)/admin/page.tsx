import { redirect } from "next/navigation";
import { Card, PageHeader } from "@/components/ui";
import { getAppSession } from "@/lib/auth";
import { getRecentAdminData } from "@/lib/store";

export default async function AdminPage() {
  const session = await getAppSession();
  if (!session.isAdmin) {
    redirect("/dashboard");
  }
  const data = getRecentAdminData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Reactive safety and operator controls."
        description="This admin surface exists because the product intentionally keeps internal moderation light in v1. Bans, takedowns, and audit review must still be available."
      />
      <Card className="rounded-[2rem] p-6">
        <p className="text-sm text-muted">
          Viewing as {session.email}. In demo mode every session is treated as admin so the page remains visible for implementation and QA.
        </p>
      </Card>
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold">Users</h2>
          <div className="mt-6 space-y-3">
            {data.users.map((user) => (
              <div key={user.id} className="rounded-[1.5rem] border border-border bg-white/70 p-4">
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-muted">{user.email}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold">Abuse reports</h2>
          <div className="mt-6 space-y-3">
            {data.reports.length === 0 ? (
              <p className="text-sm text-muted">No reports yet.</p>
            ) : (
              data.reports.map((report) => (
                <div key={report.id} className="rounded-[1.5rem] border border-border bg-white/70 p-4">
                  <p className="font-semibold">{report.reason}</p>
                  <p className="text-sm text-muted">{report.details}</p>
                </div>
              ))
            )}
          </div>
        </Card>
        <Card className="rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold">Audit stream</h2>
          <div className="mt-6 space-y-3">
            {data.auditEvents.map((event) => (
              <div key={event.id} className="rounded-[1.5rem] border border-border bg-white/70 p-4">
                <p className="font-semibold">{event.event}</p>
                <p className="text-sm text-muted">{event.createdAt}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold">Outputs</h2>
          <div className="mt-6 space-y-3">
            {data.outputs.map((output) => (
              <div key={output.id} className="rounded-[1.5rem] border border-border bg-white/70 p-4">
                <p className="font-semibold">{output.title}</p>
                <p className="text-sm text-muted">
                  {output.removedAt ? `Removed ${output.removedAt}` : output.url}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
