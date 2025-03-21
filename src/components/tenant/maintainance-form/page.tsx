'use client';
import { useState } from 'react';
import { addDoc, collection, where, limit, query, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

interface MaintenanceRequestFormProps {
    tenantId: string;
}

const MaintenanceRequestForm: React.FC<MaintenanceRequestFormProps> = ({ tenantId }) => {
    const [houseId, setHouseId] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [otherCategory, setOtherCategory] = useState('');
    const [issue, setIssue] = useState('');
    const [urgency, setUrgency] = useState('medium');
    const [preferredDate, setPreferredDate] = useState('');
    const [preferredTime, setPreferredTime] = useState('');
    const [entryPermission, setEntryPermission] = useState('yes');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const maintenanceCategories = [
        { value: 'plumbing', label: 'Plumbing' },
        { value: 'electrical', label: 'Electrical' },
        { value: 'hvac', label: 'HVAC / Climate Control' },
        { value: 'appliance', label: 'Appliance Repair' },
        { value: 'structural', label: 'Structural Issues' },
        { value: 'pest', label: 'Pest Control' },
        { value: 'landscaping', label: 'Landscaping / Exterior' },
        { value: 'security', label: 'Security / Locks' },
        { value: 'other', label: 'Other' }
    ];

    const toggleCategory = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const sendOrderEmail = async (issueDetails: any) => {
        try {
            console.log('Sending email data:', issueDetails);
            const response = await fetch('/api/send-mtnc-to-owner', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(issueDetails),
                cache: 'no-store' // Prevents caching of the request
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Log the response status
            console.log('Email API response status:', response.status);

            const data = await response.json();
            console.log('Email sent successfully:', data);
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate form
        if (!houseId || !issue || (selectedCategories.length === 0)) {
            setError('Please complete all required fields');
            return;
        }

        // If "Other" is selected but no description provided
        if (selectedCategories.includes('other') && !otherCategory) {
            setError('Please specify the "Other" category');
            return;
        }

        setIsSubmitting(true);

        try {
            // Check if the houseId exists in Firestore
            const houseQuery = query(
                collection(db, 'houses'),
                where('id', '==', houseId),
                limit(1)
            );
            const houseSnapshot = await getDocs(houseQuery);

            // Check if documents were returned
            if (houseSnapshot.empty) {
                setError('Property ID does not exist or is not available.');
                setIsSubmitting(false);
                return;
            }

            const houseDoc = houseSnapshot.docs[0];

            // Safely check if the document exists
            if (!houseDoc.exists()) {
                setError('Property ID does not exist or is not available.');
                setIsSubmitting(false);
                return;
            }
            // Prepare categories list including "other" description if applicable
            const categories = selectedCategories.includes('other')
                ? [...selectedCategories.filter(c => c !== 'other'), `other: ${otherCategory}`]
                : selectedCategories;

            // Submit the maintenance request
            await addDoc(collection(db, 'maintenanceRequests'), {
                tenantId,
                houseId,
                categories,
                issue,
                urgency,
                preferredDate: preferredDate || null,
                preferredTime: preferredTime || null,
                entryPermission,
                status: 'Pending',
                createdAt: new Date(),
            });

            // Send email to property owner
            await sendOrderEmail({
                houseId,
                issueCategory: categories.join(', '),
                issue,
                urgency,
                preferredDate,
                preferredTime,
                entryPermission,
                tenant_email: 'divyanshuempire789@gmail.com',  // Tenant's email
                owner_email: 'abhinavkaintura001@gmail.com'    // Owner's email 
            }
            );

            // Reset form
            setIssue('');
            setHouseId('');
            setSelectedCategories([]);
            setOtherCategory('');
            setUrgency('medium');
            setPreferredDate('');
            setPreferredTime('');
            setEntryPermission('yes');
            setSuccess('Maintenance request submitted successfully! Our team will contact you shortly.');
        } catch (error) {
            setError('Error submitting maintenance request. Please try again.');
            console.error(error);
        }

        setIsSubmitting(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white bg-opacity-95 rounded-lg shadow-2xl"
            style={{ borderTop: "4px solid #2c4a63" }}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-center">MAINTENANCE REQUEST</h2>
            <p className="text-gray-600 text-center mb-8">Excellence in property care and management</p>

            {success && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-800 rounded">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left column */}
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="houseId" className="block text-gray-700 font-medium mb-2">Property ID*</label>
                            <input
                                id="houseId"
                                type="text"
                                value={houseId}
                                onChange={(e) => setHouseId(e.target.value)}
                                placeholder="Enter your Property ID"
                                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Issue Categories* (Select all that apply)</label>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                {maintenanceCategories.map((category) => (
                                    <div
                                        key={category.value}
                                        onClick={() => toggleCategory(category.value)}
                                        className={`p-3 text-center rounded border cursor-pointer transition-all ${selectedCategories.includes(category.value)
                                            ? 'bg-blue-700 text-white border-blue-800'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {category.label}
                                    </div>
                                ))}
                            </div>

                            {/* Other category input */}
                            {selectedCategories.includes('other') && (
                                <input
                                    type="text"
                                    value={otherCategory}
                                    onChange={(e) => setOtherCategory(e.target.value)}
                                    placeholder="Please specify other issue type"
                                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition mt-2"
                                    required
                                />
                            )}
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Urgency Level</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setUrgency('low')}
                                    className={`p-3 text-center rounded border ${urgency === 'low'
                                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Low
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUrgency('medium')}
                                    className={`p-3 text-center rounded border ${urgency === 'medium'
                                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Medium
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUrgency('high')}
                                    className={`p-3 text-center rounded border ${urgency === 'high'
                                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    High
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Preferred Service Date/Time (Optional)</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input
                                    type="date"
                                    value={preferredDate}
                                    onChange={(e) => setPreferredDate(e.target.value)}
                                    className="p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                                <select
                                    value={preferredTime}
                                    onChange={(e) => setPreferredTime(e.target.value)}
                                    className="p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                >
                                    <option value="">Select time</option>
                                    <option value="morning">Morning (8AM-12PM)</option>
                                    <option value="afternoon">Afternoon (12PM-5PM)</option>
                                    <option value="evening">Evening (5PM-8PM)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Permission to Enter Property</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEntryPermission('yes')}
                                    className={`p-3 text-center rounded border ${entryPermission === 'yes'
                                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Yes, enter if I'm not home
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEntryPermission('no')}
                                    className={`p-3 text-center rounded border ${entryPermission === 'no'
                                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    No, I must be present
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Full width description */}
                <div>
                    <label htmlFor="issue" className="block text-gray-700 font-medium mb-2">Describe the Issue in Detail*</label>
                    <textarea
                        id="issue"
                        value={issue}
                        onChange={(e) => setIssue(e.target.value)}
                        placeholder="Please provide as much detail as possible about the issue..."
                        className="w-full p-3 border border-gray-300 rounded h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                    />
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-blue-700 hover:bg-blue-800 text-white text-lg font-semibold rounded shadow-lg disabled:bg-gray-400 transition duration-300"
                    style={{ backgroundColor: "#2c4a63" }}
                >
                    {isSubmitting ? 'Processing...' : 'SUBMIT REQUEST'}
                </button>
            </form>

            <div className="mt-6 text-center text-gray-600">
                <p>For urgent after-hours emergencies, please call +91-9368152845</p>
            </div>
        </div>
    );
};

export default MaintenanceRequestForm;