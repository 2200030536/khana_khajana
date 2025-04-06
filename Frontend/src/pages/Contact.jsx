import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import axiosInstance from '../axiosConfig';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    
    // Handle form input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };
    
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);
        
        try {
            // Validate form data
            if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
                setError('All fields are required');
                setLoading(false);
                return;
            }
            
            // Submit form data to backend
            const response = await axiosInstance.post('/api/contacts', formData);
            
            // Reset form on success
            setFormData({
                name: '',
                email: '',
                message: ''
            });
            
            setSuccess(true);
            console.log('Contact form submitted:', response.data);
        } catch (err) {
            console.error('Error submitting contact form:', err);
            
            // Display specific error message if available
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Failed to send message. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div>
            <Navbar />

            <div className="container mx-auto px-4 py-12 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 border-t-4 border-amber-500">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl md:text-4xl font-bold text-amber-700 mb-4">
                                Contact Us
                            </h1>
                            <p className="text-lg text-gray-600 mb-4">
                                We'd love to hear from you! Reach out to us for any queries, feedback, or support.
                            </p>
                            <div className="flex justify-center items-center gap-2 mb-6">
                                <div className="w-12 h-1 bg-amber-300 rounded"></div>
                                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                <div className="w-12 h-1 bg-amber-300 rounded"></div>
                            </div>
                        </div>

                        {/* Success message */}
                        {success && (
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-green-700">
                                            Thank you for contacting us! We've received your message and will get back to you soon.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error message */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">
                                            {error}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Contact Form */}
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    placeholder="Write your message here"
                                ></textarea>
                            </div>
                            <div className="text-center">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`${loading ? 'bg-amber-400' : 'bg-amber-600 hover:bg-amber-700'} text-white px-6 py-3 rounded-lg font-medium transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center mx-auto`}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </>
                                    ) : 'Send Message'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Footer note */}
                    <div className="text-center mt-6 text-gray-500 text-sm">
                        <p>© 2025 Khana Khajana - Your daily mess companion</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;