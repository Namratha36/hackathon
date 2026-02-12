import React, { createContext, useContext, useState } from 'react';

const RoleContext = createContext();

export const ROLES = {
    ADMIN: 'Hospital Admin',
    REGISTRATION: 'Registration',
    DOCTOR: 'Physician / Doctor',
    LAB: 'Laboratory',
    PHARMACY: 'Pharmacy',
    BILLING: 'Billing & Accounts',
    PATIENT: 'Patient View'
};

export const RoleProvider = ({ children }) => {
    const [currentRole, setCurrentRole] = useState(ROLES.ADMIN);

    return (
        <RoleContext.Provider value={{ currentRole, setCurrentRole, ROLES }}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRole = () => {
    const context = useContext(RoleContext);
    if (!context) throw new Error('useRole must be used within a RoleProvider');
    return context;
};
