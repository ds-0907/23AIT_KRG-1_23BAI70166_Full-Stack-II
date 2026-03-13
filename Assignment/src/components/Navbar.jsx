import React from 'react' ;
import { Link, useNavigate } from 'react-router-dom' ;
import useAuth from '../hooks/useAuth';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, Logout } = useAuth();

    const handleLogout = () => {
        Logout();
        navigate('/login');
    }

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <h1 className="text-gray-900 text-xl font-semibold">HealthTrack</h1>
                        {user && (
                            <ul className="flex space-x-6">
                                <li>
                                    <Link to="/" className="text-gray-600 hover:text-gray-900 transition">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition">
                                        Water Tracker
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </div>
                    {user && (
                        <button 
                            onClick={handleLogout}
                            className="text-gray-600 hover:text-gray-900 transition"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    ) ;
} ;

export default Navbar ;