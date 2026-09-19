import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Network, FileText, User, LogOut, Briefcase } from "lucide-react";

interface AppLayoutProps {
    children: ReactNode;
}

const navItems = [
    { name: "Dashboard", path: "/upload", icon: LayoutDashboard },
    { name: "Network Graph", path: "/graph", icon: Network },
    { name: "Verifications", path: "/reports", icon: FileText },
];

export default function AppLayout({ children }: AppLayoutProps) {
    const location = useLocation();

    return (
        <div className="flex h-screen overflow-hidden" style={{ background: "var(--c-bg-main)" }}>

            {/* ─── Sidebar ────────────────────────────────── */}
            <aside
                className="flex flex-col flex-shrink-0"
                style={{
                    width: 240,
                    background: "var(--c-bg-sidebar)",
                    borderRight: "1px solid var(--c-border)",
                }}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
                    <Briefcase size={22} style={{ color: "var(--c-green-primary)" }} />
                    <span className="font-serif text-xl font-medium tracking-tight" style={{ color: "var(--c-text-primary)" }}>
                        Callidus
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-1.5 p-4 flex-1">
                    {navItems.map(({ name, path, icon: Icon }) => {
                        const isActive = location.pathname.startsWith(path);
                        return (
                            <Link
                                key={path}
                                to={path}
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200"
                                style={{
                                    background: isActive ? "var(--c-green-light)" : "transparent",
                                    color: isActive ? "var(--c-green-primary)" : "var(--c-text-secondary)",
                                    fontWeight: isActive ? 600 : 500,
                                }}
                            >
                                <Icon size={18} />
                                <span className="text-sm">{name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section (Profile/Sign out mimicking the image) */}
                <div className="p-4 border-t border-gray-100 flex flex-col gap-2">
                    <div 
                        className="p-4 rounded-xl flex flex-col gap-3" 
                        style={{ background: "#F4F3ED", border: "1px solid var(--c-border)" }}
                    >
                        <div className="flex items-center gap-2">
                            <User size={16} style={{ color: "var(--c-green-primary)" }} />
                            <span className="text-sm font-semibold text-gray-800">Analyst Profile</span>
                        </div>
                        <div className="text-xs text-gray-500">ID: CAL-8924</div>
                        <button 
                            className="w-full py-2 rounded-lg text-xs font-semibold mt-1"
                            style={{ background: "#EAE7DF", color: "var(--c-text-primary)" }}
                        >
                            View Details
                        </button>
                    </div>

                    <button 
                        className="flex items-center gap-3 px-4 py-3 mt-2 text-sm font-medium transition-colors hover:bg-gray-50 rounded-xl"
                        style={{ color: "var(--c-text-secondary)" }}
                    >
                        <LogOut size={18} />
                        Sign out
                    </button>
                </div>
            </aside>

            {/* ─── Main area ──────────────────────────────── */}
            <main className="flex-1 overflow-auto relative">
                {children}
            </main>
        </div>
    );
}
