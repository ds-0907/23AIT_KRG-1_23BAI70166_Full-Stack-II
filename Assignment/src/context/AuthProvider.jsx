import React from 'react' ;
import { useState, useEffect } from 'react' ;
import AuthContext from './AuthContext';

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null) ;

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setUser(token);
        }
    }, []);

    const Login = (token) => {
        setUser(token) ;
        localStorage.setItem("token", token) ;
    }
    const Logout = () => {
        setUser(null);
        localStorage.removeItem("token") ;
    }

    return (
        <AuthContext.Provider value = {{user, Login, Logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider ;