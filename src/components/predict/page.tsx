'use client';
import React from "react";
import { useState } from "react";

const Predict = () => {
    // const features = ['Area', 'Bedrooms', 'Bathrooms', 'Floors', 'YearBuilt', 'Location', 'Condition', 'Garage'];

    // Initialize state with null values to represent empty inputs
    // const [inputValues, setInputValues] = useState<(number | null)[]>(
    //     Array(features.length).fill(null)
    // );
    const [area, setArea] = useState<string | null>(null);
    const [bedrooms, setBedrooms] = useState<string | null>(null);
    const [bathrooms, setBathrooms] = useState<string | null>(null);
    const [floors, setFloors] = useState<string | null>(null);
    const [yearBuilt, setYearBuilt] = useState<string | null>(null);
    const [location, setLocation] = useState<string | null>(null);
    const [condition, setCondition] = useState<string | null>(null);
    const [garage, setGarage] = useState<string | null>(null);



    const [prediction, setPrediction] = useState<number | string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Create feature object with feature names as keys
            //   const featureObject = features.reduce((obj, feature, index) => {
            //     obj[feature] = inputValues[index];
            //     return obj;
            //   }, {} as Record<string, number | null>);

            // Create feature object with feature names as keys
            const featureObject = {
                Area: Number(area), // this is float
                Bedrooms: Number(bedrooms),
                Bathrooms: Number(bathrooms),
                Floors: Number(floors),
                YearBuilt: Number(yearBuilt),
                Location: location,
                Condition: condition,
                Garage: Number(garage),
            };

            // const featureObject = {
            //     "Area": 2000,
            //     "Bedrooms": 3,
            //     "Bathrooms": 2,
            //     "Floors": 2,
            //     "YearBuilt": 1995,
            //     "Location": "Suburbs",
            //     "Condition": "Good",
            //     "Garage": 1
            // };
    
            console.log("Sending features:", featureObject); // Debug log
    
            const response = await fetch("http://127.0.0.1:8000/predict/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(featureObject)  // Pass the featureObject directly
            });

            console.log("Response:", response); // Debug log

            // Check if response is OK first
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error (${response.status}): ${errorText}`);
            }

            const data = await response.json();
            console.log("Data:", data); // Debug log
            setPrediction(data.predicted_price  );

        } catch (err) {
            console.error('Prediction error:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-12">
            <main className="max-w-xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-blue-600 p-6 text-white">
                    <h1 className="text-2xl md:text-3xl font-bold">House Price Prediction</h1>
                    <p className="text-blue-100 mt-2">Fill in the details to estimate your property value</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-gray-700 font-medium">Area (sq ft)</label>
                            <input
                                type="text"
                                value={area || ''}
                                onChange={(e) => setArea(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400 text-gray-900"
                                placeholder="e.g. 1200"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700 font-medium">Bedrooms</label>
                            <input
                                type="text"
                                value={bedrooms || ''}
                                onChange={(e) => setBedrooms(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400 text-gray-900"
                                placeholder="e.g. 3"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700 font-medium">Bathrooms</label>
                            <input
                                type="text"
                                value={bathrooms || ''}
                                onChange={(e) => setBathrooms(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400 text-gray-900"
                                placeholder="e.g. 2"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700 font-medium">Floors</label>
                            <input
                                type="text"
                                value={floors || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                        setFloors(value);
                                    }
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400 text-gray-900"
                                placeholder="e.g. 2"
                                inputMode="numeric"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700 font-medium">Year Built</label>
                            <input
                                type="text"
                                value={yearBuilt || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                        setYearBuilt(value);
                                    }
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400 text-gray-900"
                                placeholder="e.g. 2005"
                                inputMode="numeric"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700 font-medium">Location</label>
                            <input
                                type="text"
                                value={location || ''}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400 text-gray-900"
                                placeholder="e.g. Downtown"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700 font-medium">Condition</label>
                            <select
                                value={condition || ''}
                                onChange={(e) => setCondition(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition placeholder-gray-400 text-gray-900"
                                required
                            >
                                <option value="" disabled>Select condition</option>
                                <option value="Excellent">Excellent</option>
                                <option value="Good">Good</option>
                                <option value="Fair">Fair</option>
                                <option value="Poor">Poor</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700 font-medium">Garage Spaces</label>
                            <input
                                type="text"
                                value={garage || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                        setGarage(value);
                                    }
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400 text-gray-900"
                                placeholder="e.g. 2"
                                inputMode="numeric"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 font-medium shadow-md flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            Calculate Price
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="mx-6 mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                        <div className="flex">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {prediction !== null && !error && (
                    <div className="mx-6 mb-6 p-6 bg-green-50 border border-green-100 rounded-lg text-center">
                        <span className="inline-block p-2 rounded-full bg-green-100 text-green-500 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </span>
                        <h2 className="font-semibold text-lg text-gray-700 mb-1">Estimated House Price</h2>
                        <p className="text-3xl font-bold text-green-600">
                            ${typeof prediction === 'number' ? prediction.toLocaleString() : prediction}
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Predict;