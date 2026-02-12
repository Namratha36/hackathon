import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useRole } from '../../context/RoleContext';
import { MedicalChatbot } from '../chat/MedicalChatbot';

export const DashboardLayout = ({ children }) => {
    const { currentRole, ROLES } = useRole();
    const isPatientView = currentRole === ROLES.PATIENT;

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {!isPatientView && <Sidebar />}
            <div className={`flex-1 flex flex-col ${!isPatientView ? 'ml-64' : ''}`}>
                {!isPatientView && <Header />}
                <main className={`flex-1 p-8 ${!isPatientView ? 'mt-20' : 'mx-auto max-w-5xl w-full'}`}>
                    {children}
                </main>
            </div>
            <MedicalChatbot />
        </div>
    );
};
