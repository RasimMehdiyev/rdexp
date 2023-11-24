import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function PlayerAdditionModal({ isOpen, closeModal }) {

  const cancelButtonRef = useRef(null)
  const [email, setEmail] = useState('')
  console.log(email)
  const handleAddPlayer = () => {
    
    if (checkInput()) {
      console.log("Invitation sent to: %s", email)
      closeModal()
    } else {
      console.log("Input isn't good")
    }
    setEmail('')
    
  }

  const checkInput = () => {
    if (email.trim() === '') {
      return false;
    } else { return true; };
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all xxs:my-8 xxs:max-w-[80%]">
                <div className="bg-white px-4 pb-4 pt-5 xxs:p-6 xxs:pb-4">
                  <div className="xxs:flex xxs:items-start">
                    <div className="mt-3 text-center xxs:ml-4 xxs:mt-0 xxs:text-left">
                    <Dialog.Title as="h3" className="font-russoOne text-2xl leading-6 text-gray-900">
                    ADD USER
                    </Dialog.Title>
                      <div className="mt-4">
                        <div className="relative mt-2 rounded-md shadow-xxs">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pr-2 pl-2">
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <input
                            type="text"
                            name="price"
                            id="price"
                            className="block w-[78%] rounded-md border-0 py-1.5 pl-5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 xxs:text-xxs xxs:leading-6"
                            placeholder="Enter user's name"
                            style={{ marginLeft: "50px" }}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 xxs:flex xxs:flex-row-reverse xxs:px-6">
                <button
                    type="button"
                    className="xxs:max-h-12 xxs:text-center xxs:items-center mt-3 font-interReg inline-flex w-full justify-center text-blue-500 rounded-md bg-white px-3 py-4 text-xxs shadow-xxs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 xxs:mt-0 xxs:w-auto"
                    onClick={closeModal}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                <button
                    type="button"
                    className="xxs:max-h-12 xxs:text-center xxs:items-center inline-flex font-interReg mr-2 w-full justify-center rounded-md bg-blue-500 px-3 py-4 text-xxs text-white shadow-xxs hover:bg-blue-200 xxs:ml-3 "
                    onClick={handleAddPlayer}>
                    Add
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
