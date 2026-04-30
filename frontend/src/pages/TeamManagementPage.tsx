import { useEffect, useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import { useAuth } from "../hooks/useAuth";
import { userService } from "../services/userService";
import type { Role, User } from "../utils/types";

export default function TeamManagementPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      setError("");
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load team");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, [isAdmin]);

  const onToggleRole = async (member: User) => {
    const role: Role = member.role === "ADMIN" ? "MEMBER" : "ADMIN";
    try {
      setError("");
      await userService.updateRole(member.id, role);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update role");
    }
  };

  const onToggleStatus = async (member: User) => {
    const status = member.status === "INACTIVE" ? "ACTIVE" : "INACTIVE";
    try {
      setError("");
      await userService.updateStatus(member.id, status);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  if (!isAdmin) {
    return (
      <Card>
        <h2 className="text-xl font-semibold text-[var(--color-primary)]">Team Visibility</h2>
        <p className="mt-2 text-sm text-[var(--color-secondary)]">Only admins can manage members and permissions.</p>
      </Card>
    );
  }

  return (
    <Card className="space-y-3 p-0">
      {error ? <p className="px-6 pt-4 text-sm text-red-600">{error}</p> : null}
      {loading ? <p className="px-6 pt-4 text-sm text-slate-500">Loading users...</p> : null}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600">Name</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Email</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Role</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 font-medium text-[var(--color-primary)]">{member.name}</td>
                <td className="px-6 py-4 text-slate-600">{member.email}</td>
                <td className="px-6 py-4">{member.role}</td>
                <td className="px-6 py-4">{member.status ?? "ACTIVE"}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button disabled={member.id === user?.id} variant="secondary" onClick={() => onToggleRole(member)}>
                      Toggle Role
                    </Button>
                    <Button
                      disabled={member.id === user?.id}
                      variant="danger"
                      onClick={() => onToggleStatus(member)}
                    >
                      Toggle Status
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
