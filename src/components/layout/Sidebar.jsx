import React from 'react';
import {
    BarChart3,
    Users,
    Stethoscope,
    FlaskConical,
    Pill,
    CreditCard,
    Activity,
    ClipboardList,
    LayoutDashboard,
    ShieldAlert
} from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const SidebarItems = [
    { id: 'ADMIN', label: 'Command Center', icon: LayoutDashboard, role: 'Hospital Admin' },
    { id: 'REGISTRATION', label: 'Registration', icon: Users, role: 'Registration' },
    { id: 'DOCTOR', label: 'Doctor Hub', icon: Stethoscope, role: 'Physician / Doctor' },
    { id: 'LAB', label: 'Lab Results', icon: FlaskConical, role: 'Laboratory' },
    { id: 'PHARMACY', label: 'Pharmacy', icon: Pill, role: 'Pharmacy' },
    { id: 'BILLING', label: 'Billing', icon: CreditCard, role: 'Billing & Accounts' },
];

export const Sidebar = () => {
    const { currentRole, setCurrentRole, ROLES } = useRole();

    return (
        <div className="h-screen w-64 bg-slate-900 text-slate-300 flex flex-col fixed left-0 top-0 z-50">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-hospital-500 rounded-xl flex items-center justify-center shadow-lg shadow-hospital-500/20">
                    <ShieldAlert className="text-white w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight">MedFlow <span className="text-hospital-400">AI</span></h1>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                <div className="text-xs font-semibold text-slate-500 px-3 py-2 uppercase tracking-widest">
                    Main Dashboard
                </div>

                {SidebarItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setCurrentRole(item.role)}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                            currentRole === item.role
                                ? "bg-hospital-600 text-white shadow-lg shadow-hospital-600/20"
                                : "hover:bg-slate-800 hover:text-white"
                        )}
                    >
                        <item.icon className={cn("w-5 h-5", currentRole === item.role ? "text-white" : "text-slate-500 group-hover:text-hospital-400")} />
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}

                <div className="pt-8 text-xs font-semibold text-slate-500 px-3 py-2 uppercase tracking-widest">
                    Tools
                </div>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-all text-slate-400">
                    <ClipboardList className="w-5 h-5" />
                    <span className="font-medium">Reports</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-all text-slate-400">
                    <Activity className="w-5 h-5" />
                    <span className="font-medium">Real-time Pulse</span>
                </button>
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 px-2 py-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                        JD
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate text-white">Dr. John Doe</p>
                        <p className="text-xs text-slate-500 truncate">{currentRole}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
