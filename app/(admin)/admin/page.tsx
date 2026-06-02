import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAppSession } from "@/lib/auth";
import { getRecentAdminData, takedownOutput, banUser } from "@/lib/store";
import { localizePath } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/server-locale";
import { getDictionary } from "@/lib/dictionaries";
import { PageHeader, SectionHeader, StatusBadge } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const locale = await getRequestLocale();
  const session = await getAppSession();
  if (!session?.isAdmin) {
    redirect(localizePath("/dashboard", locale));
  }

  const dictionary = getDictionary(locale);
  const admin = dictionary.admin;
  const { users, reports, auditEvents, outputs } = await getRecentAdminData();

  async function handleTakedown(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await takedownOutput(id);
    revalidatePath("/admin");
  }

  async function handleBan(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await banUser(id);
    revalidatePath("/admin");
  }

  return (
    <div className="space-y-10">
      <PageHeader title={admin.consoleTitle} backButton />

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-4">
          <SectionHeader title={admin.reportedAbuse} count={reports.length} />
          <div className="overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="w-full text-left text-[13px]">
              <thead className="border-b border-border bg-surface-raised text-xs font-medium text-text-secondary">
                <tr>
                  <th className="px-4 py-3">{admin.project}</th>
                  <th className="px-4 py-3">{admin.reason}</th>
                  <th className="px-4 py-3 text-right">{admin.date}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-surface-raised transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-text">
                      {report.projectId}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {report.reason}
                    </td>
                    <td className="px-4 py-3 text-right text-text-tertiary">
                      {formatDate(report.createdAt)}
                    </td>
                  </tr>
                ))}
                {reports.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-8 text-center text-text-tertiary"
                    >
                      {admin.noReports}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader title={admin.recentOutputs} count={outputs.length} />
          <div className="overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="w-full text-left text-[13px]">
              <thead className="border-b border-border bg-surface-raised text-xs font-medium text-text-secondary">
                <tr>
                  <th className="px-4 py-3">{admin.type}</th>
                  <th className="px-4 py-3">{admin.url}</th>
                  <th className="px-4 py-3 text-right">{admin.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {outputs.map((output) => (
                  <tr
                    key={output.id}
                    className="hover:bg-surface-raised transition-colors"
                  >
                    <td className="px-4 py-3 capitalize text-text-secondary">
                      {output.type.replace("_", " ")}
                    </td>
                    <td className="px-4 py-3 font-medium text-text">
                      <a
                        href={output.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        {output.url.split("/").pop()}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {output.removedAt !== null ? (
                        <StatusBadge status="takedown" />
                      ) : (
                        <form action={handleTakedown}>
                          <input type="hidden" name="id" value={output.id} />
                          <button
                            type="submit"
                            className="text-xs font-medium text-danger hover:underline"
                          >
                            {admin.takedown}
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader title={admin.users} count={users.length} />
          <div className="overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="w-full text-left text-[13px]">
              <thead className="border-b border-border bg-surface-raised text-xs font-medium text-text-secondary">
                <tr>
                  <th className="px-4 py-3">{admin.name}</th>
                  <th className="px-4 py-3">{admin.email}</th>
                  <th className="px-4 py-3 text-right">{admin.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-surface-raised transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-text">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {user.bannedAt !== null ? (
                        <StatusBadge status="banned" />
                      ) : (
                        <form action={handleBan}>
                          <input type="hidden" name="id" value={user.id} />
                          <button
                            type="submit"
                            className="text-xs font-medium text-danger hover:underline"
                          >
                            {admin.banUser}
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader title={admin.auditLog} count={auditEvents.length} />
          <div className="overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="w-full text-left text-[13px]">
              <thead className="border-b border-border bg-surface-raised text-xs font-medium text-text-secondary">
                <tr>
                  <th className="px-4 py-3">{admin.action}</th>
                  <th className="px-4 py-3 text-right">{admin.date}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {auditEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="hover:bg-surface-raised transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-text">
                      {event.event}
                    </td>
                    <td className="px-4 py-3 text-right text-text-tertiary">
                      {formatDate(event.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
