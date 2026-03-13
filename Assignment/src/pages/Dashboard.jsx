import React from 'react';
import WaterTracker from '../components/WaterTracker';
import HealthAdvise from '../components/HealthAdvise';

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-2xl mx-auto space-y-8">
                <WaterTracker />
                <HealthAdvise />
            </div>
        </div>
    );
};

export default Dashboard;
