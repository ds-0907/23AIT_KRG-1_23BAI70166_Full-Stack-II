import React from 'react' ;
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-red-600 mb-4">404</h1>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h2>
                <p className="text-xl text-gray-600 mb-8">Sorry, the page you're looking for doesn't exist.</p>
                <Link 
                    to="/"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 inline-block"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    ) ;
} ;

export default NotFound ;