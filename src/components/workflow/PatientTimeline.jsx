import React, { useState, useEffect, useMemo } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import {
    Clock,
    CheckCircle2,
    AlertTriangle,
    RefreshCw,
    User,
    Activity,
    TrendingUp,
    ShieldAlert,
    Sparkles,
    Search,
    BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PatientTimeline = ({ patientId: initialPatientId }) => {
    const { patients, updateTaskStatus, addLog } = useWorkflow();
    const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId || patients[0]?.id);
    const [aiSummary, setAiSummary] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [viewDetails, setViewDetails] = useState(false);

    const patient = patients.find(p => p.id === selectedPatientId);

    // --- Intelligence Calculations ---
    const metrics = useMemo(() => {
        if (!patient) return null;

        const now = new Date();
        const total = patient.tasks.length;
        const completed = patient.tasks.filter(t => t.status === 'Completed').length;
        const inProgress = patient.tasks.filter(t => t.status === 'In Progress').length;
        const pending = patient.tasks.filter(t => t.status === 'Pending').length;

        const delays = patient.tasks
            .filter(t => t.status !== 'Completed' && t.timestamp)
            .map(t => Math.max(0, Math.round((now - new Date(t.timestamp)) / 60000)));

        const avgDelay = delays.length > 0 ? Math.round(delays.reduce((a, b) => a + b, 0) / delays.length) : 0;
        const criticalTasks = patient.tasks.filter(t => t.severity === 'High' && t.status !== 'Completed').length;

        // Severity counts
        const severityCounts = {
            High: patient.tasks.filter(t => t.severity === 'High').length,
            Moderate: patient.tasks.filter(t => t.severity === 'Moderate').length,
            Low: patient.tasks.filter(t => t.severity === 'Low').length
        };

        // Live Risk Calculation Formula (from Master Prompt)
        // Risk = (0.4 * Pending) + (0.3 * AvgDelay) + (0.2 * Critical * Multiplier) + (0.1 * DeptLoad simulated)
        const pendingWeight = (pending + inProgress) * 5;
        const delayWeight = Math.min(avgDelay * 1.5, 30);
        const criticalWeight = criticalTasks * 15;
        const deptLoadSim = 72 * 0.1; // Simulated static for demo

        const rawScore = pendingWeight + delayWeight + criticalWeight + deptLoadSim;
        const riskScore = Math.min(Math.round(rawScore), 100);

        // Identify Highest Risk Contributor
        const taskRisks = patient.tasks.map(t => {
            if (t.status === 'Completed') return 0;
            let score = 10; // base
            if (t.severity === 'High') score += 30;
            if (t.severity === 'Moderate') score += 15;
            const delay = t.timestamp ? Math.max(0, Math.round((now - new Date(t.timestamp)) / 60000)) : 0;
            score += Math.min(delay * 2, 40);
            return score;
        });

        const maxRiskIdx = taskRisks.indexOf(Math.max(...taskRisks));
        const highestRiskId = taskRisks[maxRiskIdx] > 0 ? patient.tasks[maxRiskIdx].id : null;

        return {
            total, completed, inProgress, pending,
            avgDelay, criticalTasks, severityCounts, riskScore,
            highestRiskId,
            delays
        };
    }, [patient]);

    const getRiskLevel = (score) => {
        if (score > 70) return { label: 'CRITICAL', color: 'bg-red-500', text: 'text-red-600', border: 'border-red-200', ghost: 'bg-red-50' };
        if (score > 40) return { label: 'STABLE / AT RISK', color: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-200', ghost: 'bg-amber-50' };
        return { label: 'STABLE', color: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-200', ghost: 'bg-emerald-50' };
    };

    const handleGenerateAiSummary = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const riskLevelObj = getRiskLevel(metrics.riskScore);
            setAiSummary({
                overview: `Patient ${patient.name} (${patient.id}) is currently in ${patient.status === 'Waiting' ? 'Triage' : 'Active Care'}.`,
                delaySource: metrics.avgDelay > 15 ? `Multiple tasks are exceeding the 15-minute threshold, specifically in the ${patient.tasks.find(t => t.status !== 'Completed')?.dept} department.` : "No critical systemic delays detected at this moment.",
                riskEscalation: `${riskLevelObj.label} (${metrics.riskScore}%). Risk is primarily driven by ${metrics.criticalTasks} pending high-severity actions.`,
                action: `Prioritize ${patient.tasks.find(t => t.status !== 'Completed')?.action || 'next stage of care'}. Coordinate with Lab for immediate results.`
            });
            setIsGenerating(false);
            addLog(`Generated Professional AI Clinical Summary for ${patient.name}`);
        }, 1500);
    };

    if (!patient) return (
        <div className="h-[600px] flex items-center justify-center bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="text-center group cursor-pointer">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-hospital-50 transition-colors">
                    <Search className="w-8 h-8 text-slate-400 group-hover:text-hospital-400" />
                </div>
                <h3 className="font-bold text-slate-800">Select Patient Profile</h3>
                <p className="text-slate-500 text-sm">Select a patient from the sidebar to view operational intel.</p>
            </div>
        </div>
    );

    const currentRiskObj = getRiskLevel(metrics.riskScore);

    return (
        <div className="space-y-6">
            {/* 1️⃣ Patient Intelligence Header */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-soft flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-hospital-100 flex items-center justify-center shadow-inner relative">
                        <User className="w-8 h-8 text-hospital-600" />
                        <div className="absolute -bottom-2 -right-2 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-100">
                            <span className="text-[10px] font-black text-slate-500">{patient.age}yrs</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{patient.name}</h2>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-black rounded border border-slate-200 uppercase tracking-widest">{patient.id}</span>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-black rounded border border-slate-200 uppercase tracking-widest">{patient.gender}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${patient.status === 'Waiting' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                <span className="text-sm font-bold text-slate-500 uppercase tracking-tighter">{patient.status}</span>
                            </div>
                            <div className="w-[1px] h-3 bg-slate-300" />
                            <span className="text-xs font-bold text-slate-600 truncate max-w-[200px]" title={patient.condition}>
                                {patient.condition}
                            </span>
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <span>Admitted: {new Date(patient.admittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span>•</span>
                            <span>Duration: {Math.max(0, Math.round((new Date() - new Date(patient.admittedAt)) / 60000))}m</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Risk Score</span>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-4xl font-black ${metrics.riskScore > 70 ? 'text-red-600' : metrics.riskScore > 40 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                {metrics.riskScore}
                            </span>
                            <span className="text-sm font-bold text-slate-300">/ 100</span>
                        </div>
                    </div>

                    <div className="h-12 w-[1px] bg-slate-200" />

                    <div className="flex items-center gap-4">
                        <div className={`px-4 py-2 rounded-xl border-2 ${currentRiskObj.border} ${currentRiskObj.ghost} flex flex-col items-center`}>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Risk Level</span>
                            <span className={`text-xs font-black ${currentRiskObj.text}`}>{currentRiskObj.label}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-slate-300" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Pending: <span className="text-slate-900">{metrics.pending + metrics.inProgress}</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-400" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Critical: <span className="text-red-600">{metrics.criticalTasks}</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>



            {/* 3️⃣ MAIN CONTENT — TWO COLUMN HYBRID LAYOUT */}
            <div className="grid grid-cols-12 gap-8 items-start">

                {/* 🔷 LEFT COLUMN (65%) — VERTICAL TIMELINE */}
                <div className="col-span-8 space-y-4 relative order-2">
                    {/* Vertical Connecting Line */}
                    <div className="absolute left-[31px] top-8 bottom-8 w-[2px] bg-slate-100 z-0" />

                    {patient.tasks.map((task, idx) => {
                        const isHighestRisk = task.id === metrics.highestRiskId;
                        const delayMins = task.status !== 'Completed' && task.timestamp
                            ? Math.max(0, Math.round((new Date() - new Date(task.timestamp)) / 60000))
                            : 0;
                        const isDelayed = delayMins > 15;

                        return (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative pl-16 z-10"
                            >
                                {/* Node Icon */}
                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center border-4 border-white shadow-sm z-20 ${task.status === 'Completed' ? 'bg-emerald-500' :
                                    task.status === 'In Progress' ? 'bg-blue-500 animate-pulse' :
                                        'bg-amber-100'
                                    }`}>
                                    {task.status === 'Completed' && <CheckCircle2 className="w-4 h-4 text-white" />}
                                    {task.status === 'In Progress' && <RefreshCw className="w-4 h-4 text-white animate-spin" />}
                                    {task.status === 'Pending' && <Clock className="w-4 h-4 text-amber-600" />}
                                </div>

                                {/* Task Card */}
                                <div className={`bg-white p-5 rounded-3xl border-2 transition-all group ${isHighestRisk ? 'border-red-500 shadow-lg shadow-red-500/5' :
                                    isDelayed ? 'border-red-200' :
                                        'border-slate-100 hover:border-slate-200'
                                    }`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{task.dept} Dept</span>
                                            <h4 className="font-black text-slate-800 tracking-tight text-base">{task.action}</h4>
                                        </div>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest border ${task.severity === 'High' ? 'text-red-600 border-red-100 bg-red-50' :
                                            task.severity === 'Moderate' ? 'text-amber-600 border-amber-100 bg-amber-50' :
                                                'text-emerald-600 border-emerald-100 bg-emerald-50'
                                            }`}>
                                            {task.severity}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                                                <span className={`text-xs font-bold ${task.status === 'Completed' ? 'text-emerald-600' :
                                                    task.status === 'In Progress' ? 'text-blue-600' :
                                                        'text-amber-600'
                                                    }`}>{task.status}</span>
                                            </div>
                                            {task.timestamp && (
                                                <div className="flex flex-col border-l border-slate-100 pl-4">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Time in Dept</span>
                                                    <span className="text-xs font-medium text-slate-500">
                                                        {(() => {
                                                            if (idx === 0) {
                                                                // First task: Time since admission
                                                                return Math.max(0, Math.round((new Date(task.timestamp) - new Date(patient.admittedAt)) / 60000)) + 'm';
                                                            }
                                                            // Subsequent tasks: Time since previous task
                                                            const prevTask = patient.tasks[idx - 1];
                                                            if (prevTask && prevTask.timestamp) {
                                                                return Math.max(0, Math.round((new Date(task.timestamp) - new Date(prevTask.timestamp)) / 60000)) + 'm';
                                                            }
                                                            return '--';
                                                        })()}
                                                    </span>
                                                </div>
                                            )}
                                            {task.timestamp && (
                                                <div className="flex flex-col border-l border-slate-100 pl-4">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Completed At</span>
                                                    <span className="text-xs font-medium text-slate-500">{new Date(task.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            )}
                                            {delayMins > 0 && (
                                                <div className="flex flex-col border-l border-slate-100 pl-4">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Delay Duration</span>
                                                    <span className={`text-xs font-black ${isDelayed ? 'text-red-600' : 'text-slate-500'}`}>{delayMins}m {isDelayed && '⚠'}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {isHighestRisk && (
                                                <div className="px-2 py-1 bg-red-600 rounded text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-1">
                                                    <ShieldAlert className="w-3 h-3" />
                                                    Highest Risk Contribution
                                                </div>
                                            )}
                                            <div className="text-[10px] font-bold text-slate-400">
                                                Risk Contrib: <span className="text-slate-600">+{isHighestRisk ? '25' : task.severity === 'High' ? '15' : '5'} pts</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* 🔷 LEFT COLUMN (SIDEBAR) — INTELLIGENCE */}
                <div className="col-span-4 space-y-6 flex flex-col items-stretch sticky top-28 order-1">

                    {/* AI CLINICAL SUMMARY (PRIMARY) */}
                    <div className="bg-gradient-to-br from-indigo-50 to-white rounded-3xl border border-indigo-100 p-6 shadow-soft relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Sparkles className="w-32 h-32" />
                        </div>

                        <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 mb-4 relative z-10">
                            <Sparkles className="w-4 h-4" />
                            AI Clinical Insights
                        </h4>

                        {!aiSummary ? (
                            <button
                                onClick={handleGenerateAiSummary}
                                disabled={isGenerating}
                                className="w-full py-3 bg-white border border-indigo-200 rounded-xl shadow-sm text-indigo-600 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all disabled:opacity-50 relative z-10"
                            >
                                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Analyize Patient Data'}
                            </button>
                        ) : (
                            <div className="space-y-4 relative z-10">
                                <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-100 shadow-sm">
                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Status Overview</span>
                                    <p className="text-xs text-slate-700 font-medium leading-relaxed">{aiSummary.overview}</p>
                                </div>
                                <div className="p-4 bg-red-50/80 backdrop-blur-sm rounded-xl border border-red-100 shadow-sm">
                                    <span className="text-[10px] font-black text-red-400 uppercase tracking-widest block mb-1">Attention Required</span>
                                    <p className="text-xs font-bold text-red-700 leading-relaxed mb-2">{aiSummary.riskEscalation}</p>
                                    <p className="text-xs text-slate-700 italic">“{aiSummary.action}”</p>
                                </div>
                                <button
                                    onClick={() => setAiSummary(null)}
                                    className="text-[10px] text-indigo-400 font-bold hover:text-indigo-600 underline text-center w-full"
                                >
                                    Regenerate Analysis
                                </button>
                            </div>
                        )}
                    </div>

                    {/* CONSOLIDATED METRICS PANEL */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Live Vitals
                            </h4>
                            <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded uppercase">System Active</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Avg Delay</span>
                                <span className="text-xl font-black text-slate-700">{metrics.avgDelay}m</span>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Criticality</span>
                                <span className="text-xl font-black text-slate-700">{metrics.riskScore}/100</span>
                            </div>
                        </div>

                        {/* Collapsible Risk Details */}
                        <div className="border-t border-slate-100 pt-4">
                            <button
                                onClick={() => setViewDetails(!viewDetails)}
                                className="flex items-center justify-between w-full text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-hospital-600 transition-colors"
                            >
                                <span>Risk Factors Breakdown</span>
                                <span>{viewDetails ? '-' : '+'}</span>
                            </button>

                            <AnimatePresence>
                                {viewDetails && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="mt-4 space-y-2 overflow-hidden"
                                    >
                                        <div className="flex justify-between text-xs text-slate-600">
                                            <span>Pending Actions ({metrics.pending})</span>
                                            <span className="font-bold">{(metrics.pending + metrics.inProgress) * 5} pts</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-600">
                                            <span>Progress Delay</span>
                                            <span className="font-bold">{Math.round(Math.min(metrics.avgDelay * 1.5, 30))} pts</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-red-600">
                                            <span>Critical Tasks ({metrics.criticalTasks})</span>
                                            <span className="font-bold">{metrics.criticalTasks * 15} pts</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
