import React, { useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { UserPlus, Search, Fingerprint, Calendar, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export const RegistrationView = () => {
    const { addPatient } = useWorkflow();
    const [formData, setFormData] = useState({ name: '', age: '', gender: 'Male', condition: '', urgency: 'Normal' });

    const handleSubmit = (e) => {
        e.preventDefault();
        const severity = formData.urgency === 'Emergency' ? 'High' : formData.urgency === 'Urgent' ? 'Moderate' : 'Low';
        const newPatient = {
            id: `P${Math.floor(Math.random() * 900) + 100}`,
            ...formData,
            status: 'Waiting',
            admittedAt: new Date().toISOString(),
            tasks: [
                { id: Math.random().toString(36), dept: 'Registration', action: 'Patient Intake', status: 'Completed', severity: 'Low', timestamp: new Date().toISOString() },
                { id: Math.random().toString(36), dept: 'Doctor', action: 'Consultation Queue', status: 'Pending', severity: severity, timestamp: null },
            ]
        };
        addPatient(newPatient);
        setFormData({ name: '', age: '', gender: 'Male', condition: '', urgency: 'Normal' });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">New Patient Registration</h2>
                    <p className="text-slate-500">Intake process for new hospital admissions.</p>
                </div>
                <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Auto-Indexing Active
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-8 rounded-3xl border border-slate-200 shadow-soft"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Patient Full Name</label>
                            <input
                                required
                                className="w-full bg-slate-50 border-slate-200 rounded-xl py-3 px-4 shadow-inner focus:ring-2 focus:ring-hospital-500/20 outline-none transition-all"
                                placeholder="e.g. Robert Smith"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Age</label>
                                <input
                                    required
                                    type="number"
                                    className="w-full bg-slate-50 border-slate-200 rounded-xl py-3 px-4 shadow-inner focus:ring-2 focus:ring-hospital-500/20 outline-none transition-all"
                                    placeholder="25"
                                    value={formData.age}
                                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Case Urgency</label>
                                <select
                                    className="w-full bg-slate-50 border-slate-200 rounded-xl py-3 px-4 shadow-inner focus:ring-2 focus:ring-hospital-500/20 outline-none transition-all font-bold"
                                    value={formData.urgency}
                                    onChange={e => setFormData({ ...formData, urgency: e.target.value })}
                                >
                                    <option>Normal</option>
                                    <option>Urgent</option>
                                    <option>Emergency</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Clinical Presentation</label>
                            <textarea
                                required
                                rows={3}
                                className="w-full bg-slate-50 border-slate-200 rounded-xl py-3 px-4 shadow-inner focus:ring-2 focus:ring-hospital-500/20 outline-none transition-all resize-none"
                                placeholder="Describe symptoms..."
                                value={formData.condition}
                                onChange={e => setFormData({ ...formData, condition: e.target.value })}
                            />
                        </div>

                        <button type="submit" className="w-full bg-hospital-600 hover:bg-hospital-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-hospital-600/30 flex items-center justify-center gap-2 transform active:scale-95 transition-all text-sm uppercase tracking-widest">
                            <UserPlus className="w-5 h-5" />
                            Initialize Workflow
                        </button>
                    </form>
                </motion.div>

                <div className="space-y-6">
                    <div className="bg-hospital-50 p-6 rounded-2xl border border-hospital-100 flex items-start gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                            <Activity className="w-6 h-6 text-hospital-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-hospital-900">Queue Intelligence</h4>
                            <p className="text-sm text-hospital-700 mt-1">Current wait time for Consultation is approx. 12 minutes. Total 4 patients in queue.</p>
                        </div>
                    </div>

                    <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex items-start gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                            <Calendar className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-amber-900">Incomplete Record Detection</h4>
                            <p className="text-sm text-amber-700 mt-1">Found 2 patients with missing insurance details. Auto-notifying Billing.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
