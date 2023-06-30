import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from 'axios';
const VITE_SERVERURL = import.meta.env.VITE_SERVERURL;

export default function LoginForm() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const loginUserPost = (formData: any) => {
        return axios.post('http://localhost:3000/v1/auth/loginWithIdAdmin', formData)
    }
    const handleUserLogin = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(""); // Clear previous error message
        try {
            const loginResponse = await loginUserPost({
                id: userId,
                password: password
            });
            setLoading(false);
            console.log(loginResponse.data);
            window.sessionStorage.setItem("access_token", loginResponse.data.tokens.access.token);
            window.sessionStorage.setItem("refresh_token", loginResponse.data.tokens.refresh.token);
            console.log(window.sessionStorage.getItem("access_token"));
            navigate("/admin/submissions");
        } catch (error: any | AxiosError) {
            setLoading(false);
            // console.error("Error logging in:", error);
            if (error?.response?.status === 401) {
                if (error?.response?.statusText.toLocaleLowerCase() === "Unauthorized".toLocaleLowerCase())
                    setErrorMessage("Authentication failed. Please sign in as admin"); // Set error message
            }
            else
                setErrorMessage("Authentication failed. Please check your credentials."); // Set error message
        }
    }
    return (
        <>
            <header className="mt-10 text-center text-lg  leading-9 tracking-tight text-gray-900">
                <h2> EMNLP 2023 EIGHTH CONFERENCE ON MACHINE TRANSLATION (WMT23)</h2>
                <h2> Shared Task: Low-Resource Indic Language Translation</h2>
                <h1 className="text-2xl font-bold"> Admin</h1>
            </header>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Log in to your account
                    </h2>
                </div>

                <div className=" sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleUserLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                User ID
                            </label>
                            <div className="mt-2">
                                <input
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    id="userId"
                                    name="userId"
                                    type="text"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Submit
                            </button>
                        </div>
                        {errorMessage && (
                            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                        )}
                    </form>
                </div>
            </div>
        </>
    )
}