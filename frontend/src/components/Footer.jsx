import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import footerLogo from "../assets/footer-logo.png"
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa"

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = () => {
        if (email && email.includes('@')) {
            setSubscribed(true);
            setEmail('');
        }
    };

    return (
        <footer className="bg-gray-900 text-white py-10 px-4">
            {/* Top Section */}
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
                {/* Left Side - Logo and Nav */}
                <div className="md:w-1/2 w-full">
                    <img src={footerLogo} alt="Bookstore Logo" className="mb-5 w-36" />
                    <ul className="flex flex-col md:flex-row gap-4">
                        <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                        <li><Link to="/orders" className="hover:text-primary transition-colors">My Orders</Link></li>
                        <li><Link to="/cart" className="hover:text-primary transition-colors">Cart</Link></li>
                        <li><Link to="/login" className="hover:text-primary transition-colors">Login</Link></li>
                    </ul>
                </div>

                {/* Right Side - Newsletter */}
                <div className="md:w-1/2 w-full">
                    <p className="mb-4">
                        Subscribe to our newsletter to receive the latest updates, news, and offers from Bookstore!
                    </p>
                    {subscribed ? (
                        <p className="text-green-400 font-medium">✅ Thanks for subscribing!</p>
                    ) : (
                        <div className="flex">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 rounded-l-md text-black focus:outline-none"
                            />
                            <button
                                onClick={handleSubscribe}
                                className="bg-primary px-6 py-2 rounded-r-md hover:bg-yellow-500 text-black font-semibold transition-colors">
                                Subscribe
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Section */}
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center mt-10 border-t border-gray-700 pt-6">
                <ul className="flex gap-6 mb-4 md:mb-0">
                    <li><span className="text-gray-400 text-sm cursor-default">Privacy Policy</span></li>
                    <li><span className="text-gray-400 text-sm cursor-default">Terms of Service</span></li>
                </ul>

                <div className="flex gap-6">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                        <FaFacebook size={24} />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                        <FaTwitter size={24} />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                        <FaInstagram size={24} />
                    </a>
                </div>
            </div>

            {/* Copyright */}
            <div className="text-center text-gray-400 text-sm mt-6">
                &copy; {new Date().getFullYear()} Bookstore by Rupa Maurya. All rights reserved.
            </div>
        </footer>
    )
}

export default Footer
