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

httpClient.defaults.timeout = 50000

export default function EvaluationForm() {
  const [showModal, setShowModal] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [fileContent, setFileContent] = useState('')
  const [loading, setLoading] = useState(false)
  const openModal = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }
  // const [teamName, setTeamName] = useState("");
  const [submitMessage, setSubmitMessage] = useState('')

  const [result, setResult] = useState('')
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
  const [selectedSubmissionType, setSelectedSubmissionType] = useState(
    submissionTypes[0]
  )

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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [systemDescription, setSystemDescription] = useState<File[]>([])
  const formEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    formEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const navigate = useNavigate()
  const evaluateResultPost = (formData: any) => {
    const access_token = window.sessionStorage.getItem('access_token')
    return httpClient.post(
      VITE_SERVERURL + '/v1/submissions/evaluateSubmission',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
  }

  const saveResultPost = (formData: any) => {
    const access_token = window.sessionStorage.getItem('access_token')
    return httpClient.post(
      VITE_SERVERURL + '/v1/submissions/saveSubmission',
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
      setShowModal(true)
    }
  }
  const handleEvaluateResult = async (
    e: React.ChangeEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    setLoading(true)
    setSubmitMessage(``)

    // console.log(teamName, selectedSubmissionType["name"], selectedTranslationDirection["name"]);
    if (selectedFiles.length === 0) {
      setSubmitMessage(`Please upload a text file`)
      scrollToBottom()
      setLoading(false)
      return
    }
    if (selectedFiles[0].type != 'text/plain') {
      setSubmitMessage(`Please upload a text file`)
      scrollToBottom()
      setLoading(false)
      return
    }
    console.log('Selected File:', selectedFiles)
    const formData = new FormData()
    // formData.append('teamName', teamName);
    formData.append('submissionType', selectedSubmissionType['name'])
    formData.append(
      'translationDirection',
      selectedTranslationDirection['name']
    )
    formData.append('selectedFile', selectedFiles[0])
    var response
    try {
      response = await evaluateResultPost(formData)
      // console.log(response.status)
      const {
        teamName: teamNameR,
        submissionType,
        languageDirection,
        BLEU,
        Chrf2,
        ribes_score,
        ter_score,
      } = response.data
      setResult(
        `${teamNameR}\n${submissionType}\n${languageDirection}\n\nBLEU: ${BLEU}\nChrf2: ${Chrf2}\nRIBES: ${ribes_score}\nTER: ${ter_score}`
      )
      scrollToBottom()
    } catch (err: any | AxiosError) {
      if (err?.response?.status === 401) {
        await refreshTokenPost()
        response = await evaluateResultPost(formData)
        // const { teamName, submissionType, languageDirection, BLEU, Chrf2, ribes_score, ter_score } = response.data;
        // setResult(`${teamName}\n${submissionType}\n${languageDirection}\n\nBLEU: ${BLEU}\nChrf2: ${Chrf2}\nRIBES: ${ribes_score}\nTER: ${ter_score}`);
        console.log(response.status)
        const {
          teamName: teamNameR,
          submissionType,
          languageDirection,
          BLEU,
          Chrf2,
          ribes_score,
          ter_score,
        } = response.data
        setResult(
          `${teamNameR}\n${submissionType}\n${languageDirection}\n\nBLEU: ${BLEU}\nChrf2: ${Chrf2}\nRIBES: ${ribes_score}\nTER: ${ter_score}`
        )
        scrollToBottom()
      }
      if (err?.response?.status === 500) {
        setResult(`Check number of lines of file uploaded`)
        scrollToBottom()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitResult = async (e: any) => {
    // e.preventDefault()
    closeModal()
    setSubmitMessage(``)

    setLoading(true)
    // console.log(teamName, selectedSubmissionType["name"], selectedTranslationDirection["name"]);
    if (selectedFiles.length === 0) {
      setSubmitMessage(`Please upload a text file for output`)
      scrollToBottom()
      setLoading(false)
      return
    }
    if (selectedFiles[0].type != 'text/plain') {
        setSubmitMessage(`Please upload a text file for output`)
        scrollToBottom()
        setLoading(false)
        return
      }
    if (systemDescription.length === 0) {
      setSubmitMessage(`Please upload a pdf file for system description`)
      scrollToBottom()
      setLoading(false)
      return
    }
    if (
      systemDescription.length > 0 &&
      systemDescription[0].type !== 'application/pdf'
    ) {
      setSubmitMessage(`Please upload a pdf file for system description`)
      scrollToBottom()
      setLoading(false)
      return
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB in bytes\
    if (
      systemDescription.length > 0 &&
      systemDescription[0].size > MAX_FILE_SIZE
    ) {
      setSubmitMessage(`Please upload a pdf file less than 10 MB size`)
      scrollToBottom()
      setLoading(false)
      return
    }

    console.log('Selected File:', selectedFiles)
    const formData = new FormData()
    // formData.append('teamName', teamName);
    formData.append('submissionType', selectedSubmissionType['name'])
    formData.append(
      'translationDirection',
      selectedTranslationDirection['name']
    )
    formData.append('systemDescription', systemDescription[0])
    formData.append('selectedFile', selectedFiles[0])

    try {
      var response = await saveResultPost(formData)
      console.log(response.status)
      console.log(response.status)
      const {
        teamName: teamNameR,
        submissionType,
        languageDirection,
        BLEU,
        Chrf2,
        ribes_score,
        ter_score,
      } = response.data
      setResult(
        `${teamNameR}\n${submissionType}\n${languageDirection}\n\nBLEU: ${BLEU}\nChrf2: ${Chrf2}\nRIBES: ${ribes_score}\nTER: ${ter_score}`
      )
      setSubmitMessage('Result has been saved')
    } catch (err: any | AxiosError) {
      if (err?.response?.status === 500) {
        setSubmitMessage(err?.response?.data?.message)
        // const { teamName, submissionType, languageDirection, BLEU, Chrf2, ribes_score, ter_score } = response.data;
        // setResult(`${teamName}\n${submissionType}\n${languageDirection}\n\nBLEU: ${BLEU}\nChrf2: ${Chrf2}\nRIBES: ${ribes_score}\nTER: ${ter_score}`);
      }
      if (err?.response?.status === 401) {
        await refreshTokenPost()
        response = await saveResultPost(formData)
        // const { teamName, submissionType, languageDirection, BLEU, Chrf2, ribes_score, ter_score } = response.data;
        // setResult(`${teamName}\n${submissionType}\n${languageDirection}\n\nBLEU: ${BLEU}\nChrf2: ${Chrf2}\nRIBES: ${ribes_score}\nTER: ${ter_score}`);
        console.log(response.status)
        const {
          teamName: teamNameR,
          submissionType,
          languageDirection,
          BLEU,
          Chrf2,
          ribes_score,
          ter_score,
        } = response.data
        setResult(
          `${teamNameR}\n${submissionType}\n${languageDirection}\n\nBLEU: ${BLEU}\nChrf2: ${Chrf2}\nRIBES: ${ribes_score}\nTER: ${ter_score}`
        )
        setSubmitMessage('Result has been saved')
      }
      if (err?.response?.status === 400) {
        setSubmitMessage(err?.response?.data?.message)
      }
    } finally {
      setLoading(false)
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
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="flex min-h-screen items-center justify-center px-4">
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
              <div className="relative mx-auto  my-6 w-[60rem] max-w-lg bg-white">
                <Dialog.Title className="mx-6 mt-4 text-lg font-bold">
                  Warning
                </Dialog.Title>
                <div className="whitespace-pre-line px-6 py-4 ">
                  <p className="break-word overflow-scroll whitespace-pre-line text-gray-800 ">
                    You can only submit once for{' '}
                    {`${selectedSubmissionType.name} Submission Type and ${selectedTranslationDirection.name} Language Direction`}
                  </p>
                </div>
                <div className="flex items-center justify-between bg-gray-100 px-6 py-4">
                  <button
                    type="button"
                    className="rounded-lg bg-red-500 px-4 py-2 font-bold text-white"
                    onClick={handleSubmitResult}
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-indigo-500 px-4 py-2 font-bold text-white"
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
      <Transition.Root show={loading} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 flex items-center justify-center"
          onClose={() => {}}
        >
          <Transition.Child
            as={React.Fragment}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-60" />
          </Transition.Child>
          <Transition.Child
            as={React.Fragment}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="flex items-center justify-center">
              {/* Replace the following with your SVG component */}
              <svg
                aria-hidden="true"
                className="mr-2 h-8 w-8 animate-spin fill-purple-600 text-gray-200 dark:text-gray-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
      <div className="mt-5 flex min-h-full flex-1 flex-col justify-center  px-6 sm:mx-auto sm:w-full sm:max-w-[50rem] lg:px-8">
        <header className=" text-center text-lg  leading-9 tracking-tight text-gray-900 ">
          <h2> EMNLP 2023 EIGHTH CONFERENCE ON MACHINE TRANSLATION (WMT23)</h2>
          <h2> Shared Task: Low-Resource Indic Language Translation</h2>
          {/* <h1 className="text-2xl font-bold"> Evaluation</h1> */}
          <div className="my-5 flex justify-between">
            <button
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => {
                navigate('/submissions')
              }}
            >
              View Submissions
            </button>
            <button
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => {
                window.sessionStorage.removeItem('access_token')
                navigate('/')
              }}
            >
              Logout
            </button>
          </div>
          <p className="text-red-600">
            For each Language Direction, You can submit result only once for
            each of the PRIMARY, CONTRASTIVE-1, CONTRASTIVE-2 submission types.
          </p>
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
              <label
                htmlFor="submissionType"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Select Submission Type
              </label>
              <div className="mt-2">
                <SelectSubmissionType
                  optionTypes={submissionTypes}
                  selectedType={selectedSubmissionType}
                  setSelectedType={setSelectedSubmissionType}
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
                Select System Output File
              </label>
              <div className="mt-2">
                {/* <input className="py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 h-full " id="file_input" type="file"/> */}
                <CustomFileInput
                  selectedFiles={selectedFiles}
                  setSelectedFiles={setSelectedFiles}
                />
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
      <div className="mb-10 flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8 ">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={openModal}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
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
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Upload abstract system description file (PDF format) (200 words)
              </label>
              <div className="mt-2">
                <CustomFileInput
                  selectedFiles={systemDescription}
                  setSelectedFiles={setSystemDescription}
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
              <p className="mt-2 text-sm text-red-500 ">{submitMessage}</p>
            )}
          </form>
        </div>
      </div>
    </>
  )
}
