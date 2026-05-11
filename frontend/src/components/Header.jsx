import { Menu, Search, Shield, User, LogOut } from "lucide-react";

export default function Header({ user, onMenuClick, onLogout }) {
    const dateText = new Date().toLocaleDateString(undefined, {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className="flex h-[72px] items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 sm:gap-4">
                    <button
                        onClick={onMenuClick}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                        aria-label="Open menu"
                    >
                        <Menu size={18} />
                    </button>

                    <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-semibold">
                            Operations Dashboard
                        </p>
                        <h1 className="text-lg font-extrabold text-slate-900">Cyber Defense Control</h1>
                    </div>
                </div>

                <div className="hidden md:flex w-full max-w-sm items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 mx-6">
                    <Search size={16} className="text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search events or model..."
                        className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
                    />
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="hidden lg:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                        <Shield size={15} className="text-emerald-600" />
                        <span className="text-xs font-semibold text-slate-700">Protected</span>
                    </div>

                    <div className="hidden sm:block text-right">
                        <p className="text-xs font-semibold text-slate-700 leading-tight">
                            {user?.name || "VAULTO Admin"}
                        </p>
                        <p className="text-[11px] text-slate-500">{dateText}</p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600">
                        <User size={18} />
                    </div>

                    {onLogout && (
                        <button
                            onClick={onLogout}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                            title="Sign out"
                        >
                            <LogOut size={16} />
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
