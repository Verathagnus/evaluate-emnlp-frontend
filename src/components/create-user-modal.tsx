import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from 'axios';
import SelectSubmissionType from "./select-submission-type";
const VITE_SERVERURL = import.meta.env.VITE_SERVERURL;

export default function CreateUserModal({ onClose, onCreate }: any) {
    const [teamName, setName] = useState("");
    const [email, setEmail] = useState("");
    const roleTypes = [
        {
            id: 1,
            name: 'user',
        },
        {
            id: 2,
            name: 'admin',
        },
    ]
    const [role, setRole] = useState(roleTypes[0])
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const createUserPost = (formData: any) => {
        const access_token = window.sessionStorage.getItem("access_token");
        return axios.post(VITE_SERVERURL + '/v1/users', formData, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
    }
    const handleCreateUser = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(""); // Clear previous error message
        try {
            const createResponse = await createUserPost({
                teamName: teamName,
                email: email,
                password: password,
                role: role.name
            });
            setLoading(false);
            console.log(createResponse.data);
            onCreate();
        } catch (error: any | AxiosError) {
            setLoading(false);
            setErrorMessage("User Creation failed. " + error?.response?.data?.message); // Set error message
        }
    }
    return (
        <>
            <div className="w-full flex flex-row justify-end ">
                <button onClick={() => onClose()}><svg xmlns="http://www.w3.org/2000/svg" fill="teal" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                </button>
            </div>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-24">

                <div className="sm:mx-auto sm:w-full sm:w-md">

                    <h2 className="mt-10 text-center text-2xl font-semibold leading-9 tracking-tight text-gray-900">
                        Create a new user
                    </h2>
                    <p className="text-center   leading-9 tracking-tight  text-blue-500 text-md">
                        Enter {role.name === "user" ? "Team" : "User"} Name, Email and Password
                    </p>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:w-md">
                    <form className="space-y-6" onSubmit={handleCreateUser}>

                        <div>
                            <label htmlFor="submissionType" className="block text-sm font-medium leading-6 text-gray-900">
                                Select Role
                            </label>
                            <div className="mt-2">
                                <SelectSubmissionType optionTypes={roleTypes} selectedType={role} setSelectedType={setRole} />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                {role.name === "user" ? "Team" : "User"}  Name
                            </label>
                            <div className="mt-2">
                                <input
                                    value={teamName}
                                    onChange={(e) => setName(e.target.value)}
                                    id="teamName"
                                    name="teamName"
                                    type="text"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email
                            </label>
                            <div className="mt-2">
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    id="email"
                                    name="email"
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
                            <p className="text-red-500 text-sm mt-2 ">{errorMessage}</p>
                        )}
                        <div className="w-[20rem] h-1 bg-white"></div>
                    </form>
                </div>
            </div>
        </>
    )
}