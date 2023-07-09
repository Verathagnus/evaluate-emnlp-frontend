import React, { useState, useEffect } from 'react'
import axios, { AxiosError } from 'axios'
// import { Dialog } from "@headlessui/react";
// import LoginFormModal from "./login-form-modal";
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../store'
import { setCurrentHETL } from '../store/navigationMenu/navigation'
import Table, {
  ViewPredictedFile,
  ViewReferenceFile,
  EvaluateCellHumanEvaluator,
} from './table/table'
import SelectSubmissionType from './select-submission-type'
import SelectTranslationDirection from './select-translation-direction'
import { Dialog } from '@headlessui/react'
import AdminEvaluationTaskForm from './admin-evaluation-task-form'
import HumanEvaluationTaskForm from './human-evaluation-task-form'
const VITE_SERVERURL = import.meta.env.VITE_SERVERURL

const AdminHumanEvaluatorViewTasksList = () => {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortType, setSortType] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  // const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate()

  const deleteSubmissionPost = async (submissionId: string) => {
    const access_token = window.sessionStorage.getItem('access_token')
    return axios.delete(
      VITE_SERVERURL + '/v1/humanEvaluations/' + submissionId,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
  }

  const fetchSubmissionsAllPost = async () => {
    const access_token = window.sessionStorage.getItem('access_token')
    return axios.post(
      VITE_SERVERURL +
        '/v1/humanEvaluations/humanEvaluator/fetchEvaluationsAll',
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
  }
  const setSubmissionsData = async () => {
    try {
      setIsLoading(true)
      const response = await fetchSubmissionsAllPost()
      // const data = await response.json();
      console.log(response.data)
      setSubmissions(response.data)
      setIsLoading(false)
    } catch (err: any | AxiosError) {
      if (err?.response?.status === 401) {
        navigate('/humanEvaluationLogin')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSubmissionsAll = async () => {
    try {
      await setSubmissionsData()
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setIsLoading(false)
    }
  }
  const dispatch = useAppDispatch()
  useEffect(() => {
    fetchSubmissionsAll()
    dispatch(setCurrentHETL())
  }, [])

  const handleSearchTermChange = (e: any) => {
    setSearchTerm(e.target.value)
  }

  const handleSortTypeChange = (e: any) => {
    setSortType(e.target.value)
  }

  const translationDirectionOptions = [
    {
      id: 0,
      name: '',
    },
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

  const filteredSubmissions = submissions
    .filter((submission: any) =>
      // submission.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.translationDirection
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((submission: any) =>
      submission.translationDirection
        .toLowerCase()
        .includes(selectedTranslationDirection.name.toLowerCase())
    )

  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    // if (sortType === 'teamName') {
    //     return a.teamName.localeCompare(b.teamName);
    // }
    // else
    if (sortType === 'translationDirection') {
      return a.translationDirection.localeCompare(b.translationDirection)
    } else if (sortType === 'createdAt') {
      return (
        Date.parse(a.createdAt).valueOf() - Date.parse(b.createdAt).valueOf()
      )
    }
    // Add more sort options if needed
    return 0
  })

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
        Header: 'Team Name',
        accessor: 'teamName', // accessor is the "key" in the data
      },
      {
        Header: 'Language Direction',
        accessor: 'translationDirection',
      },
      {
        Header: 'Predicted File',
        Cell: ViewPredictedFile,
      },
      {
        Header: 'Reference File',
        Cell: ViewReferenceFile,
      },
      {
        Header: 'Evaluate',
        Cell: EvaluateCellHumanEvaluator,
      },
      {
        Header: 'Date Submitted',
        accessor: 'createdAt',
        Cell: ({ value }: any) => new Date(value).toLocaleString(),
      },
      //   {
      //     Header: 'Delete',
      //     Cell: DeleteCell,
      //   },
      // {
      //     Header: "Submitted Output File",
      //     Cell: ViewSelectedFile
      // },
      // {
      //     Header: "System Description",
      //     Cell: ViewSystemDescription
      // },
      // {
      //     Header: 'Delete',
      //     Cell: DeleteCell
      // },
    ],
    []
  )

  return (
    <>
      {showModal && (
        <Dialog open={showModal} onClose={() => setShowModal(false)}>
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="fixed inset-0 flex flex-col items-center justify-center  ">
            <div className="overflow-y-scroll bg-white p-6">
              <HumanEvaluationTaskForm
                onClose={() => setShowModal(false)}
                onCreate={() => {
                  setShowModal(false)
                  setIsLoading(true)
                  fetchSubmissionsAll()
                }}
              />
            </div>
          </div>
        </Dialog>
      )}
      <div className="my-5 flex min-h-full flex-1 flex-col justify-center  px-6 sm:mx-auto sm:w-full lg:px-8 ">
        <div className="justify-between sm:flex">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search"
              className="rounded-md border border-gray-300 px-4 py-2"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
          </div>

          <div className="mb-4">
            <select
              className="rounded-md border border-gray-300 py-2 pl-8"
              value={sortType}
              onChange={handleSortTypeChange}
            >
              <option value="">Sort By</option>
              {/* <option value="teamName">Team Name</option> */}
              <option value="translationDirection">Language Direction</option>
              <option value="createdAt">Date Submitted</option>
              {/* Add more sort options if needed */}
            </select>
          </div>
          <div className="mb-4">
            <SelectTranslationDirection
              optionTypes={translationDirectionOptions}
              selectedType={selectedTranslationDirection}
              setSelectedType={setSelectedTranslationDirection}
            />
          </div>
          <div className="h-full">
            <button
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => {
                setShowModal(true)
              }}
            >
              Create New Task
            </button>
          </div>
        </div>
      </div>
      <div className="bg-purpl-100 m-12  mb-4 border border-black p-4 shadow-md">
        <h1 className="text-[18px]">Rating Scale For Adequacy and Fluency: </h1>
        <div>
          <span className="text-[18px]">Adequacy:</span>{' '}
          <span className="text-[11.5px] text-[#555]">
            A typical scale used to measure adequacy is based on the question
            “How much meaning is preserved?”
          </span>
        </div>
        
        <table className='table-rating-description'>
          <thead className='text-[11px]'>
            <td>Rating: </td>
            <td>Description </td>
          </thead>
          <tbody className='text-[#555] text-[11.5px]'>
            <tr>
              <td>5:</td> <td>All meaning</td>
            </tr>
            <tr>
              <td>4:</td> <td>Most meaning</td>
            </tr>
            <tr>
              <td>3:</td> <td>Some meaning</td>
            </tr>
            <tr>
              <td>2:</td> <td>Little meaning</td>
            </tr>
            <tr>
              <td>1:</td> <td>None</td>
            </tr>
          </tbody>
        </table>
        <div>
          <span className="text-[18px]">Fluency:</span>{' '}
          <span className="text-[11.5px] text-[#555]">
            A typical scale used to measure fluency is based on the question “Is
            the language in the output fluent?”
          </span>
        </div>
        <table className='table-rating-description'>
          <thead className='text-[11px]'>
            <td>Rating: </td>
            <td>Description </td>
          </thead>
          <tbody className='text-[#555] text-[11.5px]'>
            <tr>
              <td>5:</td> <td>Flawless</td>
            </tr>
            <tr>
              <td>4:</td> <td>Good</td>
            </tr>
            <tr>
              <td>3:</td> <td>Non-native</td>
            </tr>
            <tr>
              <td>2:</td> <td>Disfluent</td>
            </tr>
            <tr>
              <td>1:</td> <td>Incomprehensible</td>
            </tr>
          </tbody>
        </table>
      </div>
      {isLoading ? (
        <div className="absolute left-0 top-0 flex h-screen w-screen items-center justify-center py-4 text-center">
          <div role="status">
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
            <span className="sr-only">Loading...</span>
          </div>
        </div>
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
  )
}

export default AdminHumanEvaluatorViewTasksList
