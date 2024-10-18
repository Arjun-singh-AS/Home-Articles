import React from "react";

export default function signin1() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <section className="relative w-full h-full flex items-center justify-center gap-2 flex-wrap overflow-hidden">
                {[...Array(140)].map((_, index) => (
                    <span
                        key={index}
                        className="relative w-[6.25vw] h-[6.25vw] bg-gray-900 transition duration-150 ease-in-out hover:bg-yellow-500"
                    ></span>
                ))}

                <div className="absolute w-96 p-10 bg-gray-800 shadow-lg rounded-lg z-10 flex justify-center items-center">
                    <div className="w-full flex flex-col items-center gap-10">
                        <h2 className="text-2xl font-bold text-yellow-500 uppercase">Sign In</h2>
                        <div className="w-full flex flex-col gap-6">
                        <div className="relative w-full">
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring focus:ring-yellow-500"
                                />
                                <i className="absolute left-4 top-3 text-gray-400">Name</i>
                            </div>
                            <div className="relative w-full">
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring focus:ring-yellow-500"
                                />
                                <i className="absolute left-4 top-3 text-gray-400">Email</i>
                            </div>
                            <div className="relative w-full">
                                <input
                                    type="number"
                                    required
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring focus:ring-yellow-500"
                                />
                                <i className="absolute left-4 top-3 text-gray-400">Phone No.</i>
                            </div>
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring focus:ring-yellow-500"
                                />
                                <i className="absolute left-4 top-3 text-gray-400">Username</i>
                            </div>
                            <div className="relative w-full">
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring focus:ring-yellow-500"
                                />
                                <i className="absolute left-4 top-3 text-gray-400">Password</i>
                            </div>
                            <div className="flex justify-between w-full text-sm">
                                <a href="#" className="text-gray-400 hover:text-white">
                                    Forgot Password
                                </a>
                                <a href="/singup1" className="text-yellow-500 hover:underline">
                                    Signup
                                </a>
                            </div>
                            <div>
                                <input
                                    type="submit"
                                    value="Login"
                                    className="w-full py-2 text-black bg-yellow-500 hover:bg-yellow-600 font-semibold rounded-md cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    );
}