import { Bell, Search, User, Wifi, Settings as SettingsIcon, LayoutGrid } from "lucide-react";

export default function Header({ user }) {
    return (
        <header className="h-16 border-b border-white/5 bg-slate-950/20 backdrop-blur-sm flex items-center justify-between px-8 sticky top-0 z-40">
            <div className="flex items-center gap-6">
                <h2 className="text-slate-400 font-medium text-sm tracking-wider uppercase">
                    AI-Based Multi-Attack IDS
                </h2>
                <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 focus-within:border-blue-500/50 transition-all">
                    <Search size={16} className="text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search threats..."
                        className="bg-transparent border-none text-sm ml-2 w-48 focus:ring-0 text-white placeholder-slate-600"
                    />
                </div>
            </div>

            <div className="flex items-center gap-5">
                <div className="flex items-center gap-3 text-slate-400 border-r border-white/10 pr-5">
                    <button className="hover:text-blue-400 transition-colors">
                        <LayoutGrid size={20} />
                    </button>
                    <button className="hover:text-blue-400 transition-colors relative">
                        <Wifi size={20} />
                        <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-slate-950" />
                    </button>
                    <button className="hover:text-blue-400 transition-colors">
                        <SettingsIcon size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-white leading-none mb-0.5">{user?.name || "Aman Dubey"}</p>
                        <p className="text-[10px] text-blue-400 font-medium uppercase tracking-tighter">Administrator</p>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-blue-500/30 p-0.5 bg-gradient-to-tr from-blue-500 to-purple-500">
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                            <User size={20} className="text-slate-400" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
