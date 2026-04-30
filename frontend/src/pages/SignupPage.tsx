import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuth } from "../hooks/useAuth";

export default function SignupPage() {
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await signup({ name: form.name, email: form.email, password: form.password });
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-tertiary)] p-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:grid-cols-2">
        <div className="hidden bg-slate-50 p-10 md:block">
          <h2 className="mb-3 text-3xl font-semibold text-[var(--color-primary)]">Join TaskFlow</h2>
          <p className="text-[var(--color-secondary)]">Build your team workflow with clean project and task tracking.</p>
        </div>
        <div className="p-8 md:p-10">
          <h1 className="mb-2 text-2xl font-semibold text-[var(--color-primary)]">Create account</h1>
          <p className="mb-6 text-sm text-[var(--color-secondary)]">Get started in less than a minute.</p>
          <form className="space-y-4" onSubmit={onSubmit}>
            <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button className="w-full" disabled={loading} type="submit">
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>
          <p className="mt-6 text-sm text-slate-600">
            Already have an account?{" "}
            <Link className="font-semibold text-[var(--color-primary)] hover:underline" to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
