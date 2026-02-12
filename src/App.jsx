import React from 'react';
import { RoleProvider, useRole, ROLES } from './context/RoleContext';
import { WorkflowProvider, useWorkflow } from './context/WorkflowContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { CommandCenter } from './components/dashboard/CommandCenter';
import { RegistrationView } from './components/role-views/RegistrationView';
import { DepartmentTaskView } from './components/role-views/DepartmentTaskView';
import { PatientPortal } from './components/role-views/PatientPortal';
import { PatientTimeline } from './components/workflow/PatientTimeline';
import { Activity, Clock } from 'lucide-react';

const ViewRegistry = () => {
  const { currentRole, ROLES } = useRole();
  const { patients, logs, searchQuery } = useWorkflow();

  const renderContent = () => {
    switch (currentRole) {
      case ROLES.ADMIN:
        return (
          <div className="space-y-12">
            <CommandCenter />
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Global Live Feed
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  {patients
                    .filter(p => !searchQuery ||
                      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.tasks.some(t => t.dept.toLowerCase().includes(searchQuery.toLowerCase())))
                    .slice(0, searchQuery ? undefined : 2) // Show all matches if searching, else limit to 2
                    .map(p => (
                      <PatientTimeline key={p.id} patientId={p.id} />
                    ))}
                  {patients.filter(p => !searchQuery ||
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.id.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                      <div className="p-12 text-center bg-slate-50 border border-dashed border-slate-300 rounded-3xl">
                        <p className="text-slate-400 font-bold">No patients found matching "{searchQuery}"</p>
                      </div>
                    )}
                </div>
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft h-fit sticky top-24">
                  <h4 className="font-bold flex items-center gap-2 mb-6 text-slate-800">
                    <Clock className="w-5 h-5 text-hospital-500" />
                    Live Activity Pulse
                  </h4>
                  <div className="space-y-6">
                    {logs.map(log => (
                      <div key={log.id} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-hospital-400 before:rounded-full">
                        <p className="text-sm text-slate-700 font-medium">{log.message}</p>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case ROLES.REGISTRATION:
        return <RegistrationView />;
      case ROLES.PATIENT:
        return <PatientPortal />;
      default:
        // Doctor, Lab, Pharmacy, Billing all use the Task View
        return <DepartmentTaskView />;
    }
  };

  return <DashboardLayout>{renderContent()}</DashboardLayout>;
};

function App() {
  return (
    <RoleProvider>
      <WorkflowProvider>
        <ViewRegistry />
      </WorkflowProvider>
    </RoleProvider>
  );
}

export default App;
