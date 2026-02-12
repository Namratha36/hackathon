import React from 'react';
import {
    TrendingUp,
    Users,
    Clock,
    AlertTriangle,
    ArrowUpRight,
    Zap
} from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, unit, trend, icon: Icon, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft"
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`p-2.5 rounded-xl ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 font-medium text-sm">
                <ArrowUpRight className="w-4 h-4" />
                {trend}%
            </div>
        </div>
        <div className="space-y-1">
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <div className="flex items-baseline gap-1">
                <h3 className="text-2xl font-bold font-sans">{value}</h3>
                {unit && <span className="text-slate-400 text-sm">{unit}</span>}
            </div>
        </div>
    </motion.div>
);

export const CommandCenter = () => {
    const { patients, getGlobalMetrics, calculatePatientRisk } = useWorkflow();
    const metrics = getGlobalMetrics();
    const activePatients = patients.length;

    // Sort patients by risk for the "at-risk" list
    const sortedPatients = [...patients].sort((a, b) => calculatePatientRisk(b) - calculatePatientRisk(a));

    const getRiskColor = (score) => {
        if (score > 70) return 'text-red-600';
        if (score > 40) return 'text-amber-600';
        return 'text-emerald-600';
    };

    const getRiskBg = (score) => {
        if (score > 70) return 'bg-red-500';
        if (score > 40) return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Hospital Command Center</h2>
                <p className="text-slate-500">Real-time operational intelligence & predictive monitoring.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Active Patients"
                    value={activePatients}
                    trend={12}
                    icon={Users}
                    color="bg-hospital-500"
                />
                <StatCard
                    title="Avg. Delay Risk"
                    value={`${metrics.avgRisk}`}
                    unit="/ 100"
                    trend={-2}
                    icon={TrendingUp}
                    color={getRiskBg(metrics.avgRisk)}
                />
                <StatCard
                    title="Queue Depth"
                    value={metrics.totalPending}
                    trend={8}
                    icon={Zap}
                    color="bg-indigo-500"
                />
                <StatCard
                    title="Critical Actions"
                    value={metrics.totalHighSeverity}
                    trend={0}
                    icon={AlertTriangle}
                    color="bg-red-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Department Load & Global Risk Gauge */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 shadow-soft">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-bold text-lg">Operational Health Radar</h3>
                            <p className="text-xs text-slate-400 font-medium uppercase mt-0.5">Composite Analysis</p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="text-right">
                                <span className={`text-2xl font-black ${getRiskColor(metrics.avgRisk)}`}>{metrics.avgRisk}%</span>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Risk Index</p>
                            </div>
                            <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-hospital-500 animate-spin flex items-center justify-center">
                                <span className="sr-only">Scanning...</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            {[
                                { label: 'Emergency (ER)', load: 85, color: 'bg-red-500' },
                                { label: 'Laboratory', load: 78, color: 'bg-amber-500' },
                                { label: 'Pharmacy', load: 45, color: 'bg-emerald-500' },
                                { label: 'Radiology', load: 30, color: 'bg-hospital-500' },
                            ].map(dept => (
                                <div key={dept.label} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                                        <span className="text-slate-600">{dept.label}</span>
                                        <span className="text-slate-400">{dept.load}% Load</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${dept.load}%` }}
                                            transition={{ duration: 1, ease: 'easeOut' }}
                                            className={`h-full ${dept.color}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Risk Factor Breakdown</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Pending Requests</span>
                                    <span className="font-bold text-slate-800">{metrics.totalPending}</span>
                                </div>
                                <div className="flex justify-between items-center text-red-600 font-medium">
                                    <span className="text-sm">High-Severity Tasks</span>
                                    <span className="font-bold">{metrics.totalHighSeverity}</span>
                                </div>
                                <div className="flex justify-between items-center text-amber-600 font-medium">
                                    <span className="text-sm">Delayed Progressions</span>
                                    <span className="font-bold">4</span>
                                </div>
                                <div className="pt-4 border-t border-slate-200 mt-4">
                                    <p className="text-[10px] text-slate-500 leading-relaxed italic">
                                        * Algorithm weighs high-severity tasks at 2.5x vs standard workflow entries.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Operational Intelligence */}
                <div className="bg-hospital-900 rounded-2xl p-8 text-white shadow-premium relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Zap className="w-48 h-48" />
                    </div>

                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                        <Zap className="w-5 h-5 text-hospital-400" />
                        AI Logic Insights
                    </h3>

                    <div className="space-y-5 flex-1 relative z-10">
                        <div className="space-y-3">
                            <div className="p-4 bg-hospital-800/40 rounded-xl border border-hospital-700/50">
                                <span className="text-[10px] text-hospital-400 font-bold uppercase tracking-wider mb-2 block">Detection: Bottleneck</span>
                                <p className="text-sm font-medium text-hospital-100 leading-relaxed">
                                    Laboratory backlog identified. Predicted 12m delay in processing Patient Sarah Johnson's Blood Panel.
                                </p>
                            </div>

                            <div className="p-4 bg-hospital-800/40 rounded-xl border border-hospital-700/50">
                                <span className="text-[10px] text-hospital-400 font-bold uppercase tracking-wider mb-2 block">Detection: Anomaly</span>
                                <p className="text-sm font-medium text-hospital-100 leading-relaxed">
                                    Critical Pharmacy order for P001 has been pending &gt;15m. Risk score elevated.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h4 className="text-xs font-bold text-hospital-500 uppercase tracking-widest mb-3">Simulation Controls</h4>
                            <div className="grid grid-cols-1 gap-3">
                                <button
                                    onClick={() => triggerDemoScenario('EMERGENCY')}
                                    className="w-full py-3 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-100 transition-all rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                                >
                                    <AlertTriangle className="w-4 h-4 text-red-400" />
                                    Trigger Emergency Case
                                </button>
                                <button
                                    className="w-full py-3 bg-hospital-800/60 hover:bg-hospital-800 border border-hospital-700 text-hospital-200 transition-all rounded-xl font-bold text-xs"
                                >
                                    Simulate Department Load
                                </button>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h4 className="text-xs font-bold text-hospital-500 uppercase tracking-widest mb-3">Highest Risk Patients</h4>
                            <div className="space-y-2">
                                {sortedPatients.slice(0, 3).map(p => {
                                    const risk = calculatePatientRisk(p);
                                    return (
                                        <div key={p.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
                                            <span className="text-sm font-medium">{p.name}</span>
                                            <span className={`text-sm font-bold ${risk > 70 ? 'text-red-400' : 'text-amber-400'}`}>{risk}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <button className="w-full mt-6 py-3.5 bg-hospital-500 hover:bg-hospital-400 transition-all rounded-xl font-bold text-sm shadow-lg shadow-hospital-900/50 relative z-10">
                        Generate Optimization Plan
                    </button>
                </div>
            </div>
        </div>
    );
};
