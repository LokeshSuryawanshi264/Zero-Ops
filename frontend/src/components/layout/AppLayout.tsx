import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { UploadCloud, Network, FileText } from "lucide-react";

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const location = useLocation();

    const navItems = [
        { name: "Upload", path: "/upload", icon: UploadCloud },
        { name: "Graph", path: "/graph", icon: Network },
        { name: "Reports", path: "/reports", icon: FileText },
    ];

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
                    <h1 className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-500">Callidus AI</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${isActive
                                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center px-8 shadow-sm z-10">
                    <h2 className="text-lg font-semibold capitalize">
                        {location.pathname.substring(1) || "Dashboard"}
                    </h2>
                </header>
                <div className="flex-1 overflow-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
