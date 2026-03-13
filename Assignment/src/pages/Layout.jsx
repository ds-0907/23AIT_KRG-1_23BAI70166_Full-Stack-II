import React from 'react' ;
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Layout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Navbar/>
            <Outlet/>
        </div>
    ) ;
} ;

export default Layout ;
