import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import SelectSubmissionType from "./select-submission-type";
import SelectTranslationDirection from "./select-translation-direction";
import CustomFileInput from "./custom-file-upload-button";
import axios, { AxiosError } from "axios";
const VITE_SERVERURL = import.meta.env.VITE_SERVERURL;


export default function UploadReferenceForm({ onClose, onCreate }: any) {
    const [showModal, setShowModal] = useState(false);
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
            name: 'Kha-to-English',
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

    const navigate = useNavigate();
    const uploadReferenceFilePost = (formData: any) => {
        const access_token = window.sessionStorage.getItem("access_token");
        return axios.post(VITE_SERVERURL+"/v1/submissions/uploadReference", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${access_token}`
            }
        });
    }

    const refreshTokenPost = async () => {
        const refresh_token = window.sessionStorage.getItem("refresh_token");
        try {
            const response = await axios.post(VITE_SERVERURL+"/v1/auth/refresh-tokens", { refreshToken: refresh_token });
            window.sessionStorage.setItem("access_token", response.data.access.token);
            window.sessionStorage.setItem("refresh_token", response.data.refresh.token);
        }
        catch (err) {
            setShowModal(true);
            navigate("/admin");
        }
    }
    const handleUploadReferenceFile = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        // console.log(teamName, selectedSubmissionType["name"], selectedTranslationDirection["name"]);
        console.log("Selected File:", selectedFiles);
        const formData = new FormData();
        formData.append('submissionType', selectedSubmissionType["name"]);
        formData.append('translationDirection', selectedTranslationDirection["name"]);
        formData.append('selectedFile', selectedFiles[0]);
        var response;
        try {
            response = await uploadReferenceFilePost(formData);
            console.log(response.status);
            onCreate();
        }
        catch (err: any | AxiosError) {
            if (err?.response?.status === 401) {
                await refreshTokenPost();
                response = await uploadReferenceFilePost(formData);
                console.log(response.status)
            }
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
            <div className="flex min-h-full flex-1 flex-col justify-center px-6  lg:px-8 mt-5 sm:mx-auto sm:w-full sm:max-w-[50rem]">
            </div>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6  lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">

                    <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Upload Reference File
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleUploadReferenceFile}>
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
                                Select Reference File
                            </label>
                            <div className="mt-2">
                                <CustomFileInput selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Upload
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}