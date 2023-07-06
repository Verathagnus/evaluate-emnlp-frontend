import React, { useState, useEffect, useRef, MouseEventHandler, ReactEventHandler } from "react"
import { useNavigate } from "react-router-dom";
import SelectSubmissionType from "./select-submission-type";
import SelectTranslationDirection from "./select-translation-direction";
import CustomFileInput from "./custom-file-upload-button";
import axios, { AxiosError } from "axios";
import { Dialog, Transition } from "@headlessui/react";
import LoginFormModal from "./login-form-modal";
const VITE_SERVERURL = import.meta.env.VITE_SERVERURL;
const httpClient = axios.create();

httpClient.defaults.timeout = 10000;

export default function EvaluationForm() {
    const [showModal, setShowModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [fileContent, setFileContent] = useState('');
    const openModal = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };
    // const [teamName, setTeamName] = useState("");
    const [submitMessage, setSubmitMessage] = useState("");

    const [result, setResult] = useState("");
    const [systemDescription, setSystemDescription] = useState("");
    const submissionTypes = [
        {
            id: 1,
            name: 'PRIMARY',
        },
        {
            id: 2,
            name: 'CONTRASTIVE-1',
        },
        {
            id: 3,
            name: 'CONTRASTIVE-2',
        },
    ]
    const [selectedSubmissionType, setSelectedSubmissionType] = useState(submissionTypes[0])

    const translationDirectionOptions = [
        {
            id: 1,
            name: 'English-to-Assamese',
        },
        {
            id: 2,
            name: 'Assamese-to-English',
        },
        {
            id: 3,
            name: 'English-to-Mizo',
        },
        {
            id: 4,
            name: 'Mizo-to-English',
        },
        {
            id: 5,
            name: 'English-to-Khasi',
        },
        {
            id: 6,
            name: 'Khasi-to-English',
        },
        {
            id: 7,
            name: 'English-to-Manipuri',
        },
        {
            id: 8,
            name: 'Manipuri-to-English',
        },
    ]
    const [selectedTranslationDirection, setSelectedTranslationDirection] = useState(translationDirectionOptions[0]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const formEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        formEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const navigate = useNavigate();
    const evaluateResultPost = (formData: any) => {
        const access_token = window.sessionStorage.getItem("access_token");
        return httpClient.post(VITE_SERVERURL + "/v1/submissions/evaluateSubmission", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${access_token}`
            }
        });
    }

    const saveResultPost = (formData: any) => {
        const access_token = window.sessionStorage.getItem("access_token");
        return httpClient.post(VITE_SERVERURL + "/v1/submissions/saveSubmission", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${access_token}`
            }
        });
    }

    const refreshTokenPost = async () => {
        const refresh_token = window.sessionStorage.getItem("refresh_token");
        try {
            const response = await httpClient.post(VITE_SERVERURL + "/v1/auth/refresh-tokens", { refreshToken: refresh_token });
            window.sessionStorage.setItem("access_token", response.data.access.token);
            window.sessionStorage.setItem("refresh_token", response.data.refresh.token);
        }
        catch (err) {
            setShowModal(true);
        }
    }
    const handleEvaluateResult = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        // console.log(teamName, selectedSubmissionType["name"], selectedTranslationDirection["name"]);
        if(selectedFiles.length === 0){
            setSubmitMessage(`Please upload a file`);
            scrollToBottom();
            return;
        }
        console.log("Selected File:", selectedFiles);
        const formData = new FormData();
        // formData.append('teamName', teamName);
        formData.append('submissionType', selectedSubmissionType["name"]);
        formData.append('translationDirection', selectedTranslationDirection["name"]);
        formData.append('selectedFile', selectedFiles[0]);
        var response;
        try {
            response = await evaluateResultPost(formData);
            // console.log(response.status)
            const { teamName: teamNameR, submissionType, languageDirection, BLEU, Chrf2, ribes_score, ter_score } = response.data;
            setResult(`${teamNameR}\n${submissionType}\n${languageDirection}\n\nBLEU: ${BLEU}\nChrf2: ${Chrf2}\nRIBES: ${ribes_score}\nTER: ${ter_score}`);
            scrollToBottom();
        }
        catch (err: any | AxiosError) {
            if (err?.response?.status === 401) {
                await refreshTokenPost();
                response = await evaluateResultPost(formData);
                // const { teamName, submissionType, languageDirection, BLEU, Chrf2, ribes_score, ter_score } = response.data;
                // setResult(`${teamName}\n${submissionType}\n${languageDirection}\n\nBLEU: ${BLEU}\nChrf2: ${Chrf2}\nRIBES: ${ribes_score}\nTER: ${ter_score}`);
                console.log(response.status)
                const { teamName: teamNameR, submissionType, languageDirection, BLEU, Chrf2, ribes_score, ter_score } = response.data;
                setResult(`${teamNameR}\n${submissionType}\n${languageDirection}\n\nBLEU: ${BLEU}\nChrf2: ${Chrf2}\nRIBES: ${ribes_score}\nTER: ${ter_score}`);
                scrollToBottom();
            }
            if (err?.response?.status === 500) {
                setResult(`Check number of lines of file uploaded`);
                scrollToBottom();
            }
        }


    }

    const handleSubmitResult = async (e: any) => {
        // e.preventDefault()
        closeModal();
        // console.log(teamName, selectedSubmissionType["name"], selectedTranslationDirection["name"]);
        if(selectedFiles.length === 0){
            setSubmitMessage(`Please upload a file`);
            scrollToBottom();
            return;
        }
        console.log("Selected File:", selectedFiles);
        const formData = new FormData();
        // formData.append('teamName', teamName);
        formData.append('submissionType', selectedSubmissionType["name"]);
        formData.append('translationDirection', selectedTranslationDirection["name"]);
        formData.append('systemDescription', systemDescription);
        formData.append('selectedFile', selectedFiles[0]);

        try {
            var response = await saveResultPost(formData);
            console.log(response.status)
            console.log(response.status)
            const { teamName: teamNameR, submissionType, languageDirection, BLEU, Chrf2, ribes_score, ter_score } = response.data;
            setResult(`${teamNameR}\n${submissionType}\n${languageDirection}\n\nBLEU: ${BLEU}\nChrf2: ${Chrf2}\nRIBES: ${ribes_score}\nTER: ${ter_score}`);
            setSubmitMessage("Result has been saved");
        }
        catch (err: any | AxiosError) {
            if (err?.response?.status === 500) {
                setSubmitMessage(err?.response?.data?.message);
                // const { teamName, submissionType, languageDirection, BLEU, Chrf2, ribes_score, ter_score } = response.data;
                // setResult(`${teamName}\n${submissionType}\n${languageDirection}\n\nBLEU: ${BLEU}\nChrf2: ${Chrf2}\nRIBES: ${ribes_score}\nTER: ${ter_score}`);
            }
            if (err?.response?.status === 401) {
                await refreshTokenPost();
                response = await saveResultPost(formData);
                // const { teamName, submissionType, languageDirection, BLEU, Chrf2, ribes_score, ter_score } = response.data;
                // setResult(`${teamName}\n${submissionType}\n${languageDirection}\n\nBLEU: ${BLEU}\nChrf2: ${Chrf2}\nRIBES: ${ribes_score}\nTER: ${ter_score}`);
                console.log(response.status)
                const { teamName: teamNameR, submissionType, languageDirection, BLEU, Chrf2, ribes_score, ter_score } = response.data;
                setResult(`${teamNameR}\n${submissionType}\n${languageDirection}\n\nBLEU: ${BLEU}\nChrf2: ${Chrf2}\nRIBES: ${ribes_score}\nTER: ${ter_score}`);
                setSubmitMessage("Result has been saved");
            }
            if (err?.response?.status === 400) {
                setSubmitMessage(err?.response?.data?.message);
            }

        }


    }


    return (
        <>
            {showModal && (
                <Dialog open={showModal} onClose={() => setShowModal(false)}>
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                    <div className="fixed inset-0 flex items-center justify-center">
                        <div className="bg-white p-6">
                            <LoginFormModal onClose={() => setShowModal(false)} />
                        </div>
                    </div>
                </Dialog>
            )}
            <Transition.Root show={isOpen} as={React.Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    onClose={closeModal}
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
                                    Warning
                                </Dialog.Title>
                                <div className="px-6 py-4 whitespace-pre-line ">
                                    <p className="text-gray-800 overflow-scroll break-all whitespace-pre-line ">You can only submit once for {`${selectedSubmissionType.name} Submission Type and ${selectedTranslationDirection.name} Language Direction`}</p>
                                </div>
                                <div className="flex justify-between items-center px-6 py-4 bg-gray-100">
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-red-500 rounded-lg text-white font-bold"
                                        onClick={handleSubmitResult}
                                    >
                                        Submit
                                    </button>
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-indigo-500 rounded-lg text-white font-bold"
                                        onClick={closeModal}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6  lg:px-8 mt-5 sm:mx-auto sm:w-full sm:max-w-[50rem]">

                <header className=" text-center text-lg  leading-9 tracking-tight text-gray-900 ">
                    <h2> EMNLP 2023 EIGHTH CONFERENCE ON MACHINE TRANSLATION (WMT23)</h2>
                    <h2> Shared Task: Low-Resource Indic Language Translation</h2>
                    {/* <h1 className="text-2xl font-bold"> Evaluation</h1> */}
                    <div className="flex justify-between my-5">
                        <button className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={() => {
                            navigate("/submissions");
                        }}>View Submissions</button>
                        <button className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={() => {
                            window.sessionStorage.removeItem("access_token");
                            navigate("/");
                        }}>Logout</button>

                    </div>
                    <p className="text-red-600">For each Language Direction, You can submit result only once for each of the PRIMARY, CONTRASTIVE-1, CONTRASTIVE-2 submission types.</p>
                </header>
            </div>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6  lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">

                    <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Evaluate Model Output Here
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleEvaluateResult}>
                        {/* <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Team Name
                            </label>
                            <div className="mt-2">
                                <input
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    id="teamName"
                                    name="teamName"
                                    type="text"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div> */}

                        <div>
                            <label htmlFor="submissionType" className="block text-sm font-medium leading-6 text-gray-900">
                                Select Submission Type
                            </label>
                            <div className="mt-2">
                                <SelectSubmissionType optionTypes={submissionTypes} selectedType={selectedSubmissionType} setSelectedType={setSelectedSubmissionType} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="translationDirection" className="block text-sm font-medium leading-6 text-gray-900">
                                Select Translation Direction
                            </label>
                            <div className="mt-2">
                                <SelectTranslationDirection optionTypes={translationDirectionOptions} selectedType={selectedTranslationDirection} setSelectedType={setSelectedTranslationDirection} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Select System Output File
                            </label>
                            <div className="mt-2">
                                {/* <input className="py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 h-full " id="file_input" type="file"/> */}
                                <CustomFileInput selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Evaluate
                            </button>
                        </div>

                    </form>
                </div>
            </div>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 mb-10 lg:px-8 ">
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={openModal}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Result
                            </label>
                            <div className="mt-2">
                                <textarea
                                    rows={4}
                                    id="result"
                                    name="result"
                                    required
                                    value={result}
                                    disabled
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Write about system description and dataset used (within 50 words)
                            </label>
                            <div className="mt-2">
                                <textarea
                                    rows={4}
                                    id="result"
                                    name="result"
                                    required
                                    value={systemDescription}
                                    onChange={(e) => setSystemDescription(e.target.value)}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                            >
                                Submit Result
                            </button>
                        </div>
                        <div ref={formEndRef} />
                        {submitMessage && (
                            <p className="text-red-500 text-sm mt-2 ">{submitMessage}</p>
                        )}

                    </form>
                </div>
            </div>
        </>
    )
}
