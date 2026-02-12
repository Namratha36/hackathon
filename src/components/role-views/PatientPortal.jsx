import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { PatientTimeline } from '../workflow/PatientTimeline';
import { Info, HelpCircle } from 'lucide-react';

export const PatientPortal = () => {
    const { patients } = useWorkflow();
    // In a real app, this would be based on login. For demo, we show the first patient.
    const activePatient = patients[0];

    return (
        <div className="max-w-4xl mx-auto py-12 px-6 space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Your Care Journey</h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Track your hospital progress in real-time. Information is updated as soon as clinical actions are verified.
                </p>
            </div>

            <PatientTimeline patient={activePatient} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-hospital-50 border border-hospital-100 p-6 rounded-3xl flex gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm self-start">
                        <Info className="w-6 h-6 text-hospital-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-hospital-900">What do these statuses mean?</h4>
                        <p className="text-sm text-hospital-700 mt-1 leading-relaxed">
                            <strong>Pending:</strong> Queued for the department.<br />
                            <strong>In Progress:</strong> Staff are currently attending to your request.<br />
                            <strong>Completed:</strong> Finalized and logged in your record.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 text-white p-6 rounded-3xl flex gap-4 shadow-xl">
                    <div className="p-3 bg-slate-800 rounded-2xl self-start">
                        <HelpCircle className="w-6 h-6 text-hospital-400" />
                    </div>
                    <div>
                        <h4 className="font-bold">Need Assistance?</h4>
                        <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                            If you have questions about your timeline, please speak to your floor nurse or use the call button at your bedside.
                        </p>
                        <button className="mt-4 px-4 py-2 bg-hospital-600 text-sm font-bold rounded-xl hover:bg-hospital-500 transition-all">
                            Request Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
