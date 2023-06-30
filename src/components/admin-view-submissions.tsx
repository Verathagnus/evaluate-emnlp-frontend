import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from "axios";
// import { Dialog } from "@headlessui/react";
// import LoginFormModal from "./login-form-modal";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from '../store';
import { setCurrentVS } from '../store/navigationMenu/navigation';
import Table, { CategoryCell, DownloadPDFIngredient, SelectDateFilter, TimeCell } from './table/table';
const VITE_SERVERURL = import.meta.env.VITE_SERVERURL;

const ViewSubmissionsAdmin = () => {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortType, setSortType] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    // const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const fetchSubmissionsAllPost = async () => {
        const access_token = window.sessionStorage.getItem("access_token");
        return axios.post(VITE_SERVERURL+"/v1/submissions/fetchSubmissionsAll", {}, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
    }
    const setSubmissionsData = async () => {
        try {
            setIsLoading(true);
            const response = await fetchSubmissionsAllPost();
            // const data = await response.json();
            console.log(response.data);
            setSubmissions(response.data);
            setIsLoading(false);
        } catch (err: any | AxiosError) {
            if (err?.response?.status === 401) {
                navigate("/admin");
            }
        }
        finally {
            setIsLoading(false);
        }
    }

    const fetchSubmissionsAll = async () => {
        try {
            await setSubmissionsData();
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const dispatch = useAppDispatch();
    useEffect(() => {
        fetchSubmissionsAll();
        dispatch(setCurrentVS())

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

    const columns = React.useMemo(
        () => [
            // {
            //     Header: "Category",
            //     accessor: "category",
            //     Cell: CategoryCell,
            //     Filter: SelectDateFilter,
            //     filter: 'includes',
            // },
            // {
            //     Header: "Time To Cook",
            //     accessor: "timeToCook",
            //     Cell: TimeCell
            // },
            // {
            //     Header: "Image",
            //     accessor: "uploadedRecipeImageFileName",
            //     Cell: DownloadPDFIngredient,
            //     flagAccessor: "uploadedRecipeImageFlag",
            // },
            {
                Header: 'User ID',
                accessor: 'userId',
            },
            {
                Header: 'Team Name',
                accessor: 'teamName', // accessor is the "key" in the data
            },
            {
                Header: 'Submission Type',
                accessor: 'submissionType',
            },
            {
                Header: 'Language Direction',
                accessor: 'languageDirection',
            },
            {
                Header: 'BLEU',
                accessor: 'BLEU',
            },
            {
                Header: 'Chrf2',
                accessor: 'Chrf2',
            },
            {
                Header: 'RIBES',
                accessor: 'ribes_score',
            },
            {
                Header: 'TER',
                accessor: 'ter_score',
            },
            {
                Header: 'Date Submitted',
                accessor: 'dateCreated',
                Cell: ({ value }: any) => new Date(value).toLocaleString(),
            },
        ],
        []
    );

    return (
        <>
            {/* 
                {showModal && (
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
                // sortedSubmissions.map((submission) => (
                //     <Submission key={submission.id} {...submission} />
                // ))
                <div className="">
                    <div className="">
                        <Table columns={columns} data={sortedSubmissions} />
                    </div>
                </div>
            )}
        </>
    );
};

export default ViewSubmissionsAdmin;
