import React from 'react';
import Navbar from '../components/Navbar';

const About = () => {
    return (
        <div
            className="min-h-screen bg-[url('/src/assets/images/pattern-bg.png')] bg-cover bg-fixed bg-top"

        >
            <Navbar />

            <div className="container mx-auto px-4 py-12 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 border-t-4 border-amber-500">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl md:text-4xl font-bold text-amber-700 mb-4">
                                About Khana Khajana
                            </h1>
                            <p className="text-lg text-gray-600 mb-4">
                                Your trusted mess management solution.
                            </p>
                            <div className="flex justify-center items-center gap-2 mb-6">
                                <div className="w-12 h-1 bg-amber-300 rounded"></div>
                                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                <div className="w-12 h-1 bg-amber-300 rounded"></div>
                            </div>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                At Khana Khajana, we aim to simplify your daily meal management. Whether you're a student, a working professional, or a mess manager, our platform is designed to streamline meal planning, menu updates, and user engagement. With a focus on efficiency and user satisfaction, we bring the best of technology to your dining experience.
                            </p>
                        </div>

                        {/* Features Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            <div className="bg-amber-50 p-6 rounded-lg shadow-md">
                                <h3 className="text-amber-700 font-bold text-xl mb-2">
                                    Easy Meal Planning
                                </h3>
                                <p className="text-gray-600">
                                    Plan your weekly meals effortlessly with our intuitive interface.
                                </p>
                            </div>
                            <div className="bg-amber-50 p-6 rounded-lg shadow-md">
                                <h3 className="text-amber-700 font-bold text-xl mb-2">
                                    Real-Time Menu Updates
                                </h3>
                                <p className="text-gray-600">
                                    Stay updated with daily menus and special dishes.
                                </p>
                            </div>
                            <div className="bg-amber-50 p-6 rounded-lg shadow-md">
                                <h3 className="text-amber-700 font-bold text-xl mb-2">
                                    User-Friendly Interface
                                </h3>
                                <p className="text-gray-600">
                                    Navigate through our platform with ease and convenience.
                                </p>
                            </div>
                            <div className="bg-amber-50 p-6 rounded-lg shadow-md">
                                <h3 className="text-amber-700 font-bold text-xl mb-2">
                                    Community Engagement
                                </h3>
                                <p className="text-gray-600">
                                    Connect with your mess community and share feedback.
                                </p>
                            </div>
                        </div>

                        {/* Mission Section */}
                        <div className="bg-amber-50 p-6 rounded-lg shadow-md text-center">
                            <h2 className="text-amber-700 font-bold text-2xl mb-4">
                                Our Mission
                            </h2>
                            <p className="text-gray-600">
                                To revolutionize the way messes operate by providing a seamless, efficient, and enjoyable dining experience for everyone.
                            </p>
                        </div>
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

export default About;