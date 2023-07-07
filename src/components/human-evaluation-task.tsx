import React, { useState, useEffect, FormEventHandler } from 'react'
import axios, { AxiosError } from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import Table from './table/table-no-footer' // Import the custom Table component
import { Dialog, Transition } from '@headlessui/react'
import HumanEvaluatorLoginFormModal from './humanEvaluator-login-form-modal'
import { useAppDispatch } from '../store'
import { setCurrentHETL } from '../store/navigationMenu/navigation'

const VITE_SERVERURL = import.meta.env.VITE_SERVERURL

const HumanEvaluatorViewTask = () => {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [viewSubmittedDetails, setViewSubmittedDetails] = useState(false)
  const [submittedDetails, setSubmittedDetails] = useState({
    translationDirection: '',
    overallScore: [],
  })
  const [prevValues, setPrevValues] = useState({
    overallScore: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { taskId } = useParams()

  const fetchSubmissionGet = async () => {
    const access_token = window.sessionStorage.getItem('access_token')
    return axios.get(
      VITE_SERVERURL + '/v1/humanEvaluations/humanEvaluatorSingle/' + taskId,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
  }

  const submitSubmissionPost = async (formData: any) => {
    const access_token = window.sessionStorage.getItem('access_token')
    return axios.post(
      VITE_SERVERURL + '/v1/humanEvaluations/submitEvaluation/' + taskId,
      formData,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          taskId
        }
      }
    )
  }

  const submitEvaluationData = async (formData: any) => {
    try {
      setIsLoading(true)
      const response = await submitSubmissionPost(formData)
      console.log(response.data)
    } catch (err) {
      if (axios.isAxiosError(err) && err?.response?.status === 401) {
        setShowModal(true)
      }
    } finally {
      setSubmissionsData()
    }
  }

  const handleSubmit = async (e: any) => {
    // Handle the submission logic here
    e.preventDefault()
    const scores = submissions.reduce(
      (acc, element) => {
        acc.adequacy.push(element.adequacy)
        acc.fluency.push(element.fluency)
        acc.overallScore.push(
          '' +
            (+(parseInt(element.adequacy) || 0) +
              (parseInt(element.fluency) || 0)) /
              2
        )
        return acc
      },
      { adequacy: [], fluency: [], overallScore: [] }
    )

    const submitData = { ...scores, evaluationStatus: "evaluated" }
    await submitEvaluationData(submitData)
  }

  const convertDataObjectToArray = (dataObject: {
    predictedFile: string
    referenceFile: string
    adequacy: string[]
    fluency: string[]
    overallScore: string[]
  }) => {
    const predictedLines = dataObject.predictedFile.split('\n')
    const referenceLines = dataObject.referenceFile.split('\n')
    const {adequacy, fluency, overallScore} = dataObject;
    if(adequacy.length === 0){
      const data = predictedLines.map((predictedLine: string, index: number) => ({
        predictedLine: predictedLine.trim(),
        referenceLine: referenceLines[index].trim(),
        adequacy: '',
        fluency: '',
        overallScore: '',
      }))
      console.log(data)
  
      return data
    }

    const data = predictedLines.map((predictedLine: string, index: number) => ({
      predictedLine: predictedLine.trim(),
      referenceLine: referenceLines[index].trim(),
      adequacy: adequacy[index].trim(),
      fluency: fluency[index].trim(),
      overallScore: overallScore[index].trim(),
    }))
    console.log(data)

    return data
  }

  const setSubmissionsData = async () => {
    try {
      setIsLoading(true)
      const response = await fetchSubmissionGet()
      setSubmittedDetails({
        translationDirection: response.data.translationDirection,
        overallScore: response.data.overallScore,
      })
      setViewSubmittedDetails(response.data.evaluationStatus !== 'unevaluated')
      console.log(response.data)
      const convertedData = convertDataObjectToArray(response.data)
      setSubmissions(convertedData)
    } catch (err) {
      if (axios.isAxiosError(err) && err?.response?.status === 401) {
        setShowModal(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  

  const handleInputChange = (index: number, field: string, value: string) => {
    if (
      value === '' ||
      (/^\d+$/.test(value) && parseInt(value) >= 1 && parseInt(value) <= 5)
    ) {
      setSubmissions((prevSubmissions) => {
        const updatedSubmission = [...prevSubmissions]
        updatedSubmission[index] = {
          ...updatedSubmission[index],
          [field]: value,
        }
        return updatedSubmission
      })
    }
  }

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setCurrentHETL())
    setSubmissionsData()
  }, [])

  const columns = React.useMemo(
    () => [
      {
        Header: 'Predicted Line',
        accessor: 'predictedLine',
      },
      {
        Header: 'Reference Line',
        accessor: 'referenceLine',
      },
      {
        Header: 'Adequacy',
        Cell: ({ row }: any) => (
          <input
            type="text"
            value={row.original.adequacy}
            required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={(e) =>
              handleInputChange(row.index, 'adequacy', e.target.value)
            }
          />
        ),
      },
      {
        Header: 'Fluency',
        Cell: ({ row }: any) => (
          <input
            type="text"
            value={row.original.fluency}
            required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={(e) =>
              handleInputChange(row.index, 'fluency', e.target.value)
            }
          />
        ),
      },
      {
        Header: 'Overall Score',
        accessor: 'overallScore',
      },
    ],
    []
  )

  return (
    <div>
      {showModal && (
        <Dialog open={showModal} onClose={() => setShowModal(false)}>
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white p-6">
              <HumanEvaluatorLoginFormModal
                onClose={() => setShowModal(false)}
                onSubmit={() => {
                  setShowModal(false)
                  if (submissions.length === 0) {
                    setIsLoading(true)
                    setSubmissionsData()
                  }
                }}
              />
            </div>
          </div>
        </Dialog>
      )}
      <div className="my-5 flex min-h-full flex-1 flex-row justify-between  px-6 sm:mx-auto sm:w-full sm:max-w-[50rem] lg:px-8">
        <div className="flex flex-row justify-between">
          <div className="h-full">
            <button
              className="rounded-md bg-indigo-600 px-5 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => {
                navigate('/humanEvaluationTasksList')
              }}
            >
              ← Back
            </button>
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <div className="h-full">
            <button
              className="rounded-md bg-indigo-600 px-5 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => {
                window.sessionStorage.removeItem('access_token')
                navigate('/humanEvaluationLogin')
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
      {viewSubmittedDetails ? (
        <div className="m-10 mb-4 rounded-lg bg-purple-100 p-4 shadow-md">
          <p className="text-purple-800">
            <strong>Translation Direction:</strong>{' '}
            <span className="text-black">
              {submittedDetails.translationDirection}
            </span>
          </p>
          <p className="text-purple-800">
            <strong>Overall Score:</strong>{' '}
            <span className="text-black">
              {(
                submittedDetails.overallScore.reduce(
                  (acc, e) => acc + parseInt(e),
                  0
                ) / submittedDetails.overallScore.length
              ).toFixed(2)}
            </span>
          </p>
        </div>
      ) : (
        <div className="m-10 mb-4 rounded-lg bg-purple-100 p-4 shadow-md">
          <p>This task has not been submitted yet</p>
        </div>
      )}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Table
            columns={columns}
            data={submissions.map((submission: any) => {
              return {
                ...submission,
                overallScore:
                  (+(parseInt(submission.adequacy) || 0) +
                    (parseInt(submission.fluency) || 0)) /
                  2,
              }
            })}
          />
          <button className="mx-10 my-10 flex w-full max-w-[1180px] justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Submit
          </button>
        </form>
      )}
    </div>
  )
}

export default HumanEvaluatorViewTask
