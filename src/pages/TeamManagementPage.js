import React from 'react';
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import PlayerDeletionModal from '../components/PlayerDeletionModal.js';
import PlayerAdditionModal from '../components/PlayerAdditionModal.js';
import RoleAdditionModal from '../components/RoleAdditionModal.js';

const ClickablePerson = ({ name, isClicked, onClick }) => (
    <h5
      className={`font-interReg cursor-pointer ${
        isClicked ? "bg-blue-200 rounded-lg p-2 w-2/4 shadow-md" : ""
      }`}
      style={{ fontSize: "2rem" }}
      onClick={onClick}
    >
      {name}
    </h5>
);



const TeamManagementPage = () => {
    const [isPlayerClicked, setPlayerClicked] = useState(false);

    const togglePlayerBackground = () => {
        setPlayerClicked(!isPlayerClicked);
        setRoleClicked(false);
        setPersonClicked(false);
    };

    const [isPersonClicked, setPersonClicked] = useState(false);

    const togglePersonBackground = () => {
        setPersonClicked(!isPersonClicked);
        setPlayerClicked(false);
        setRoleClicked(false);
    };

    const [isRoleClicked, setRoleClicked] = useState(false);

    
    const toggleRoleBackground = () => {
        setRoleClicked(!isRoleClicked);
        setPersonClicked(false);
        setPlayerClicked(false);
    }


    const headerClass = "font-russoOne text-5xl text-blue-700 mb-5 mt-20";

    const [isDeletionModalOpen, setDeletionModalOpen] = useState(false);

    const openDeletionModal = () => {
        setDeletionModalOpen(true);
      };
    
      const closeDeletionModal = () => {
        setDeletionModalOpen(false);
      };

    const [isAdditionModalOpen, setAdditionModalOpen] = useState(false);

    const openAdditionModal = () => {
        setAdditionModalOpen(true);
      };
    
      const closeAdditionModal = () => {
        setAdditionModalOpen(false);
      };

    const [isRoleModalOpen, setRoleModalOpen] = useState(false);

    const openRoleModal = () => {
          setRoleModalOpen(true);
     };
      
    const closeRoleModal = () => {
          setRoleModalOpen(false);
    };

    const CloseIcon = ({ onClick }) => (
        <span className="ml-2 text-blue-200">
          <FontAwesomeIcon
            icon={faWindowClose}
            onClick={(event) => {
              event.stopPropagation();
              onClick();
            }}
            className="pl-3 fa-4x cursor-pointer"
          />
        </span>
      );


    function PlusButton({onClick}) {
        return (
          <button onClick={onClick} className="bg-blue-500 text-white rounded-lg mt-5 pt-5 pb-5 mb-10 w-3/4 cursor-pointer">
          <FontAwesomeIcon icon={faPlus} className="ml-2 fa-2x"/>
          </button>
        );
      }

    return (
        <div className="h-screen"> 
            <div className="font-inter flex flex-col items-center">
                <h1 className=" text-5xl mt-8">
                <span className="font-russoOne arrow-left text-blue-700 hover:text-blue-500"></span>
                Team 1
                <span className="font-russoOne arrow-right text-blue-700 hover:text-blue-500"></span>
                </h1>
            </div>

            <div style={{ marginLeft:"2rem"}}>
                <h2 className={headerClass}>Players</h2>
                <div className="flex items-center mb-5">
                    <div className="font-russoOne circle-number bg-sn-main-orange text-white mr-8">21</div>
                    <ClickablePerson
                    name="Michael Johnson"
                    isClicked={isPlayerClicked}
                    onClick={togglePlayerBackground}
                    />
                    {isPlayerClicked && <CloseIcon onClick={openDeletionModal} />}
                </div>

                <PlusButton onClick={openAdditionModal}>
                </PlusButton>

                <h2 className={headerClass}>Extras</h2>
                <div className="flex items-center mb-5">
                    <ClickablePerson
                        name="Jessica Lee"
                        isClicked={isPersonClicked}
                        onClick={togglePersonBackground}
                    />
                    {isPersonClicked && <CloseIcon onClick={openDeletionModal} />}
                </div>

                <PlusButton onClick={openAdditionModal}>
                </PlusButton>

                <h2 className={headerClass}>Extra roles needed</h2>
                <div className="flex items-center mb-5">
                    <ClickablePerson
                        name="Referee"
                        isClicked={isRoleClicked}
                        onClick={toggleRoleBackground}
                    />
                    {isRoleClicked && <CloseIcon onClick={openDeletionModal} />}
                </div>

                <PlusButton onClick={openRoleModal}>
                </PlusButton>

            </div>
            <PlayerDeletionModal isOpen={isDeletionModalOpen} closeModal={closeDeletionModal} />
            <PlayerAdditionModal isOpen={isAdditionModalOpen} closeModal={closeAdditionModal} />
            <RoleAdditionModal isOpen={isRoleModalOpen} closeModal={closeRoleModal} />
            
        </div>
    );
};

export default TeamManagementPage;