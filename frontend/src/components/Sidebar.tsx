import { NavLink } from "react-router-dom";
import { cn } from "../utils/helpers";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/projects", label: "Projects" },
  { to: "/team", label: "Team" },
];

export default function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  return (
    <>
      {mobileOpen ? <button className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden" onClick={onClose} /> : null}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 border-r border-slate-200 bg-white p-4 transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-8 px-2 text-xl font-bold tracking-tight text-[var(--color-primary)]">TaskFlow</div>
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "block rounded-lg px-3 py-2 text-sm font-medium transition",
                  isActive ? "bg-slate-200 text-slate-900" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
