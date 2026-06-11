import React, { useState } from 'react'
import bannerImg from "../../assets/banner.png"

const Banner = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = () => {
        if (email && email.includes('@')) {
            setSubscribed(true);
            setEmail('');
        }
    };

    return (
        <div className='flex flex-col md:flex-row-reverse py-16 justify-between items-center gap-12'>
            <div className='md:w-1/2 w-full flex items-center md:justify-end'>
                <img src={bannerImg} alt="New book releases" />
            </div>

            <div className='md:w-1/2 w-full'>
                <h1 className='md:text-5xl text-2xl font-medium mb-7'>New Releases This Week</h1>
                <p className='mb-6 text-gray-600'>
                    It's time to update your reading list with some of the latest and greatest releases in the literary world.
                    From heart-pumping thrillers to captivating memoirs, this week's new releases offer something for everyone.
                </p>

                {subscribed ? (
                    <p className="text-green-600 font-semibold">✅ You're subscribed! We'll keep you updated.</p>
                ) : (
                    <div className="flex gap-2 flex-col sm:flex-row">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-auto"
                        />
                        <button
                            onClick={handleSubscribe}
                            className='btn-primary px-6 py-2 rounded-md font-semibold'>
                            Subscribe
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Banner;
