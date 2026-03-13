import React from 'react' ;
import {useState, useEffect} from 'react' ;

const WaterTracker = () => {
    const [count, setCount] = useState(0) ;
    const [goal, setGoal] = useState(8) ;
    const [value, setValue] = useState("") ; 

    const handleChange = (e) => {
        const temp =  e.target.value ;
        if(temp == "") return ;
        setValue(temp) ;
    }
    const handleIncrease = () => {
        if(count + 1 == goal) {
            alert("Completed Your goal for today.") ;
        }
        setCount(count + 1) ;
    }

    const handleGoal = () => {
        if(value == "") return ;
        setGoal(Number(value)) ;
    }
    const handleDecrease = () => {
        setCount(count - 1) ;
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Water Tracker</h1>
            
            <div className="text-center mb-8">
                <p className="text-sm text-gray-500 mb-2">Today's Progress</p>
                <p className="text-5xl font-light text-gray-900">{count}<span className="text-2xl text-gray-400">/{goal}</span></p>
                <p className="text-sm text-gray-500 mt-1">glasses</p>
                <div className="w-full bg-gray-100 rounded-full h-2 mt-6">
                    <div className="bg-gray-900 h-2 rounded-full transition-all" style={{ width: `${(count / goal) * 100}%` }}></div>
                </div>
            </div>

            <div className="space-y-4 mb-6">
                <div className="flex gap-3">
                    <input 
                        type="number"
                        value={value} 
                        placeholder="Set daily goal" 
                        onChange={handleChange}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-900 transition"
                    />
                    <button 
                        onClick={handleGoal}
                        className="bg-gray-900 hover:bg-gray-700 text-white px-6 py-2 rounded transition"
                    >
                        Set
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
                <button 
                    onClick={handleIncrease}
                    className="bg-gray-900 hover:bg-gray-700 text-white py-3 rounded transition"
                >
                    + Add
                </button>
                <button 
                    onClick={handleDecrease}
                    className="border border-gray-300 hover:border-gray-900 text-gray-900 py-3 rounded transition"
                >
                    − Remove
                </button>
            </div>

            <button 
                onClick={() => setCount(0)}
                className="w-full text-gray-500 hover:text-gray-900 py-2 text-sm transition"
            >
                Reset
            </button>
        </div>
    ) ;
} ; 
export default WaterTracker ;