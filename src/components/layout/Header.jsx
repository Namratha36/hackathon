import React from 'react';
import { Bell, Search, Settings, UserCircle, Share2 } from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';
import { useRole } from '../../context/RoleContext';

export const Header = () => {
    const { searchQuery, setSearchQuery } = useWorkflow();
    const { currentRole, setCurrentRole, ROLES } = useRole();

    return (
        <header className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-200 fixed top-0 right-0 left-64 z-40 px-8 flex items-center justify-between">
            <div className="flex items-center gap-6 flex-1">
                <div className="relative group max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-hospital-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search patients, ID, or department..."
                        className="w-full bg-slate-100 border-none rounded-xl py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-hospital-500/20 transition-all outline-none text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Patient View Toggle */}
                <button
                    onClick={() => setCurrentRole(currentRole === ROLES.PATIENT ? ROLES.ADMIN : ROLES.PATIENT)}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${currentRole === ROLES.PATIENT
                        ? 'bg-amber-100 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                        }`}
                >
                    <Share2 className="w-4 h-4" />
                    {currentRole === ROLES.PATIENT ? 'Staff Mode' : 'Patient View'}
                </button>

                <div className="w-px h-8 bg-slate-200 mx-2" />

                <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl relative transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
                </button>

                <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
                    <Settings className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 ml-4">
                    <UserCircle className="w-8 h-8 text-slate-300" />
                </div>
            </div>
        </header>
    );
};
