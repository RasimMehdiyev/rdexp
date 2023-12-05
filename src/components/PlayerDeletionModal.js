import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import PersonTagNotDeletable from '../components/PersonTagNotDeletable.js';

export default function PlayerDeletionModal({ isOpen, closeModal, onConfirm, id, name, number, team, isPlayer}) {

  const cancelButtonRef = useRef(null)

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10 " onClose={closeModal} initialFocus={cancelButtonRef}>
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
              <Dialog.Panel className="bg-sn-lighter-orange xxs:max-w-[80%] sm-w-full relative transform overflow-hidden rounded-lg  text-left shadow-xl transition-all xxs:my-8 ">
                <div className=" px-4 pb-4 pt-5 xxs:p-6 xxs:pb-4">
                  <div className="xxs:flex xxs:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center xxs:mx-0 xxs:h-10 xxs:w-10">
                      <ExclamationTriangleIcon className="h-15 w-15 text-sn-main-orange" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center xxs:ml-4 xxs:mt-0 xxs:text-left">
                    <Dialog.Title as="h3" className="font-russoOne leading-6 text-2xl text-sn-main-orange">
                      REMOVE FROM TEAM
                    </Dialog.Title>
                      <div>
                        <p className="mt-4 text-game-blue">
                        Are you sure you want to remove</p>
                        
                        
                        <PersonTagNotDeletable name={name} number={number} isPlayer={isPlayer} />
                        <p className=" text-game-blue">
                        
                        from <strong>{team}</strong>?</p>
                        
                        
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" px-4 py-3 xxs:flex xxs:flex-row-reverse xxs:px-6">
                <button
                    type="button"
                    className="mt-3 xxs:max-h-12 xxs:text-center xxs:items-center inline-flex w-full focus:outline-none justify-center text-sn-main-orange rounded-lg bg-white px-5 py-7 text-lg shadow-sm  sm:w-auto"
                    onClick={closeModal}
                    ref={cancelButtonRef}
                  >
                    CANCEL
                  </button>
                <button
                    type="button"
                    className="inline-flex xxs:max-h-12 xxs:text-center xxs:items-center mt-3 mr-2 w-full justify-center rounded-lg bg-sn-main-orange px-5 py-7 text-lg text-white shadow-sm sm:ml-3 sm:w-auto"
                    onClick={() => { onConfirm(id); closeModal(); }}
                  >
                    CONFIRM
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
