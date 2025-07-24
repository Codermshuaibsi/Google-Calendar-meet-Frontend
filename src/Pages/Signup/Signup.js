import axios from "axios";
import React, { useState } from "react";

const Signup = () => {

    const [first, setfirst] = useState("")

    const handleGoogleSignUp = () => {
       window.location.href = `https://google-calendar-meet-backend.onrender.com/google`;
    }

    return (
        <div className="min-h-screen bg-gray-200 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg px-8 py-12 w-full max-w-sm text-center">
                <h2 className="mb-6 text-2xl font-semibold">Sign Up</h2>
                <button
                    onClick={handleGoogleSignUp} // Assuming you have a function to handle Google sign-up
                    className="
            flex items-center justify-center gap-3
            w-full py-3 mb-8
            bg-white 
            text-gray-800 
            border border-gray-200
            rounded-lg 
            font-medium
            shadow-sm
            hover:shadow-md
            transition
            outline-none
            focus:ring-2
            focus:ring-blue-300
            active:bg-gray-50
          "
                >
                    <svg width="20" height="20" viewBox="0 0 48 48" className="mr-2">
                        <g>
                            <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.6 33.5 30 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 6 .9 8.2 2.6l6.2-6.2C34.6 6.6 29.6 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5c10.8 0 20-8.3 20-20 0-1.3-.1-2.7-.5-4z" />
                            <path fill="#34A853" d="M6.3 14.7l6.8 5C15.4 16.2 19.4 13.5 24 13.5c3.1 0 6 .9 8.2 2.6l6.2-6.2C34.6 6.6 29.6 4.5 24 4.5 16.7 4.5 10.1 9.2 6.3 14.7z" />
                            <path fill="#FBBC05" d="M24 45.5c5.6 0 10.6-1.9 14.4-5.2l-6.7-5.5C29.9 37.3 27.1 38.5 24 38.5c-6.3 0-11.7-3.8-13.8-9l-7.1 5.5C5.9 41.9 14.3 45.5 24 45.5z" />
                            <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1 2.6-3.4 4.8-6.4 5.3v7.1h10.5c6-5.5 9.5-13.7 9.5-22.2 0-1.3-.1-2.7-.5-4z" />
                        </g>
                    </svg>
                    Sign up with Google
                </button>
                <p className="mt-8 text-xs text-gray-400">
                    By continuing, you agree to our Terms and Privacy Policy.
                </p>
            </div>
        </div>
    );
};

export default Signup;
