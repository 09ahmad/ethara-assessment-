import { useEffect, useState } from "react";
import Card from "../components/Card";
import { dashboardService } from "../services/dashboardService";
import { formatDate } from "../utils/helpers";
import type { DashboardSummary, Task } from "../utils/types";

const emptySummary: DashboardSummary = {
  totalTasks: 0,
  todo: 0,
  inProgress: 0,
  done: 0,
  overdue: 0,
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>(emptySummary);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [byProject, setByProject] = useState<Array<{ projectId: string; projectName: string; total: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        const [summaryData, recentData, byProjectData] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getRecent(),
          dashboardService.getByProject(),
        ]);
        setSummary(summaryData);
        setRecentTasks(recentData);
        setByProject(byProjectData.map((item) => ({ projectId: item.projectId, projectName: item.projectName, total: item.total })));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Tasks", value: summary.totalTasks },
          { label: "Completed", value: summary.done },
          { label: "Pending", value: summary.todo + summary.inProgress },
          { label: "Overdue", value: summary.overdue },
        ].map((item) => (
          <Card key={item.label}>
            <p className="text-sm text-[var(--color-secondary)]">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold text-[var(--color-primary)]">{loading ? "-" : item.value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-0">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">Recent Tasks</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {recentTasks.map((task) => (
            <div key={task.id} className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-[var(--color-primary)]">{task.title}</p>
                <p className="text-sm text-[var(--color-secondary)]">{task.project?.name ?? "Project task"}</p>
              </div>
              <div className="text-sm text-slate-500">{formatDate(task.dueDate)}</div>
            </div>
          ))}
          {!recentTasks.length && !loading ? <p className="px-6 py-8 text-sm text-slate-500">No recent tasks found.</p> : null}
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-lg font-semibold text-[var(--color-primary)]">Project Breakdown</h3>
        <div className="space-y-3">
          {byProject.map((item) => (
            <div key={item.projectId} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
              <p className="text-sm font-medium text-[var(--color-primary)]">{item.projectName}</p>
              <p className="text-sm text-slate-600">{item.total} tasks</p>
            </div>
          ))}
          {!byProject.length && !loading ? <p className="text-sm text-slate-500">No projects available.</p> : null}
        </div>
      </Card>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
