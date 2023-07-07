import React, { useState } from 'react'
import {
  useTable,
  useFilters,
  // useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  usePagination,
} from 'react-table'
import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
} from './shared/Icons'
import { Button, PageButton } from './shared/Button'
import { classNames } from './shared/Utils'
import { SortIcon, SortUpIcon, SortDownIcon } from './shared/Icons'
import { useAppDispatch } from '../../store'
import axios from 'axios'
import { Dialog, Transition } from '@headlessui/react'
import { useNavigate } from 'react-router-dom'
const VITE_SERVERURL = import.meta.env.VITE_SERVERURL

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: any) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <label className="flex items-baseline gap-x-2">
      <span className="text-gray-700">Search: </span>
      <input
        type="text"
        className="
        m-0
        block
        w-full
        rounded
        border
        border-solid
        border-gray-300
        bg-white bg-clip-padding bg-no-repeat
        px-2 py-1 text-base
        font-normal
        text-gray-700
        transition
        ease-in-out
        focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value)
          onChange(e.target.value)
        }}
        placeholder={`${count} records...`}
      />
    </label>
  )
}

// This is a custom filter UI for selecting
// a unique option from a list
export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id, render },
}: any) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach((row: any) => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <label className="flex items-baseline gap-x-2">
      <span className="text-gray-700">{render('Header')}: </span>
      <select
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        name={id}
        id={id}
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined)
        }}
      >
        <option value="">All</option>
        {options.map((option: any, i: any) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

export function SelectDateFilter({
  column: { filterValue, setFilter, preFilteredRows, id, render },
}: any) {
  // Calculate the options for filtering
  // using the preFilteredRows
  // console.log(preFilteredRows)
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach((row: any) => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <label className="flex w-auto items-baseline gap-x-2">
      <span className="text-gray-700">{render('Header')}: </span>
      <select
        className="form-select m-0
        block
        w-full
        appearance-none
        rounded
        border
        border-solid
        border-gray-300
        bg-white bg-clip-padding bg-no-repeat
        px-2 py-1 text-base
        font-normal
        text-gray-700
        transition
        ease-in-out
        focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
        name={id}
        id={id}
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined)
        }}
      >
        <option value="">All</option>
        {options.map((option: any, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

export function StatusPill({ value }: any) {
  const status = value ? value.toLowerCase() : 'unknown'

  return (
    <span
      className={classNames(
        'leading-wide rounded-full px-3 py-1 text-xs font-bold uppercase shadow-sm',
        status.startsWith('active') ? 'bg-green-100 text-green-800' : null,
        status.startsWith('inactive') ? 'bg-yellow-100 text-yellow-800' : null,
        status.startsWith('offline') ? 'bg-red-100 text-red-800' : null
      )}
    >
      {status}
    </span>
  )
}

export function DateCell({ value }: any) {
  return (
    <span
      className={classNames('leading-wide rounded-full px-3 py-1 shadow-sm')}
    >
      {new Date(value).toLocaleDateString()}
    </span>
  )
}

export function CategoryCell({ value, column, row }: any) {
  return (
    <>
      {value === 'Veg' ? (
        <span className="leading-wide rounded-full bg-teal-100 px-3 py-1 text-xs font-bold uppercase text-teal-700 shadow-sm">
          <a>{value}</a>
        </span>
      ) : (
        <span className="leading-wide rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase text-red-700 shadow-sm">
          {value}
        </span>
      )}
    </>
  )
}

export function TimeCell({ value, column, row }: any) {
  return (
    <>
      <span className="leading-wide rounded-full bg-teal-100 px-3 py-1 text-xs font-bold uppercase text-teal-700 shadow-sm">
        <a>{value}</a>
      </span>
    </>
  )
}

export function DownloadPDFIngredient({ value, column, row }: any) {
  if (value && row.original[column.flagAccessor])
    return (
      <span className="flex w-full flex-row items-center gap-4">
        <a href={value} className="w-10">
          <img src={value} className="mr-5 h-10 w-10 rounded-sm" />
        </a>
        <span
          className={classNames(
            'leading-wide rounded-full px-3 py-1 text-xs font-bold uppercase shadow-sm',
            'bg-green-100 text-green-800'
          )}
        >
          <a href={value}>
            {value.split('ingredient/')[1] ||
              value
                .replace(
                  'https://res.cloudinary.com/dxgfvidct/image/upload/',
                  ''
                )
                .slice(0, 20)}
          </a>
        </span>
      </span>
    )
  return <></>
}

export function ViewFile({ value, column, row }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const [fileContent, setFileContent] = useState('')

  const openModal = () => {
    setIsOpen(true)
    getReferenceFilePost()
  }

  const closeModal = () => {
    setIsOpen(false)
    setFileContent('')
  }

  const getReferenceFilePost = async () => {
    const access_token = window.sessionStorage.getItem('access_token')
    try {
      const response = await axios.post(
        VITE_SERVERURL + '/v1/submissions/getReferenceFile',
        {
          ...row.original,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          responseType: 'text',
        }
      )

      const fileContent = response.data
      setFileContent(fileContent)
    } catch (error) {
      console.error(error)
    }
  }

  const downloadFile = () => {
    const element = document.createElement('a')
    const file = new Blob([fileContent], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = row.original.submissionType + '_' + row.original.fileName
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <>
      <span className="leading-wide ml-3 rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase text-green-600 shadow-sm">
        <button type="button" onClick={openModal}>
          View
        </button>
      </span>

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
              <div className="relative mx-auto my-6 w-[60rem] max-w-md rounded-lg bg-white">
                <Dialog.Title className="mx-6 mt-4 text-lg font-bold">
                  File Content
                </Dialog.Title>
                {/* <div className="px-6 py-4">
                  <p className="text-gray-800">{fileContent}</p>
                </div> */}
                <div className="whitespace-pre-line px-6 py-4 ">
                  <p className="overflow-scroll whitespace-pre-line break-all text-gray-800 ">
                    {fileContent}
                  </p>
                </div>
                <div className="flex items-center justify-between bg-gray-100 px-6 py-4">
                  <button
                    type="button"
                    className="rounded-lg bg-gray-300 px-4 py-2 font-bold text-gray-800"
                    onClick={downloadFile}
                  >
                    Download
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-red-500 px-4 py-2 font-bold text-white"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export function DeleteCell({ value, column, row }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }
  return (
    <>
      <span className="leading-wide rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase text-red-600 shadow-sm">
        <button type="button" onClick={() => openModal()}>
          Delete
        </button>
      </span>
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
              <div className="relative mx-auto  my-6 w-[60rem] max-w-md bg-white">
                <Dialog.Title className="mx-6 mt-4 text-lg font-bold">
                  Warning
                </Dialog.Title>
                <div className="whitespace-pre-line px-6 py-4 ">
                  <p className="overflow-scroll whitespace-pre-line break-all text-gray-800 ">
                    Are you sure you want to delete this entry?
                  </p>
                </div>
                <div className="flex items-center justify-between bg-gray-100 px-6 py-4">
                  <button
                    type="button"
                    className="rounded-lg bg-red-500 px-4 py-2 font-bold text-white"
                    onClick={row.original.onDelete}
                  >
                    Yes
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
    </>
  )
}

export function EvaluateCell({ value, column, row }: any) {
  const navigate = useNavigate()
  return (
    <>
      {row.original.evaluationStatus === 'unevaluated' ? (
        <span className="leading-wide rounded-full  bg-blue-100 px-3 py-1 text-xs font-bold uppercase text-blue-600 shadow-sm">
          <button
            type="button"
            onClick={() =>
              navigate(`/admin/humanEvaluationTask/${row.original._id}`)
            }
          >
            Start Task
          </button>
        </span>
      ) : (
        <span className="leading-wide rounded-full  bg-teal-100 px-3 py-1 text-xs font-bold uppercase text-teal-600 shadow-sm">
          <button
            type="button"
            onClick={() =>
              navigate(`/admin/humanEvaluationTask/${row.original._id}`)
            }
          >
            View Result
          </button>
        </span>
      )}
    </>
  )
}
export function ViewSelectedFile({ value, column, row }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const [fileContent, setFileContent] = useState('')

  const openModal = () => {
    setIsOpen(true)
    setFileContent(row.original.selectedFile)
  }

  const closeModal = () => {
    setIsOpen(false)
    setFileContent('')
  }

  const downloadFile = () => {
    const element = document.createElement('a')
    const file = new Blob([fileContent], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = row.original.submissionType + '_' + row.original.fileName
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <>
      <span className="leading-wide rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase  text-green-600 shadow-sm">
        <button type="button" onClick={openModal}>
          View
        </button>
      </span>

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
              <div className="relative mx-auto my-6 w-[60rem] max-w-md rounded-lg bg-white">
                <Dialog.Title className="mx-6 mt-4 text-lg font-bold">
                  File Content
                </Dialog.Title>
                {/* <div className="px-6 py-4">
                  <p className="text-gray-800">{fileContent}</p>
                </div> */}
                <div className="whitespace-pre-line px-6 py-4 ">
                  <p className="overflow-scroll whitespace-pre-line break-all text-gray-800 ">
                    {fileContent}
                  </p>
                </div>
                <div className="flex items-center justify-between bg-gray-100 px-6 py-4">
                  <button
                    type="button"
                    className="rounded-lg bg-gray-300 px-4 py-2 font-bold text-gray-800"
                    onClick={downloadFile}
                  >
                    Download
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-red-500 px-4 py-2 font-bold text-white"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export function ViewSystemDescription({ value, column, row }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const [fileContent, setFileContent] = useState('')

  const openModal = () => {
    setIsOpen(true)
    setFileContent(row.original.systemDescription)
  }

  const closeModal = () => {
    setIsOpen(false)
    setFileContent('')
  }

  const downloadFile = () => {
    const element = document.createElement('a')
    const file = new Blob([fileContent], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download =
      row.original.submissionType +
      '_SystemDescription_' +
      row.original.fileName
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <>
      <span className="leading-wide rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase  text-green-600 shadow-sm">
        <button type="button" onClick={openModal}>
          View
        </button>
      </span>

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
              <div className="relative mx-auto my-6 w-[60rem] max-w-md rounded-lg bg-white">
                <Dialog.Title className="mx-6 mt-4 text-lg font-bold">
                  System Description
                </Dialog.Title>
                {/* <div className="px-6 py-4">
                  <p className="text-gray-800">{fileContent}</p>
                </div> */}
                <div className="whitespace-pre-line px-6 py-4 ">
                  <p className="overflow-scroll whitespace-pre-line break-all text-gray-800 ">
                    {fileContent}
                  </p>
                </div>
                <div className="flex items-center justify-between bg-gray-100 px-6 py-4">
                  <button
                    type="button"
                    className="rounded-lg bg-gray-300 px-4 py-2 font-bold text-gray-800"
                    onClick={downloadFile}
                  >
                    Download
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-red-500 px-4 py-2 font-bold text-white"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export function ViewPredictedFile({ value, column, row }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const [fileContent, setFileContent] = useState('')

  const openModal = () => {
    setIsOpen(true)
    setFileContent(row.original.predictedFile)
  }

  const closeModal = () => {
    setIsOpen(false)
    setFileContent('')
  }

  const downloadFile = () => {
    const element = document.createElement('a')
    const file = new Blob([fileContent], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download =
      row.original.teamName + '_PredictedFile_' + row.original.fileName
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <>
      <span className="leading-wide rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase  text-green-600 shadow-sm">
        <button type="button" onClick={openModal}>
          View
        </button>
      </span>

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
              <div className="relative mx-auto my-6 w-[60rem] max-w-md rounded-lg bg-white">
                <Dialog.Title className="mx-6 mt-4 text-lg font-bold">
                  Predicted File
                </Dialog.Title>
                {/* <div className="px-6 py-4">
                  <p className="text-gray-800">{fileContent}</p>
                </div> */}
                <div className="whitespace-pre-line px-6 py-4 ">
                  <p className="overflow-scroll whitespace-pre-line break-all text-gray-800 ">
                    {fileContent}
                  </p>
                </div>
                <div className="flex items-center justify-between bg-gray-100 px-6 py-4">
                  <button
                    type="button"
                    className="rounded-lg bg-gray-300 px-4 py-2 font-bold text-gray-800"
                    onClick={downloadFile}
                  >
                    Download
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-red-500 px-4 py-2 font-bold text-white"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export function ViewReferenceFile({ value, column, row }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const [fileContent, setFileContent] = useState('')

  const openModal = () => {
    setIsOpen(true)
    setFileContent(row.original.referenceFile)
  }

  const closeModal = () => {
    setIsOpen(false)
    setFileContent('')
  }

  const downloadFile = () => {
    const element = document.createElement('a')
    const file = new Blob([fileContent], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download =
      row.original.teamName + '_ReferenceFile_' + row.original.fileName
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <>
      <span className="leading-wide rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase  text-green-600 shadow-sm">
        <button type="button" onClick={openModal}>
          View
        </button>
      </span>

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
              <div className="relative mx-auto my-6 w-[60rem] max-w-md rounded-lg bg-white">
                <Dialog.Title className="mx-6 mt-4 text-lg font-bold">
                  Reference File
                </Dialog.Title>
                {/* <div className="px-6 py-4">
                  <p className="text-gray-800">{fileContent}</p>
                </div> */}
                <div className="whitespace-pre-line px-6 py-4 ">
                  <p className="overflow-scroll whitespace-pre-line break-all text-gray-800 ">
                    {fileContent}
                  </p>
                </div>
                <div className="flex items-center justify-between bg-gray-100 px-6 py-4">
                  <button
                    type="button"
                    className="rounded-lg bg-gray-300 px-4 py-2 font-bold text-gray-800"
                    onClick={downloadFile}
                  >
                    Download
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-red-500 px-4 py-2 font-bold text-white"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export function AvatarCell({ value, column, row }: any) {
  return (
    <div className="flex items-center">
      {/* <div className="flex-shrink-0 h-10 w-10">
        <img
          className="h-10 w-10 rounded-full"
          src={row.original[column.imgAccessor]}
          alt=""
        />
      </div> */}
      <div className="ml-4">
        <div className="text-sm font-medium text-gray-900">
          {value} {row.original[column.lNameAccessor]}
        </div>
        {/* <div className="text-sm text-gray-500">
          {row.original[column.emailAccessor]}
        </div> */}
      </div>
    </div>
  )
}

function Table({ columns, data }: any) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,

    state,
    // preGlobalFilteredRows,
    // setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: Number.MAX_SAFE_INTEGER } as any,
    },
    useFilters, // useFilters!
    // useGlobalFilter,
    useSortBy,
    usePagination // new
  ) as any

  // Render the UI for your table
  return (
    <div className="relative mx-auto max-w-[1180px]">
      <div className="sm:flex sm:gap-x-2">
        {/* <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        /> */}
        {headerGroups.map((headerGroup: any) =>
          headerGroup.headers.map((column: any) =>
            column.Filter ? (
              <div className="mt-2 sm:mt-0" key={column.id}>
                {column.render('Filter')}
              </div>
            ) : null
          )
        )}
      </div>
      {/* table */}
      <div className="mt-4 flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
              <table
                {...getTableProps()}
                className="min-w-full divide-y divide-gray-200 border shadow-md"
              >
                <thead className="bg-gray-100">
                  {headerGroups.map((headerGroup: any) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column: any) => (
                        // Add the sorting props to control sorting. For this example
                        // we can add them into the header props
                        <th
                          scope="col"
                          className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                        >
                          <div className="flex items-center justify-between">
                            {column.render('Header')}
                            {/* Add a sort direction indicator */}
                            <span>
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <SortDownIcon className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <SortUpIcon className="h-4 w-4 text-gray-400" />
                                )
                              ) : (
                                <SortIcon className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                              )}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  className="divide-y divide-gray-200 bg-white"
                >
                  {page.map((row: any, i: number) => {
                    // new
                    prepareRow(row)
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell: any) => {
                          return (
                            <td
                              {...cell.getCellProps()}
                              className="whitespace-nowrap px-6 py-4"
                              role="cell"
                            >
                              {cell.column.Cell.name === 'defaultRenderer' ? (
                                <div className="text-sm text-gray-500">
                                  {cell.render('Cell')}
                                </div>
                              ) : (
                                cell.render('Cell')
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Pagination */}
      {/* <div className="flex items-center justify-between py-3">
        <div className="flex flex-1 justify-between sm:hidden">
          <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
            Previous
          </Button>
          <Button onClick={() => nextPage()} disabled={!canNextPage}>
            Next
          </Button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div className="flex items-baseline gap-x-2">
            <span className="text-sm text-gray-700">
              Page <span className="font-medium">{state.pageIndex + 1}</span> of{' '}
              <span className="font-medium">{pageOptions.length}</span>
            </span>
            <label className="w-32">
              <span className="sr-only">Items Per Page</span>
              <select
                className="form-select m-0
                block
                w-full
                appearance-none
                rounded
                border
                border-solid
                border-gray-300
                bg-white bg-clip-padding bg-no-repeat
                px-2 py-1 text-base
                font-normal
                text-gray-700
                transition
                ease-in-out
                focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
                value={state.pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                }}
              >
                {[Number.MAX_SAFE_INTEGER, 5, 10, 20].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show{' '}
                    {pageSize === Number.MAX_SAFE_INTEGER ? 'All' : pageSize}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <PageButton
                className="rounded-l-md"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <span className="sr-only">First</span>
                <ChevronDoubleLeftIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </PageButton>
              <PageButton
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </PageButton>
              <PageButton onClick={() => nextPage()} disabled={!canNextPage}>
                <span className="sr-only">Next</span>
                <ChevronRightIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </PageButton>
              <PageButton
                className="rounded-r-md"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                <span className="sr-only">Last</span>
                <ChevronDoubleRightIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </PageButton>
            </nav>
          </div>
        </div>
      </div> */}
    </div>
  )
}
export default Table
