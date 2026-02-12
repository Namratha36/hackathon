import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkflowContext = createContext();

const INITIAL_PATIENTS = [
    {
        id: 'P001',
        name: 'Sarah Johnson',
        age: 42,
        gender: 'Female',
        condition: 'Acute Chest Pain',
        status: 'In Progress',
        admittedAt: new Date(Date.now() - 3600000).toISOString(),
        tasks: [
            { id: 'T1', dept: 'Registration', action: 'Patient Intake', status: 'Completed', severity: 'Low', timestamp: new Date(Date.now() - 3600000).toISOString() },
            { id: 'T2', dept: 'Doctor', action: 'Initial Consultation', status: 'Completed', severity: 'High', timestamp: new Date(Date.now() - 2400000).toISOString() },
            { id: 'T3', dept: 'Laboratory', action: 'Blood Panel (Cardiac)', status: 'In Progress', severity: 'High', timestamp: new Date(Date.now() - 1200000).toISOString() },
            { id: 'T4', dept: 'Pharmacy', action: 'Emergency Meds', status: 'Pending', severity: 'High', timestamp: null },
        ]
    },
    {
        id: 'P002',
        name: 'Michael Chen',
        age: 28,
        gender: 'Male',
        condition: 'Compound Fracture',
        status: 'Waiting',
        admittedAt: new Date(Date.now() - 1800000).toISOString(),
        tasks: [
            { id: 'T5', dept: 'Registration', action: 'Patient Intake', status: 'Completed', severity: 'Low', timestamp: new Date(Date.now() - 1800000).toISOString() },
            { id: 'T6', dept: 'Doctor', action: 'Ortho Evaluation', status: 'Pending', severity: 'Moderate', timestamp: null },
        ]
    },
    {
        id: 'P003',
        name: 'Elena Rodriguez',
        age: 65,
        gender: 'Female',
        condition: 'Severe Hypertension',
        status: 'In Progress',
        admittedAt: new Date(Date.now() - 7200000).toISOString(),
        tasks: [
            { id: 'T7', dept: 'Registration', action: 'Patient Intake', status: 'Completed', severity: 'Low', timestamp: new Date(Date.now() - 7200000).toISOString() },
            { id: 'T8', dept: 'Doctor', action: 'Vitals Check', status: 'Completed', severity: 'High', timestamp: new Date(Date.now() - 6000000).toISOString() },
            { id: 'T9', dept: 'Pharmacy', action: 'BP Regulation', status: 'Completed', severity: 'High', timestamp: new Date(Date.now() - 3000000).toISOString() },
            { id: 'T10', dept: 'Billing', action: 'Discharge Summary', status: 'Pending', severity: 'Low', timestamp: null },
        ]
    },
    {
        id: 'P004',
        name: 'James Wilson',
        age: 52,
        gender: 'Male',
        condition: 'Suspected Pneumonia',
        status: 'Waiting',
        admittedAt: new Date(Date.now() - 900000).toISOString(),
        tasks: [
            { id: 'T11', dept: 'Registration', action: 'Patient Intake', status: 'Completed', severity: 'Low', timestamp: new Date(Date.now() - 900000).toISOString() },
            { id: 'T12', dept: 'Doctor', action: 'Respiratory Assessment', status: 'Pending', severity: 'High', timestamp: null },
        ]
    }
];

export const WorkflowProvider = ({ children }) => {
    const [patients, setPatients] = useState(INITIAL_PATIENTS);
    const [logs, setLogs] = useState([
        { id: 1, message: 'Patient Sarah Johnson moved to Laboratory', time: '5m ago' },
        { id: 2, message: 'Pharmacy stocks updated for Insulin', time: '12m ago' },
        { id: 3, message: 'Emergency alert: Critical lab result for P001', time: 'Just now' },
    ]);
    const [searchQuery, setSearchQuery] = useState('');

    const calculatePatientRisk = (patient) => {
        const pendingTasks = patient.tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress');
        const criticalTasks = pendingTasks.filter(t => t.severity === 'High');

        let score = (pendingTasks.length * 10) + (criticalTasks.length * 20);

        // Simple delay factor: tasks older than 5 mins
        const now = new Date();
        const delayedTasks = pendingTasks.filter(t => {
            if (!t.timestamp) return false;
            const diff = (now - new Date(t.timestamp)) / 60000;
            return diff > 15;
        });

        score += (delayedTasks.length * 15);

        // Normalize to 0-100
        return Math.min(Math.round(score), 100);
    };

    const getGlobalMetrics = () => {
        const totalPending = patients.reduce((acc, p) => acc + p.tasks.filter(t => t.status !== 'Completed').length, 0);
        const totalHighSeverity = patients.reduce((acc, p) => acc + p.tasks.filter(t => t.status !== 'Completed' && t.severity === 'High').length, 0);
        const avgRisk = patients.length > 0
            ? Math.round(patients.reduce((acc, p) => acc + calculatePatientRisk(p), 0) / patients.length)
            : 0;

        return {
            totalPending,
            totalHighSeverity,
            avgRisk
        };
    };

    const updateTaskStatus = (patientId, taskId, newStatus) => {
        setPatients(prev => prev.map(patient => {
            if (patient.id === patientId) {
                return {
                    ...patient,
                    tasks: patient.tasks.map(task =>
                        task.id === taskId ? { ...task, status: newStatus, timestamp: newStatus === 'In Progress' || newStatus === 'Completed' ? new Date().toISOString() : task.timestamp } : task
                    )
                };
            }
            return patient;
        }));

        // Add to logs
        const patientNotify = patients.find(p => p.id === patientId);
        const taskNotify = patientNotify?.tasks.find(t => t.id === taskId);
        if (patientNotify && taskNotify) {
            addLog(`${patientNotify.name}: ${taskNotify.action} marked as ${newStatus}`);
        }
    };

    const triggerDemoScenario = (scenario) => {
        if (scenario === 'EMERGENCY') {
            const name = 'David Miller';
            const condition = 'Anaphylactic Shock';
            const newPatient = {
                id: `P${Math.floor(Math.random() * 900) + 100}`,
                name: `Emergency Demo: ${name}`,
                age: 58,
                gender: 'Male',
                condition: condition,
                status: 'Waiting',
                admittedAt: new Date().toISOString(),
                tasks: [
                    { id: Math.random().toString(36), dept: 'Registration', action: 'Emergency Intake', status: 'Completed', severity: 'Low', timestamp: new Date().toISOString() },
                    { id: Math.random().toString(36), dept: 'Doctor', action: 'Critical Resuscitation', status: 'Pending', severity: 'High', timestamp: null },
                    { id: Math.random().toString(36), dept: 'Pharmacy', action: 'Epinephrine Admin', status: 'Pending', severity: 'High', timestamp: null },
                ]
            };
            setPatients(prev => [newPatient, ...prev]);
            addLog('EMERGENCY ALERT: New critical intake in ER');

            // Speak alert
            window.speechSynthesis.cancel();
            const alertText = `Emergency alert. New critical intake. Patient ${name}. condition. ${condition}. Please prioritize critical resuscitation and epinephrine administration.`;
            const utterance = new SpeechSynthesisUtterance(alertText);
            utterance.rate = 1;
            utterance.pitch = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    };

    const addLog = (message) => {
        setLogs(prev => {
            if (prev.length > 0 && prev[0].message === message) return prev;
            return [{ id: Date.now() + Math.random(), message, time: 'Just now' }, ...prev.slice(0, 9)];
        });
    };

    const addPatient = (patient) => {
        setPatients(prev => [patient, ...prev]);
    };

    return (
        <WorkflowContext.Provider value={{
            patients,
            setPatients,
            updateTaskStatus,
            addLog,
            logs,
            addPatient,
            calculatePatientRisk,
            getGlobalMetrics,
            triggerDemoScenario,
            searchQuery,
            setSearchQuery,
        }}>
            {children}
        </WorkflowContext.Provider>
    );
};

export const useWorkflow = () => useContext(WorkflowContext);
