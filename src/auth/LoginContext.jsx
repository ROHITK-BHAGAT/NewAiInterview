import React, { createContext, useReducer, useContext } from 'react';
import Swal from 'sweetalert2';

// Create Context
const initialState = {
    user: null,
    token: null,
    logout: () => {} // Placeholder for logout function
};

const LoginContext = createContext(initialState);

// Define a reducer
const loginReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload.user, token: action.payload.token };
        case 'LOGOUT':
            return { ...state, user: null, token: null };
        default:
            return state;
    }
};

// Create Provider component
const LoginProvider = ({ children }) => {
    const [state, dispatch] = useReducer(loginReducer, { user: null, token: null });

    const logout = () => {
        Swal.fire({
            title: 'Are you sure you want to logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, log out',
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch({ type: 'LOGOUT' });
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                window.location.href = '/ai_hr';
            }
        });
    };

    return (
        <LoginContext.Provider value={{ ...state, dispatch, logout }}>
            {children}
        </LoginContext.Provider>
    );
};

// Custom hook to use the LoginContext
const useLogin = () => useContext(LoginContext);

export { LoginProvider, useLogin };
