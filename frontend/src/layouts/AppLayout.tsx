import { Outlet, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const titleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/team": "Team Management",
};

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const title = useMemo(() => {
    if (location.pathname.startsWith("/projects/")) return "Project Details";
    return titleMap[location.pathname] ?? "TaskFlow";
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[var(--color-tertiary)]">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="lg:ml-64">
        <Navbar title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
