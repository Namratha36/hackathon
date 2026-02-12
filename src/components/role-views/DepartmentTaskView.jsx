import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { useRole } from '../../context/RoleContext';
import { ArrowRight, CheckCircle2, FlaskConical, Stethoscope, Pill, CreditCard, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getIcon = (role) => {
    if (role.includes('Doctor')) return Stethoscope;
    if (role.includes('Lab')) return FlaskConical;
    if (role.includes('Pharmacy')) return Pill;
    if (role.includes('Billing')) return CreditCard;
    return ArrowRight;
};

const getDepartmentTheme = (role) => {
    if (role.includes('Doctor')) return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', accent: 'bg-blue-600' };
    if (role.includes('Lab')) return { color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200', accent: 'bg-teal-600' };
    if (role.includes('Pharmacy')) return { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', accent: 'bg-purple-600' };
    if (role.includes('Billing')) return { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', accent: 'bg-orange-600' };
    return { color: 'text-hospital-600', bg: 'bg-hospital-50', border: 'border-hospital-200', accent: 'bg-hospital-600' };
};

export const DepartmentTaskView = () => {
    const { patients, updateTaskStatus, calculatePatientRisk, searchQuery } = useWorkflow();
    const { currentRole } = useRole();
    const Icon = getIcon(currentRole);
    const theme = getDepartmentTheme(currentRole);

    // Filter patients by task status for the current department
    const getTasksByStatus = (status) => patients.filter(p =>
        p.tasks.some(t => currentRole.includes(t.dept) && t.status === status)
    ).map(p => ({
        ...p,
        task: p.tasks.find(t => currentRole.includes(t.dept) && t.status === status)
    }));

    const pendingTasks = getTasksByStatus('Pending');
    const inProgressTasks = getTasksByStatus('In Progress');
    const completedTasks = getTasksByStatus('Completed');

    const renderTaskCard = (p, status) => {
        const risk = calculatePatientRisk(p);
        return (
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={p.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
            >
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${risk > 70 ? 'bg-red-500' : risk > 40 ? 'bg-amber-500' : theme.accent}`} />

                <div className="flex items-start justify-between mb-3 pl-2">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme.bg}`}>
                            <Icon className={`w-5 h-5 ${theme.color}`} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm leading-tight">{p.name}</h4>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.id}</span>
                        </div>
                    </div>
                    {risk > 70 && <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />}
                </div>

                <div className="pl-2 space-y-3">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Action Required</p>
                        <p className="text-xs font-bold text-slate-700 leading-snug">{p.task.action}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${risk > 70 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                            {risk > 70 ? 'High Priority' : 'Routine'}
                        </span>

                        {status === 'Pending' && (
                            <button
                                onClick={() => updateTaskStatus(p.id, p.task.id, 'In Progress')}
                                className={`px-3 py-1.5 ${theme.bg} ${theme.color} rounded-lg text-[10px] font-black hover:brightness-95 transition-all uppercase tracking-wider flex items-center gap-1`}
                            >
                                Start
                                <ArrowRight className="w-3 h-3" />
                            </button>
                        )}

                        {status === 'In Progress' && (
                            <button
                                onClick={() => updateTaskStatus(p.id, p.task.id, 'Completed')}
                                className={`px-3 py-1.5 ${theme.accent} text-white rounded-lg text-[10px] font-black hover:brightness-110 transition-all shadow-md shadow-hospital-200 flex items-center gap-1 uppercase tracking-wider`}
                            >
                                <CheckCircle2 className="w-3 h-3" />
                                Finish
                            </button>
                        )}

                        {status === 'Completed' && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                                <CheckCircle2 className="w-3 h-3" />
                                Done
                            </span>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${theme.accent}`} />
                        {currentRole} Command Center
                    </h2>
                    <p className="text-slate-500 text-sm font-medium ml-5">Live Operational Workflow Board</p>
                </div>
                <div className="flex gap-2">
                    <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Load</span>
                        <span className={`text-lg font-black ${theme.color}`}>{pendingTasks.length + inProgressTasks.length}</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">

                {/* COLUMN 1: PENDING */}
                <div className="bg-slate-50/50 rounded-3xl border border-slate-200 flex flex-col h-full overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-white/50 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-400" />
                            Pending
                        </h3>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">{pendingTasks.length}</span>
                    </div>
                    <div className="p-4 space-y-3 overflow-y-auto flex-1">
                        <AnimatePresence>
                            {pendingTasks.map(p => renderTaskCard(p, 'Pending'))}
                            {pendingTasks.length === 0 && (
                                <div className="text-center py-10 opacity-40">
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Queue Empty</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* COLUMN 2: IN PROGRESS */}
                <div className="bg-slate-50/50 rounded-3xl border border-slate-200 flex flex-col h-full overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-white/50 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            In Progress
                        </h3>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">{inProgressTasks.length}</span>
                    </div>
                    <div className="p-4 space-y-3 overflow-y-auto flex-1">
                        <AnimatePresence>
                            {inProgressTasks.map(p => renderTaskCard(p, 'In Progress'))}
                            {inProgressTasks.length === 0 && (
                                <div className="text-center py-10 opacity-40">
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Idle</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* COLUMN 3: COMPLETED */}
                <div className="bg-slate-50/50 rounded-3xl border border-slate-200 flex flex-col h-full overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-white/50 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            Completed
                        </h3>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">{completedTasks.length}</span>
                    </div>
                    <div className="p-4 space-y-3 overflow-y-auto flex-1">
                        <AnimatePresence>
                            {completedTasks.slice(0, 10).map(p => renderTaskCard(p, 'Completed'))}
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </div>
    );
};
