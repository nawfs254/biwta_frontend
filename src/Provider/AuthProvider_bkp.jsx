import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context to store authentication state
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

// AuthProvider component to wrap the app and provide the auth context
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [zemail, setZemail] = useState(null);
    const [zid, setZid] = useState(null);
    const [token,setToken]=useState(null)

    const login = (id,zid,token) => {
      
        setIsAuthenticated(true);
        setZemail(id);
        setZid(zid);
        setToken(token);
        sessionStorage.setItem('zid', zid);
        sessionStorage.setItem('zemail', id);
        sessionStorage.setItem('token', token);
       
    };

    const logout = () => {
        setIsAuthenticated(false);
        setZemail(null);
        setZid(null);
        sessionStorage.removeItem('zid');
        sessionStorage.removeItem('zemail');
        sessionStorage.removeItem('token');
      };



    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout,zemail ,zid, setZid,token  }}>
            {children}
        </AuthContext.Provider>
    );
};
