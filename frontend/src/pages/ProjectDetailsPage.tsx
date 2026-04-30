import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import Modal from "../components/Modal";
import { useAuth } from "../hooks/useAuth";
import { projectService } from "../services/projectService";
import { taskService } from "../services/taskService";
import { userService } from "../services/userService";
import { formatDate } from "../utils/helpers";
import type { Project, Task, TaskPriority, TaskStatus, User } from "../utils/types";

export default function ProjectDetailsPage() {
  const { user } = useAuth();
  const { projectId = "" } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState("");
  const [teamUsers, setTeamUsers] = useState<User[]>([]);
  const [memberToAdd, setMemberToAdd] = useState("");
  const [error, setError] = useState("");
  const canDeleteTask = user?.role === "ADMIN" || project?.ownerId === user?.id;
  const canManageMembers = user?.role === "ADMIN" || project?.ownerId === user?.id;

  const grouped = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = { TODO: [], IN_PROGRESS: [], DONE: [] };
    tasks.forEach((task) => map[task.status].push(task));
    return map;
  }, [tasks]);

  const load = async () => {
    try {
      setError("");
      const [projectData, taskData] = await Promise.all([
        projectService.getProjectById(projectId),
        taskService.getTasks(projectId),
      ]);
      setProject(projectData);
      setTasks(taskData.tasks);
      if (user?.role === "ADMIN") {
        const allUsers = await userService.getUsers();
        setTeamUsers(allUsers);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load project details");
    }
  };

  useEffect(() => {
    if (projectId) void load();
  }, [projectId]);

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      await taskService.createTask(projectId, {
        title,
        description,
        status,
        priority,
        assigneeId: assigneeId || undefined,
        dueDate: dueDate || undefined,
      });
      setTitle("");
      setDescription("");
      setStatus("TODO");
      setPriority("MEDIUM");
      setAssigneeId("");
      setDueDate("");
      setOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    }
  };

  const updateStatus = async (taskId: string, status: TaskStatus) => {
    try {
      setError("");
      await taskService.updateTask(taskId, { status });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
  };

  const openEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description ?? "");
    setStatus(task.status);
    setPriority(task.priority);
    setAssigneeId(task.assigneeId ?? "");
    setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
    setEditOpen(true);
  };

  const updateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      await taskService.updateTask(editingTaskId, {
        title,
        description,
        status,
        priority,
        assigneeId: assigneeId || null,
        dueDate: dueDate || undefined,
      });
      setEditOpen(false);
      setEditingTaskId("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      setError("");
      await taskService.deleteTask(taskId);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  const addMember = async () => {
    if (!memberToAdd) return;
    try {
      setError("");
      await projectService.addMember(projectId, memberToAdd);
      setMemberToAdd("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add member");
    }
  };

  const removeMember = async (userId: string) => {
    try {
      setError("");
      await projectService.removeMember(projectId, userId);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove member");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-[var(--color-primary)]">{project?.name ?? "Project"}</h2>
          <p className="text-sm text-[var(--color-secondary)]">{project?.description ?? "Task board and project members."}</p>
        </div>
        <Button onClick={() => setOpen(true)}>Create Task</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {(["TODO", "IN_PROGRESS", "DONE"] as TaskStatus[]).map((status) => (
          <Card key={status} className="space-y-3">
            <h3 className="font-semibold text-[var(--color-primary)]">
              {status.replace("_", " ")} ({grouped[status].length})
            </h3>
            {grouped[status].map((task) => (
              <div key={task.id} className="rounded-lg border border-slate-200 p-3">
                <p className="font-medium text-[var(--color-primary)]">{task.title}</p>
                <p className="mt-1 text-xs text-slate-500">{formatDate(task.dueDate)}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {task.assignee?.name ? `Assignee: ${task.assignee.name}` : "Unassigned"} | Priority: {task.priority}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(["TODO", "IN_PROGRESS", "DONE"] as TaskStatus[]).map((next) => (
                    <Button
                      key={next}
                      className="px-2 py-1 text-xs"
                      disabled={task.status === next}
                      variant={task.status === next ? "primary" : "secondary"}
                      onClick={() => updateStatus(task.id, next)}
                    >
                      {next === "IN_PROGRESS" ? "In Progress" : next}
                    </Button>
                  ))}
                  {canDeleteTask ? (
                    <Button className="px-2 py-1 text-xs" variant="danger" onClick={() => deleteTask(task.id)}>
                      Delete
                    </Button>
                  ) : null}
                  <Button className="px-2 py-1 text-xs" variant="ghost" onClick={() => openEditTask(task)}>
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </Card>
        ))}
      </div>

      <Card className="space-y-3">
        <h3 className="text-lg font-semibold text-[var(--color-primary)]">Project Members</h3>
        {project?.members.map((member) => (
          <div key={member.userId} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
            <div>
              <p className="text-sm font-medium text-[var(--color-primary)]">{member.user.name}</p>
              <p className="text-xs text-slate-500">{member.user.email}</p>
            </div>
            {canManageMembers && member.userId !== project.ownerId ? (
              <Button variant="danger" onClick={() => removeMember(member.userId)}>
                Remove
              </Button>
            ) : null}
          </div>
        ))}

        {canManageMembers && user?.role === "ADMIN" ? (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <select
              className="min-w-56 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
              onChange={(e) => setMemberToAdd(e.target.value)}
              value={memberToAdd}
            >
              <option value="">Select user</option>
              {teamUsers
                .filter((candidate) => !(project?.members ?? []).some((m) => m.userId === candidate.id))
                .map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.name} ({candidate.email})
                  </option>
                ))}
            </select>
            <Button onClick={addMember}>Add Member</Button>
          </div>
        ) : null}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Create Task">
        <form className="space-y-4" onSubmit={createTask}>
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-600">Status</span>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              value={status}
            >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-600">Priority</span>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              value={priority}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-600">Assign To</span>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
              onChange={(e) => setAssigneeId(e.target.value)}
              value={assigneeId}
            >
              <option value="">Unassigned</option>
              {(project?.members ?? []).map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.user.name}
                </option>
              ))}
            </select>
          </label>
          <Input label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <Button className="w-full" type="submit">
            Create
          </Button>
        </form>
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Update Task">
        <form className="space-y-4" onSubmit={updateTask}>
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-600">Status</span>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              value={status}
            >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-600">Priority</span>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              value={priority}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-600">Assign To</span>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
              onChange={(e) => setAssigneeId(e.target.value)}
              value={assigneeId}
            >
              <option value="">Unassigned</option>
              {(project?.members ?? []).map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.user.name}
                </option>
              ))}
            </select>
          </label>
          <Input label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <Button className="w-full" type="submit">
            Update
          </Button>
        </form>
      </Modal>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
