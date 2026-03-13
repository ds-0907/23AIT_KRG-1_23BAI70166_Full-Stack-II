import React from 'react' ;
import {useState, useEffect} from 'react' ;
import getData from '../data/getData';

const HealthAdvise = () => {
    const [advise, setAdvise] = useState("") ;
    const [change, setChange] = useState(false) ;


    useEffect(() => {
        async function fetchAdvise(){
            try {
                const data = await getData() ;
                setAdvise(data.slip?.advice || "Stay hydrated and healthy!");
            } catch (error) {
                console.error(error);
                setAdvise("Stay hydrated and healthy!");
            }
        } ;
        fetchAdvise() ;
    }, [change]) ; // only for the initial Render

    const handleClick = () => {
        setChange(!change) ;
    }
     
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Health Advice</h2>
            <p className="text-gray-600 mb-6 min-h-[60px]">
                {advise || "Loading..."}
            </p>
            <button 
                onClick={handleClick}
                className="text-gray-900 hover:text-gray-600 text-sm transition"
            >
                Refresh →
            </button>
        </div>
    )
} ;

export default HealthAdvise ;