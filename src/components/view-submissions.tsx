import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from "axios";
// import { Dialog } from "@headlessui/react";
// import LoginFormModal from "./login-form-modal";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from '@headlessui/react';
const VITE_SERVERURL = import.meta.env.VITE_SERVERURL;

const Submission = ({
    teamName,
    submissionType,
    languageDirection,
    BLEU,
    Chrf2,
    ribes_score,
    ter_score,
    dateCreated,
    systemDescription,
    selectedFile
}: any) => {
    const [isOpen1, setIsOpen1] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [fileContent1, setFileContent1] = useState('');
    const [fileContent2, setFileContent2] = useState('');

    const openModal1 = (fileContent: string) => {
        setIsOpen1(true);
        setFileContent1(fileContent);
    };

    const openModal2 = (fileContent: string) => {
        setIsOpen2(true);
        setFileContent2(fileContent);
    };

    const closeModal1 = () => {
        setIsOpen1(false);
        setFileContent1('');
    };

    const closeModal2 = () => {
        setIsOpen2(false);
        setFileContent2('');
    };

    const downloadFile1 = () => {
        const element = document.createElement('a');
        const file = new Blob([fileContent1], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = submissionType + "_" + languageDirection + "_" + "UploadedFile" + ".txt";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const downloadFile2 = () => {
        const element = document.createElement('a');
        const file = new Blob([fileContent2], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = submissionType + "_" + languageDirection + "_" + "SystemDescription" + ".txt";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="bg-purple-100 shadow-md rounded-lg p-4 mb-4">
            <h2 className="text-lg font-bold">{teamName}</h2>
            <p className="text-purple-800">
                <strong>Submission Type:</strong> <span className="text-black">{submissionType}</span>
            </p>
            <p className="text-purple-800">
                <strong>Language Direction:</strong> <span className="text-black">{languageDirection}</span>
            </p>
            <p className="text-purple-800">
                <strong>BLEU:</strong> <span className="text-black">{BLEU}</span>
            </p>
            <p className="text-purple-800">
                <strong>Chrf2:</strong> <span className="text-black">{Chrf2}</span>
            </p>
            <p className="text-purple-800">
                <strong>RIBES:</strong> <span className="text-black">{ribes_score}</span>
            </p>
            <p className="text-purple-800">
                <strong>TER:</strong> <span className="text-black">{ter_score}</span>
            </p>
            <p className="text-purple-800">
                <strong>Date Submitted:</strong> <span className="text-black">{dateFormat(dateCreated)}</span>
            </p>
            <p className="text-purple-800">
                <strong>System Description:</strong> <span className="px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm ml-3 bg-purple-800 text-white">
                    <button type="button" onClick={() => openModal1(systemDescription)}>
                        View
                    </button>
                </span>
            </p>
            <p className="text-purple-800">
                <strong>Uploaded File:</strong> <span className="px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm ml-3 bg-purple-800 text-white">
                    <button type="button" onClick={() => openModal2(selectedFile)}>
                        View
                    </button>
                </span>
            </p>
            <Transition.Root show={isOpen1} as={React.Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    onClose={closeModal1}
                >
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                        </Transition.Child>

                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="relative bg-white  w-[60rem] max-w-md mx-auto my-6">
                                <Dialog.Title className="text-lg font-bold mt-4 mx-6">
                                    System Description
                                </Dialog.Title>
                                <div className="px-6 py-4 whitespace-pre-line ">
                                    <p className="text-gray-800 overflow-scroll break-all whitespace-pre-line ">{fileContent1}</p>
                                </div>
                                <div className="flex justify-between items-center px-6 py-4 bg-gray-100">
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-gray-300 rounded-lg text-gray-800 font-bold"
                                        onClick={downloadFile1}
                                    >
                                        Download
                                    </button>
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-red-500 rounded-lg text-white font-bold"
                                        onClick={closeModal1}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
            <Transition.Root show={isOpen2} as={React.Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    onClose={closeModal2}
                >
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                        </Transition.Child>

                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="relative bg-white  w-[60rem] max-w-md mx-auto my-6">
                                <Dialog.Title className="text-lg font-bold mt-4 mx-6">
                                    Uploaded File
                                </Dialog.Title>
                                <div className="px-6 py-4 whitespace-pre-line ">
                                    <p className="text-gray-800 overflow-scroll break-all whitespace-pre-line ">{fileContent2}</p>
                                </div>
                                <div className="flex justify-between items-center px-6 py-4 bg-gray-100">
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-gray-300 rounded-lg text-gray-800 font-bold"
                                        onClick={downloadFile2}
                                    >
                                        Download
                                    </button>
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-red-500 rounded-lg text-white font-bold"
                                        onClick={closeModal2}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
};

const dateFormat = (dateCreated: string) => {
    return new Date(dateCreated).toLocaleString();
}

const ViewSubmissions = () => {
    const [submissions, setSubmissions] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortType, setSortType] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    // const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const fetchSubmissionsPost = async () => {
        const access_token = window.sessionStorage.getItem("access_token");
        return axios.post(VITE_SERVERURL + "/v1/submissions/fetchSubmissions", {}, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
    }
    const setSubmissionsData = async () => {
        try {
            setIsLoading(true);
            const response = await fetchSubmissionsPost();
            // const data = await response.json();
            console.log(response.data);
            setSubmissions(response.data.results);
            setIsLoading(false);
        } catch (err: any | AxiosError) {
            if (err?.response?.status === 401) {
                navigate("/");
            }
        }
        finally {
            setIsLoading(false);
        }
    }

    const fetchSubmissions = async () => {
        try {
            await setSubmissionsData();
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const handleSearchTermChange = (e: any) => {
        setSearchTerm(e.target.value);
    };

    const handleSortTypeChange = (e: any) => {
        setSortType(e.target.value);
    };

    const filteredSubmissions = submissions.filter((submission: any) =>
        submission.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.submissionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.languageDirection.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.BLEU.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.Chrf2.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.ribes_score.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.ter_score.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
        if (sortType === 'teamName') {
            return a.teamName.localeCompare(b.teamName);
        }
        else if (sortType === 'submissionType') {
            return a.submissionType.localeCompare(b.submissionType);
        }
        else if (sortType === 'languageDirection') {
            return a.languageDirection.localeCompare(b.languageDirection);
        }
        else if (sortType === 'BLEU') {
            return a.BLEU.localeCompare(b.BLEU);
        }
        else if (sortType === 'Chrf2') {
            return a.Chrf2.localeCompare(b.Chrf2);
        }
        else if (sortType === 'ribes_score') {
            return a.ribes_score.localeCompare(b.ribes_score);
        }
        else if (sortType === 'ter_score') {
            return a.ter_score.localeCompare(b.ter_score);
        }
        else if (sortType === 'dateCreated') {
            return Date.parse(a.dateCreated).valueOf() - Date.parse(b.dateCreated).valueOf();
        }
        // Add more sort options if needed
        return 0;
    });

    return (
        <>
            {/* {showModal && (
                <Dialog open={showModal} onClose={() => { setShowModal(false); setSubmissionsData(); }}>
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                    <div className="fixed inset-0 flex items-center justify-center">
                        <div className="bg-white p-6">
                            <LoginFormModal onClose={() => { setShowModal(false); setSubmissionsData; }} />
                        </div>
                    </div>
                </Dialog>
            )} */}
            <div className="flex min-h-full flex-1 flex-col justify-center px-6  lg:px-8 my-5 sm:mx-auto sm:w-full sm:max-w-[50rem]">
                <header className=" text-center text-lg  leading-9 tracking-tight text-gray-900">
                    <h2> EMNLP 2023 EIGHTH CONFERENCE ON MACHINE TRANSLATION (WMT23)</h2>
                    <h2> Shared Task: Low-Resource Indic Language Translation</h2>
                    {/* <h1 className="text-2xl font-bold"> Evaluation</h1> */}

                    <div className="flex justify-between my-5">
                        <button className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={() => {
                            navigate("/evaluate");
                        }}>Add Submission</button>
                        <button className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={() => {
                            window.sessionStorage.removeItem("access_token");
                            navigate("/");
                        }}>Logout</button>

                    </div>
                </header>
                <div className="flex flex-row justify-between">
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search"
                            className="px-4 py-2 border border-gray-300 rounded-md"
                            value={searchTerm}
                            onChange={handleSearchTermChange}
                        />
                    </div>

                    <div className="mb-4">
                        <select
                            className="pl-8 py-2 border border-gray-300 rounded-md"
                            value={sortType}
                            onChange={handleSortTypeChange}
                        >
                            <option value="">Sort By</option>
                            <option value="teamName">Team Name</option>
                            <option value="submissionType">Submission Type</option>
                            <option value="languageDirection">Language Direction</option>
                            <option value="BLEU">BLEU</option>
                            <option value="Chrf2">Chrf2</option>
                            <option value="ribes_score">RIBES</option>
                            <option value="ter_score">TER</option>
                            <option value="dateCreated">Date Submitted</option>
                            {/* Add more sort options if needed */}
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="absolute h-screen flex justify-center items-center text-center py-4 top-0 left-0 w-screen"><div role="status">
                        <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div></div>
                ) : (
                    sortedSubmissions.map((submission) => (
                        <Submission key={submission.id} {...submission} />
                    ))
                )}
            </div>
        </>
    );
};

export default ViewSubmissions;
