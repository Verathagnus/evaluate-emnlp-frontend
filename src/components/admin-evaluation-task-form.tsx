import React, {
  useState,
  useEffect,
  useRef,
  MouseEventHandler,
  ReactEventHandler,
} from 'react'
import { useNavigate } from 'react-router-dom'
import SelectSubmissionType from './select-submission-type'
import SelectTranslationDirection from './select-translation-direction'
import CustomFileInput from './custom-file-upload-button'
import axios, { AxiosError } from 'axios'
import { Dialog, Transition } from '@headlessui/react'
import LoginFormModal from './login-form-modal'
const VITE_SERVERURL = import.meta.env.VITE_SERVERURL
const httpClient = axios.create()

httpClient.defaults.timeout = 10000

export default function AdminEvaluationTaskForm({ onClose, onCreate }: any) {
  const [showModal, setShowModal] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [fileContent, setFileContent] = useState('')
  const openModal = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsOpen(true)
  }
  const navigate = useNavigate()

  const closeModal = () => {
    setIsOpen(false)
  }
  const [teamName, setTeamName] = useState('')
  //   const [submitMessage, setErrorMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [result, setResult] = useState('')
  const [systemDescription, setSystemDescription] = useState('')
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
  const [selectedTranslationDirection, setSelectedTranslationDirection] =
    useState(translationDirectionOptions[0])
  const [predictedFiles, setPredictedFiles] = useState<File[]>([])
  const [referenceFiles, setReferenceFiles] = useState<File[]>([])

  const formEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    formEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const evaluateCreateTaskPost = (formData: any) => {
    const access_token = window.sessionStorage.getItem('access_token')
    return httpClient.post(
      VITE_SERVERURL + '/v1/humanEvaluations/createEvaluationTask',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
  }

  const refreshTokenPost = async () => {
    const refresh_token = window.sessionStorage.getItem('refresh_token')
    try {
      const response = await httpClient.post(
        VITE_SERVERURL + '/v1/auth/refresh-tokens',
        { refreshToken: refresh_token }
      )
      window.sessionStorage.setItem('access_token', response.data.access.token)
      window.sessionStorage.setItem(
        'refresh_token',
        response.data.refresh.token
      )
    } catch (err) {
        navigate("/admin");
    }
  }
  const countLinesFile = async (file: File) => {
    const CHUNK_SIZE = 1024 * 1024;
    const decoder = new TextDecoder();
    let lineCount = 0;
    let offset = 0;
  
    while (offset < file.size) {
      const chunk = file.slice(offset, offset + CHUNK_SIZE);
      const buffer = await chunk.arrayBuffer();
      const text = decoder.decode(buffer);
      const newLines = text.match(/\n/g);
      lineCount += newLines ? newLines.length : 0;
      offset += CHUNK_SIZE;
    }
  
    return lineCount + 1;
  };
  

  const handleSubmitResult = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    const predFileLines = await countLinesFile(predictedFiles[0]);
    const refFileLines = await countLinesFile(referenceFiles[0]);
    if(predFileLines !== refFileLines){
      setErrorMessage("Number of lines in predicted file is "+predFileLines+" and in reference file is "+refFileLines+"\nPlease check");
      return;
    }
    // console.log(teamName, selectedSubmissionType["name"], selectedTranslationDirection["name"]);
    if (predictedFiles.length === 0) {
      setErrorMessage(`Please upload a predicted file`)
      scrollToBottom()
      return
    }
    if (referenceFiles.length === 0) {
      setErrorMessage(`Please upload a reference file`)
      scrollToBottom()
      return
    }
    console.log('Selected File:', predictedFiles)
    const formData = new FormData()
    formData.append('teamName', teamName)
    // formData.append('submissionType', selectedSubmissionType['name'])
    formData.append(
      'translationDirection',
      selectedTranslationDirection['name']
    )
    formData.append('predictedFile', predictedFiles[0])
    formData.append('referenceFile', referenceFiles[0])
    var response
    try {
      response = await evaluateCreateTaskPost(formData)
      console.log(response.data)
      onCreate()
    } catch (err: any | AxiosError) {
      if (err?.response?.status === 401) {
        refreshTokenPost();
      } else {
        setErrorMessage('Task Creation failed. ' + err?.response?.data?.message) // Set error message
      }
    }
  }

  return (
    <div className="">
      <div className="flex w-full flex-row justify-end ">
        <button onClick={() => onClose()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="teal"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="h-8 w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
        <div className="sm:w-md sm:mx-auto sm:w-full ">
          <h2 className="mt-10 text-center text-2xl font-semibold leading-9 tracking-tight text-gray-900">
            Create a new task
          </h2>
          <p className="text-md whitespace-pre-line break-all text-center leading-9 tracking-tight text-blue-500 sm:w-full sm:max-w-sm">
            Enter Team Name, Language Direction, Predicted File and Reference
            File
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmitResult}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
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
              <label
                htmlFor="translationDirection"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Select Translation Direction
              </label>
              <div className="mt-2">
                <SelectTranslationDirection
                  optionTypes={translationDirectionOptions}
                  selectedType={selectedTranslationDirection}
                  setSelectedType={setSelectedTranslationDirection}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Select Predicted File
              </label>
              <div className="mt-2">
                {/* <input className="py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 h-full " id="file_input" type="file"/> */}
                <CustomFileInput
                  selectedFiles={predictedFiles}
                  setSelectedFiles={setPredictedFiles}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Select Reference File
              </label>
              <div className="mt-2">
                {/* <input className="py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 h-full " id="file_input" type="file"/> */}
                <CustomFileInput
                  selectedFiles={referenceFiles}
                  setSelectedFiles={setReferenceFiles}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Create Task
              </button>
            </div>
          </form>
          {errorMessage && (
            <p className="mt-2 text-sm text-red-500 ">{errorMessage}</p>
          )}
          <div className="h-1 w-[20rem] bg-white"></div>
        </div>
      </div>
    </div>
  )
}
