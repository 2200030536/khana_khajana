import React from 'react';
import Navbar from '../components/Navbar';

const Contact = () => {
    return (
        <div

        >
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

                        {/* Contact Form */}
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
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
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    placeholder="Write your message here"
                                ></textarea>
                            </div>
                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300 shadow-md hover:shadow-lg"
                                >
                                    Send Message
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