import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import RoleInput from '../components/RoleInput.js';

export default function RoleAdditionModal({ isOpen, closeModal }) {

  const cancelButtonRef = useRef(null)

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
          <div className="fixed inset-0 bg-black opacity-75 transition-opacity" />
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
              <Dialog.Panel className="bg-blue-200 sm-w-full relative transform overflow-hidden rounded-lgtext-left shadow-xl transition-all xxs:my-8 ">
                <div className=" px-4 pb-4 pt-5 xxs:p-6 xxs:pb-4">
                  <div className="xxs:flex xxs:items-start">
                    <div className="mt-3 text-center xxs:ml-2 xxs:mt-0 xxs:text-left">
                    <Dialog.Title as="h3" className="font-russoOne text-2xl leading-6 text-game-blue">
                    ADD ROLE
                    </Dialog.Title>
                      <div className="mt-4">
                          <RoleInput/>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4  py-3 xxs:flex xxs:flex-row-reverse xxs:px-6">
                
                  <button
                    type="button"
                    className="xxs:max-h-12 w-[80vw] xxs:text-center xxs:items-center inline-flex font-interELight mr-6 justify-center rounded-10px bg-game-blue px-3 py-4 text-lg text-white shadow-xxs xxs:ml-3 "
                    onClick={closeModal}>
                    SAVE
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
