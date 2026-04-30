import Button from "./Button";
import { useAuth } from "../hooks/useAuth";

interface Props {
  title: string;
  onMenuClick: () => void;
}

export default function Navbar({ title, onMenuClick }: Props) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" className="lg:hidden" onClick={onMenuClick}>
          Menu
        </Button>
        <h1 className="text-base font-semibold text-[var(--color-primary)]">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-slate-600 sm:inline">{user?.name}</span>
        <Button variant="secondary" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
