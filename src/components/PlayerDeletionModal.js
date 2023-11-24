import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function PlayerDeletionModal({ isOpen, closeModal, person,  onDelete }) {

  const cancelButtonRef = useRef(null)
  const handleOnDelete = () => {
    onDelete();
    console.log("handle on delete in modal")
    closeModal();
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal} initialFocus={cancelButtonRef}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center xxs:items-center xxs:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 xxs:translate-y-0 xxs:scale-95"
              enterTo="opacity-100 translate-y-0 xxs:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 xxs:scale-100"
              leaveTo="opacity-0 translate-y-4 xxs:translate-y-0 xxs:scale-95"
            >
              <Dialog.Panel className="xxs:max-w-[80%] sm-w-full relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all xxs:my-8 ">
                <div className="bg-white px-4 pb-4 pt-5 xxs:p-6 xxs:pb-4">
                  <div className="xxs:flex xxs:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 xxs:mx-0 xxs:h-10 xxs:w-10">
                      <ExclamationTriangleIcon className="h-6 w-6 text-blue-500" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center xxs:ml-4 xxs:mt-0 xxs:text-left">
                    <Dialog.Title as="h3" className="font-semibold leading-6 text-gray-900">
                    REMOVE FROM TEAM
                    </Dialog.Title>
                      <div className="mt-4">
                        <p className=" text-gray-500 ">
                          Are you sure you want to remove <strong>{person.name}</strong> from <strong>Team 1</strong>?
                        This action is final, but you can re-invite them to the team later if needed.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 xxs:flex xxs:flex-row-reverse xxs:px-6">
                <button
                    type="button"
                    className="mt-3 xxs:max-h-12 xxs:text-center xxs:items-center inline-flex w-full justify-center text-blue-700 rounded-md bg-white px-3 py-2 text-sm shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50  sm:w-auto"
                    onClick={closeModal}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                <button
                    type="button"
                    className="inline-flex xxs:max-h-12 xxs:text-center xxs:items-center mt-3 mr-2 w-full justify-center rounded-md bg-blue-700 px-3 py-2 text-sm text-white shadow-sm hover:bg-orange-500 sm:ml-3 sm:w-auto"
                    onClick={handleOnDelete}
                  >
                    Remove
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
