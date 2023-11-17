import React, { useEffect } from 'react';
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faMinusSquare } from "@fortawesome/free-solid-svg-icons";
import PlayerDeletionModal from '../components/PlayerDeletionModal.js';
import PlayerAdditionModal from '../components/PlayerAdditionModal.js';
import RoleAdditionModal from '../components/RoleAdditionModal.js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/helper/supabaseClient';




const ClickablePerson = ({ name, isClicked, onClick }) => (
    <h5
      className={`font-interReg text-2xl cursor-pointer shadow-md p-2 rounded-md ${
        isClicked ? "bg-blue-200 rounded-lg p-2 w-2/4 shadow-md" : ""
      }`}
      onClick={onClick}
    >
      {name}
    </h5>
);



const TeamManagementPage = () => {
    const [isPlayerClicked, setPlayerClicked] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
      const isLoggedIn = async ()  =>{
          const user = await supabase.auth.getUser();
          if(!user.data.user){
              navigate('/auth');
          }
      }
      isLoggedIn();
    },[])

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

    const headerClass = "font-russoOne text-3xl text-blue-700 mb-5 mt-20";

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

    const RemoveIcon = ({ onClick }) => (
        <span className="ml-2 text-blue-200">
          <FontAwesomeIcon
            icon={faSignOutAlt}
            onClick={(event) => {
              event.stopPropagation();
              onClick();
            }}
            className="pl-3 fa-2x cursor-pointer"
          />
        </span>
      );


    function PlusButton({onClick}) {
        return (
          <button onClick={onClick} className="bg-blue-600 text-white shadow-lg rounded-lg mt-5 pt-2 pb-2 mb-2 w-full cursor-pointer">
          <FontAwesomeIcon icon={faPlus} className="ml-2 fa-2x"/>
          </button>
        );
      }

    return (
        <div className="h-screen"> 
            <div className="font-russoOne flex flex-col items-center">
                <h1 className=" text-4xl mt-8 text-blue-800 ">
                <span className="font-russoOne arrow-left text-blue-600  hover:text-blue-500"></span>
                Team 1
                <span className="font-russoOne arrow-right text-blue-600 hover:text-blue-500"></span>
                </h1>
            </div>

            <div style={{ margin:"2rem"}}>
                <h2 className={headerClass}>Players</h2>
                <div className="flex items-center mb-5">
                    <div className="font-russoOne circle-number shadow-md bg-sn-main-orange text-white mr-8">21</div>
                    <ClickablePerson
                    name="Michael Johnson"
                    isClicked={isPlayerClicked}
                    onClick={togglePlayerBackground}
                    />
                    {isPlayerClicked && <RemoveIcon onClick={openDeletionModal} />}
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
                    {isPersonClicked && <RemoveIcon onClick={openDeletionModal} />}
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
                    {isRoleClicked && <RemoveIcon onClick={openDeletionModal} />}
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