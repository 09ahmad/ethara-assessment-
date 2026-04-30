import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import Modal from "../components/Modal";
import { useAuth } from "../hooks/useAuth";
import { projectService } from "../services/projectService";
import type { Project } from "../utils/types";

export default function ProjectsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProjects = async () => {
    try {
      setError("");
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    }
  };

  useEffect(() => {
    void loadProjects();
  }, []);

  const onCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      setError("");
      await projectService.createProject({ name, description });
      setName("");
      setDescription("");
      setOpen(false);
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (projectId: string) => {
    try {
      setError("");
      await projectService.deleteProject(projectId);
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  const onOpenEdit = (project: Project) => {
    setEditingProjectId(project.id);
    setName(project.name);
    setDescription(project.description ?? "");
    setEditOpen(true);
  };

  const onUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      setError("");
      await projectService.updateProject(editingProjectId, { name, description });
      setName("");
      setDescription("");
      setEditOpen(false);
      setEditingProjectId("");
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-[var(--color-primary)]">Projects</h2>
          <p className="text-sm text-[var(--color-secondary)]">Manage all team initiatives.</p>
        </div>
        {isAdmin ? <Button onClick={() => setOpen(true)}>Create Project</Button> : null}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id}>
            <h3 className="text-lg font-semibold text-[var(--color-primary)]">{project.name}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-[var(--color-secondary)]">{project.description || "No description"}</p>
            <p className="mt-3 text-xs text-slate-500">{project._count?.tasks ?? 0} tasks</p>
            <div className="mt-4 flex gap-2">
              <Link className="flex-1" to={`/projects/${project.id}`}>
                <Button className="w-full" variant="secondary">
                  View
                </Button>
              </Link>
              {isAdmin ? (
                <>
                  <Button variant="ghost" onClick={() => onOpenEdit(project)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => onDelete(project.id)}>
                    Delete
                  </Button>
                </>
              ) : null}
            </div>
          </Card>
        ))}
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Modal open={open && isAdmin} onClose={() => setOpen(false)} title="Create Project">
        <form className="space-y-4" onSubmit={onCreateProject}>
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Button className="w-full" disabled={loading} type="submit">
            {loading ? "Creating..." : "Create"}
          </Button>
        </form>
      </Modal>

      <Modal open={editOpen && isAdmin} onClose={() => setEditOpen(false)} title="Update Project">
        <form className="space-y-4" onSubmit={onUpdateProject}>
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Button className="w-full" disabled={loading} type="submit">
            {loading ? "Updating..." : "Update"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
