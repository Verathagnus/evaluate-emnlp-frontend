import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import SelectSubmissionType from "./select-submission-type";
import SelectTranslationDirection from "./select-translation-direction";
import CustomFileInput from "./custom-file-upload-button";
import axios, { AxiosError } from "axios";
import { Dialog } from "@headlessui/react";
import LoginFormModal from "./login-form-modal";
export default function EvaluationForm() {
    const [showModal, setShowModal] = useState(false);
    const [teamName, setTeamName] = useState("");
    const [submitMessage, setSubmitMessage] = useState("");

    const [result, setResult] = useState("");
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
            name: 'En-to-Mz',
        },
        {
            id: 4,
            name: 'Mz-to-En',
        },
        {
            id: 5,
            name: 'En-to-Kha',
        },
        {
            id: 6,
            name: 'Kha-to-En',
        },
        {
            id: 7,
            name: 'En-to-Mni',
        },
        {
            id: 8,
            name: 'Mni-to-En',
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
        return axios.post("http://localhost:3000/v1/submissions/evaluateSubmission", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${access_token}`
            }
        });
    }

    const saveResultPost = (formData: any) => {
        const access_token = window.sessionStorage.getItem("access_token");
        return axios.post("http://localhost:3000/v1/submissions/saveSubmission", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${access_token}`
            }
        });
    }

    const refreshTokenPost = async () => {
        const refresh_token = window.sessionStorage.getItem("refresh_token");
        try {
            const response = await axios.post("http://localhost:3000/v1/auth/refresh-tokens", { refreshToken: refresh_token });
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
        console.log("Selected File:", selectedFiles);
        const formData = new FormData();
        formData.append('teamName', teamName);
        formData.append('submissionType', selectedSubmissionType["name"]);
        formData.append('translationDirection', selectedTranslationDirection["name"]);
        formData.append('selectedFile', selectedFiles[0]);
        var response;
        try {
            response = await evaluateResultPost(formData);
            console.log(response.status)
            const { teamName: teamNameR, submissionType, languageDirection, BLEU, Chrf2, ribes_score, ter_score } = response.data;
            setResult(`${teamNameR}\n${submissionType}\n${languageDirection}\n\nBLEU: ${BLEU}\nChrf2: ${Chrf2}\nRIBES: ${ribes_score}\nTER ${ter_score}`);
            scrollToBottom();
        }
        catch (err: any | AxiosError) {
            if (err?.response?.status === 401) {
                await refreshTokenPost();
                response = await evaluateResultPost(formData);
                // const { teamName, submissionType, languageDirection, BLEU, Chrf2, ribes_score, ter_score } = response.data;
                // setResult(`${teamName}\n${submissionType}\n${languageDirection}\n\nBLEU: ${BLEU}\nChrf2: ${Chrf2}\nRIBES: ${ribes_score}\nTER ${ter_score}`);
                console.log(response.status)
                const { teamName: teamNameR, submissionType, languageDirection, BLEU, Chrf2, ribes_score, ter_score } = response.data;
                setResult(`${teamNameR}\n${submissionType}\n${languageDirection}\n\nBLEU: ${BLEU}\nChrf2: ${Chrf2}\nRIBES: ${ribes_score}\nTER ${ter_score}`);
                scrollToBottom();
            }
        }


    }

    const handleSubmitResult = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        // console.log(teamName, selectedSubmissionType["name"], selectedTranslationDirection["name"]);
        console.log("Selected File:", selectedFiles);
        const formData = new FormData();
        formData.append('teamName', teamName);
        formData.append('submissionType', selectedSubmissionType["name"]);
        formData.append('translationDirection', selectedTranslationDirection["name"]);
        formData.append('selectedFile', selectedFiles[0]);

        try {
            var response = await saveResultPost(formData);
            console.log(response.status)
            console.log(response.status)
            const { teamName: teamNameR, submissionType, languageDirection, BLEU, Chrf2, ribes_score, ter_score } = response.data;
            setResult(`${teamNameR}\n${submissionType}\n${languageDirection}\n\nBLEU: ${BLEU}\nChrf2: ${Chrf2}\nRIBES: ${ribes_score}\nTER ${ter_score}`);
            setSubmitMessage("Result has been saved");
        }
        catch (err: any | AxiosError) {
            if (err?.response?.status === 500) {
                setSubmitMessage("Submission Failed");
                // const { teamName, submissionType, languageDirection, BLEU, Chrf2, ribes_score, ter_score } = response.data;
                // setResult(`${teamName}\n${submissionType}\n${languageDirection}\n\nBLEU: ${BLEU}\nChrf2: ${Chrf2}\nRIBES: ${ribes_score}\nTER ${ter_score}`);
            }
            if (err?.response?.status === 401) {
                await refreshTokenPost();
                response = await saveResultPost(formData);
                // const { teamName, submissionType, languageDirection, BLEU, Chrf2, ribes_score, ter_score } = response.data;
                // setResult(`${teamName}\n${submissionType}\n${languageDirection}\n\nBLEU: ${BLEU}\nChrf2: ${Chrf2}\nRIBES: ${ribes_score}\nTER ${ter_score}`);
                console.log(response.status)
                const { teamName: teamNameR, submissionType, languageDirection, BLEU, Chrf2, ribes_score, ter_score } = response.data;
                setResult(`${teamNameR}\n${submissionType}\n${languageDirection}\n\nBLEU: ${BLEU}\nChrf2: ${Chrf2}\nRIBES: ${ribes_score}\nTER ${ter_score}`);
                setSubmitMessage("Result has been saved");
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
                        <div>
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
                        </div>

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
                    <form className="space-y-6" onSubmit={handleSubmitResult}>
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
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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