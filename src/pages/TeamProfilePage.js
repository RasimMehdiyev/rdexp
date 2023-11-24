import { useEffect, useState } from 'react';
import { supabase } from '../lib/helper/supabaseClient';
import LoadingPage from "./LoadingPage";
import { MapPinIcon, EnvelopeIcon, PhoneIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { PencilIcon } from '@heroicons/react/24/solid'
import PlayerDeletionModal from '../components/PlayerDeletionModal.js';
import PlayerAdditionModal from '../components/PlayerAdditionModal.js';
import RoleAdditionModal from '../components/RoleAdditionModal.js';

const AboutComponent = ({email, phone, address, bio}) => {
    return (
        <div className="w-full p-4 flex-col justify-start items-start gap-2 inline-flex">
        <div className="self-stretch flex-col justify-start items-start gap-2">
            <div className="w-full self-stretch justify-between items-start inline-flex">
                <div className="text-blue-800 text-2xl font-russoOne">Details</div>
                {/* should be component */}
                    <div className="w-[35px] h-[35px] relative"> 
                    <PencilIcon className='w-[24px] h-[24px] left-[5.5px] top-[5.5px] text-white relative z-10'></PencilIcon>
                    <div className="w-[35px] h-[35px] left-0 top-0 absolute bg-orange-500 rounded-full z-0" />                         
                          
                </div>
            </div>
            <div className="flex-col justify-start items-start gap-2 flex">
                <div className="justify-start items-start gap-4 inline-flex">
                    <EnvelopeIcon className='w-6 h-6'/>
                        <div className="text-neutral-600 text-sm font-normal font-['Inter']">{email}</div>
                </div>
                <div className="justify-start items-center gap-4 inline-flex">
                          
                    <PhoneIcon className='w-6 h-6'/>
                        <div className="text-neutral-600 text-sm font-normal font-['Inter']">{ phone}</div>
                </div>
                <div className="justify-start items-start gap-4 inline-flex">
                    <MapPinIcon className='w-6 h-6'/>
                        <div className="text-neutral-600 text-sm font-normal font-['Inter']">{ address}</div>
                </div>
            </div>
        </div>
        <div className="flex-col justify-start items-start gap-2 flex">
            <div className="text-blue-800 text-2xl font-normal font-russoOne">Bio</div>
            <div className="w-[343px] text-neutral-600 text-sm font-normal font-['Inter']">{bio}</div>
        </div> 
    </div>
    )
}

const SettingsComponent = ({ roles, onDeleteRole, onAddRole, onUpdateRole }) => {
    const [isRoleModalOpen, setRoleModalOpen] = useState(false);
    
    const [editedRoles, setEditedRoles] = useState(Array.from({ length: roles.length }, () => ''));
    console.log("this is how much in edited roles")
    console.log(editedRoles)
    const handleDeleteRole = (roleIndex) => {
        const updatedRoles = [...roles];
        const deletedRole = updatedRoles.splice(roleIndex, 1)[0];
        
        // Update roles in the parent component
        onDeleteRole(updatedRoles);
        console.log("deleted role, now it's:")
        console.log(updatedRoles)
        
    };

    const handleAddRole = (newRole) => {
        const updatedRoles = [...roles, newRole];

        // Update roles in the parent component
        onAddRole(updatedRoles);
        console.log("added a role, now it's:")
        console.log(updatedRoles)
        
    };    

    const handleInputChange = (e, index) => {
        
        setEditedRoles((prevEditedRoles) => {
            const newEditedRoles = [...prevEditedRoles]; // Create a copy of the array
            newEditedRoles[index] = e.target.value; // Modify the desired element
            return newEditedRoles; // Update the state with the modified array
        });
        console.log(editedRoles)
    };

    const handleInputBlur = (index) => {
        console.log("handling edit blur, index: %d", index)
        const editedRole = editedRoles[index];
        
        if (editedRole !== undefined && editedRole != '') {
            // Update roles in the parent
            onUpdateRole(index, editedRole);
            // Clear the input field
            // const updatedRoles = [...editedRoles];
            // updatedRoles[index] = '';
            //setEditedRoles(updatedRoles);
            setEditedRoles((prevEditedRoles) => {
                const newEditedRoles = [...prevEditedRoles]; // Create a copy of the array
                newEditedRoles[index] = ''; // Modify the desired element
                return newEditedRoles; // Update the state with the modified array
            });
        }
    };

    const handleInputKeyPress = (e, index) => {
    if (e.key === 'Enter') {
        handleInputBlur(index);
        //inputRef.current.blur(); // This will unselect the input
    }
    };
    return (
        <div className="w-full py-4 flex-col justify-start items-center gap-6 inline-flex">
            <div className="self-stretch py-2 flex-col justify-start items-start gap-6 flex">
                <div className="self-stretch px-4 justify-start items-center gap-4 inline-flex">
                    <div className="text-blue-800 text-2xl font-normal font-russoOne leading-normal">Extra roles needed</div>
                    <div className="h-8 bg-blue-800 rounded-[10px] justify-center items-center gap-2.5 flex"
                        onClick={() => setRoleModalOpen(true)}>
                        <img src={process.env.PUBLIC_URL + "images/plus-square.svg"}></img>
                    </div>
                </div>
                <div className="self-stretch h-44 flex-col justify-start items-start gap-4 flex">
                    
                    {roles.map((role, index) => (
                        <div key={index} className="self-stretch px-4 justify-between items-center inline-flex">
                        <div className="h-9 w-[275px] px-2 rounded-[10px] border border-orange-500 flex-col justify-center items-start gap-2.5 inline-flex">
                            <input
                            className="w-full border-none outline-none bg-transparent text-gray-500 font-interReg justify-center text-xl"
                            placeholder={role}
                            type="text"
                            value={editedRoles[index]}
                            onChange={(e) => handleInputChange(e, index)}
                            onBlur={()=> handleInputBlur(index)}
                            onKeyPress={(e) => handleInputKeyPress(e, index)}
                            
                            />
                        </div>
                            {/* <img src={process.env.PUBLIC_URL + "images/check-circle-2.svg"} alt={`Check ${role}`} /> */}
                            <div className="w-8 h-[29.87px] pl-px pr-[0.70px] pt-[0.84px] pb-[0.79px] rounded-[4px] border-[2px] border-indigo-300 justify-center items-center flex"
                                onClick={() => handleDeleteRole(index)} >
                            <XMarkIcon className=' h-[20px] w-[20px] text-indigo-300'/>
                            </div>
                        </div>
                    ))}
                    
                </div>
            </div>
        <RoleAdditionModal isOpen={isRoleModalOpen} closeModal={() => setRoleModalOpen(false)} onAddRole={handleAddRole} />
        </div>
    )
}

const PlayerClickable = ({ clicked, name, number, onClick }) => {
        const [isDeletionModalOpen, setDeletionModalOpen] = useState(false);
        return (
            <div className="self-stretch pl-3 pr-4 justify-between items-center inline-flex">
                <div className=" self-stretch px-1 py-2 rounded-[10px] justify-start items-center gap-[12px] flex">
                    <div className="w-[43px] h-[42px] flex items-center justify-center rounded-full bg-orange-500">
                        <div className=" text-white text-2xl font-russoOne z-10">{number}</div>                        
                    </div>
                    {clicked ? (
                        <div className="w-[229px] self-stretch px-2 bg-indigo-100 rounded-[10px] shadow justify-start items-center gap-2.5 flex"
                            onClick={onClick}>
                            <div className="text-black text-xl font-interReg">{name}</div>
                        </div>
                        ): (
                            <div className="w-[229px] self-stretch px-2 rounded-[10px] shadow justify-start items-center gap-2.5 flex"
                            onClick={onClick}>
                            <div className="text-black text-xl font-interReg">{name}</div>
                        </div> 
                        )}
                    
                </div>
                {clicked ? (
                    <div className="w-8 h-[29.87px] pl-px pr-[0.70px] pt-[0.84px] pb-[0.79px] rounded-[4px] border-[2px] border-indigo-300 justify-center items-center flex"
                        onClick={() => setDeletionModalOpen(true)}>
                    <XMarkIcon className=' h-[20px] w-[20px] text-indigo-300'/>
                    </div>
                ): (
                    <div className="w-8 h-[29.87px] pl-px pr-[0.70px] pt-[0.84px] pb-[0.79px] rounded-[4px] justify-center items-center flex">
                    
                    </div>  
                )}
            <PlayerDeletionModal isOpen={isDeletionModalOpen} closeModal={() => setDeletionModalOpen(false)} />
            </div>
        )
        
}

const ExtraClickable = ({ clicked, name, onClick }) => {
    const [isDeletionModalOpen, setDeletionModalOpen] = useState(false);
    return (
        <div className='w-full'>
            {clicked ? (
                    <div className="w-full px-4 justify-between items-center inline-flex">
                    <div className="w-[284px] h-[42px] px-2 bg-indigo-100 rounded-[10px] shadow justify-start items-center gap-2.5 inline-flex"
                    onClick={onClick}>
                            <div className="text-black text-xl font-normal font-['Inter']">{name}</div>
                        </div>
                    <div className="w-8 h-[29.87px] pl-px pr-[0.70px] pt-[0.84px] pb-[0.79px] rounded-[4px] border-[2px] border-indigo-300 justify-center items-center flex"
                        onClick={() => setDeletionModalOpen(true)}>
                            <XMarkIcon className=' h-[20px] w-[20px] text-indigo-300'/>
                        </div>
                    </div>
            ) : (
                    <div className="w-full px-4 justify-start items-start flex">
                        <div className="w-[284px] h-[42px] px-2 bg-white rounded-[10px] shadow justify-start items-center gap-2.5 inline-flex"
                        onClick={onClick}>
                            <div className="text-black text-xl font-normal font-['Inter']">{name}</div>
                        </div>
                    </div>
            )                
            }
        <PlayerDeletionModal isOpen={isDeletionModalOpen} closeModal={() => setDeletionModalOpen(false)} />
        </div>
    )
}

const TeamManagementComponent = ({ players, extras, onPlayerClick, onExtraClick }) => {
    
    const [isAdditionModalOpen, setAdditionModalOpen] = useState(false);

    return (
        <div className="w-full py-4 bg-white flex-col justify-start items-center gap-6 inline-flex">
            <div className="self-stretch h-[67px] px-4 flex-col justify-start items-start gap-[19px] flex">
                <div className="self-stretch justify-start items-start gap-[19px] inline-flex">
                    <div className="basis-0 text-blue-800 text-2xl font-russoOne">Coach</div>
                </div>
                <div className="justify-start items-center gap-[19px] inline-flex">
                    <div className="text-black text-xl font-interReg">Jeff Hugh</div>
                </div>
            </div>
            <div className="self-stretch py-2 flex-col justify-start items-start gap-6 flex">
                <div className="self-stretch px-4 justify-start items-center gap-4 inline-flex">
                    <div className="text-blue-800 text-2xl font-russoOne leading-normal">Players</div>
                    <div className="h-8 bg-blue-800 rounded-[10px] justify-center items-center gap-2.5 flex" onClick={() => setAdditionModalOpen(true)}>
                        <img src={process.env.PUBLIC_URL + "images/plus-square.svg"}
                            ></img>
                    </div>
                </div>
                <div className="self-stretch flex-col justify-start items-start gap-4 flex">
                    {players.map((player) => (
                        <PlayerClickable
                            key={player.id}
                            clicked={player.clicked}
                            name={player.name}
                            number={player.number}
                            onClick={() => onPlayerClick(player.id)}
                        />
                    ))}
                </div>
            </div>
            <div className="self-stretch px-4 justify-start items-center gap-4 inline-flex">
                <div className="text-blue-800 text-2xl font-russoOne">Extra</div>
                <div className="h-8 bg-blue-800 rounded-[10px] justify-center items-center gap-2.5 flex" onClick={() => setAdditionModalOpen(true)}>
                        <img src={process.env.PUBLIC_URL + "images/plus-square.svg"}
                            ></img>
                    </div>
            </div>
            <div className="self-stretch h-[103px] flex-col justify-start items-start gap-[19px] flex">                
                {extras.map((extra) => (
                    <ExtraClickable
                        key={extra.id}
                        clicked={extra.clicked}
                        name={extra.name}
                        onClick={() => onExtraClick(extra.id)}
                    />
                ))}                
            </div>
            
            <PlayerAdditionModal isOpen={isAdditionModalOpen} closeModal={() => setAdditionModalOpen(false)} />
            
        </div>
    )
}

const Tabs = ({ tab, onTabChange }) => {
  return (
    <div className="w-full border-b border-orange-500 justify-between items-center flex py-2">
      <div
        className="basis-1/3 justify-center items-center flex "
        onClick={() => onTabChange(0)}
      >
        <div className={`w-[85px] rounded-lg justify-center items-center flex ${
            tab === 0 ? 'bg-indigo-100' : ''
            }`}>
          <div className={`text-center ${tab === 0 ? 'text-blue-800' : 'text-neutral-300'} text-xl font-interReg]`}>
            About
          </div>
        </div>
      </div>
      <div
        className="basis-1/3 justify-center items-center flex "
        onClick={() => onTabChange(1)}
      >
        <div className={`w-[104px] rounded-lg justify-center items-center flex ${
            tab === 1 ? 'bg-indigo-100' : ''
            }`}>
          <div className={`text-center ${tab === 1 ? 'text-blue-800' : 'text-neutral-300'} text-xl font-interReg]`}>
            Members
          </div>
        </div>
      </div>
      <div
        className="basis-1/3 justify-center items-center flex "
        onClick={() => onTabChange(2)}
      >
        <div className={`w-[85px] rounded-lg justify-center items-center flex ${
            tab === 2 ? 'bg-indigo-100' : ''
            }`}>
          <div className={`text-center ${tab === 2 ? 'text-blue-800' : 'text-neutral-300'} text-xl font-interReg]`}>
            Settings
          </div>
        </div>
      </div>
    </div>
  );
};

// Functional component for the page
const TeamProfilePage = () => {
    const [teamData, setTeamData] = useState({});
    const [teamSocialsData, setTeamSocialsData] = useState({});
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState(["Referee", "Catering", "Referee 2"]);

    const [tab, setTab] = useState(0);
    // Define the state for players and extras
    const [players, setPlayers] = useState([
        { id: 1, clicked: false, name: 'John Williams', number:21 },
        { id: 2, clicked: false, name: 'Trae Y', number: 43 },
        { id: 3, clicked: false, name: 'Mikey Jordy', number: 5 },
        { id: 4, clicked: false, name: 'Luka Duka', number:10 },
        // Add more people as needed
    ]);

    const [extras, setExtras] = useState([
        { id: 1, clicked: false, name: 'John Doe X' },
        { id: 2, clicked: false, name: 'Jane Doe X' },
        // Add more people as needed
    ]);
    
    const [isRoleModalOpen, setRoleModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () =>{
            console.log("Fetching data team");
            try {
                const userResponse = await supabase.auth.getUser();
                const user = userResponse.data.user;

                const { data: user_data, error:  userError} = await supabase
                .from('users') 
                .select('*') 
                .eq('user_id', user.id) 
                .single();
                if (userError) throw userError;

                const { data: team_user_data, error: teamUserError } = await supabase
                    .from('team_users')
                    .select('team_id')
                    .eq('user_id', user_data.id)
                    .single();

                if (teamUserError) throw teamUserError;

                const { data: team_data, error: teamError } = await supabase
                    .from('team')
                    .select('*')
                    .eq('id', team_user_data.team_id)
                    .single();
                if (teamError) throw teamError;


                const { data: team_socials_data, error: teamSocialsError } = await supabase
                    .from('team_socials')
                    .select('*')
                    .eq('team_id', team_data.id)
                    .single();
                if (teamSocialsError) throw teamSocialsError;

                setTeamData(team_data);
                setTeamSocialsData(team_socials_data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const handleTabChange = (newTab) => {
        setTab(newTab);
    };    

    // Define the functions to handle player and extra clicks
    const onPlayerClick = (id) => {
        setPlayers((prevPlayers) =>
            prevPlayers.map((player) =>
                player.id === id ? { ...player, clicked: !player.clicked } : { ...player, clicked: false }
            )
        );
    };

    const onExtraClick = (id) => {
        setExtras((prevExtras) =>
            prevExtras.map((extra) =>
                extra.id === id ? { ...extra, clicked: !extra.clicked } : { ...extra, clicked: false }
            )
        );
    };

    const handleDeleteRole = (updatedRoles) => {
        setRoles(updatedRoles);
        
    };

    const handleAddRole = (updatedRoles) => {
        setRoles(updatedRoles);
        
    };

    const handleUpdateRole = (index, newRole) => {
        console.log(roles)
        console.log("index and new: %d %s", index, newRole)
        setRoles((prevRoles) => {
            const updatedRoles = [...prevRoles];
            updatedRoles[index] = newRole;
            return updatedRoles;
        });
        console.log('Updated roles:', roles);
    };
    if (loading) {
        return <LoadingPage />;
    }
    else{
        return (
            <div className="w-screen h-screen py-4 bg-gradient-to-b from-indigo-100 via-white to-white flex-col justify-start items-center flex">
            {/* should be component */}
                <div className=" justify-center items-center gap-[53px] flex">               
                        
                <img src={process.env.PUBLIC_URL + "images/arrow-left.svg"}></img>
                <div className="text-neutral-300 font-interReg text-xl">{teamData.team_name}</div>
                <img src={process.env.PUBLIC_URL + "images/arrow-right.svg"}></img>                                
                
            </div>           
            
            <div className="self-stretch h-[258px] p-2 flex-col justify-start items-center gap-2 flex">
                <img className="w-[142px] h-[142px] rounded-[100px] border-4 border-white" src="https://via.placeholder.com/142x142" />
                <div className="flex-col justify-start items-center gap-1 flex">
                    <div className="text-center text-blue-800 text-3xl font-russoOne">{teamData.team_name}</div>
                </div>
                <div className="justify-center items-center gap-4 inline-flex">
                    <div className="w-[177.12px] h-4 relative">
                        <div className="w-[15.87px] h-4 px-[1.74px] py-[0.45px] left-0 top-0 absolute flex-col justify-center items-center inline-flex">
                            <MapPinIcon className='h-6 w-6'></MapPinIcon>
                        </div>
                        <div className="w-[177px] h-[15px] left-[0.12px] top-0 absolute text-center text-neutral-300 text-xs font-interReg uppercase">{teamData.stadium}</div>
                    </div>
                </div>
                <div className="w-28 justify-between items-start inline-flex">
                    {teamSocialsData && teamSocialsData.facebook_handle && (
                        <a href={`https://facebook.com/${teamSocialsData.facebook_handle}`} target="_blank" rel="noopener noreferrer">
                        <img src={process.env.PUBLIC_URL + "/images/facebook.svg"} alt="Facebook" />
                        </a>
                    )}
                    {teamSocialsData && teamSocialsData.x_handle && (
                        <a href={`https://instagram.com/${teamSocialsData.instagram_handle}`} target="_blank" rel="noopener noreferrer">
                        <img src={process.env.PUBLIC_URL + "/images/instagram.svg"} alt="Instagram" />
                        </a>
                    )}
                    {teamSocialsData && teamSocialsData.x_handle && (
                        <a href={`https://x.com/${teamSocialsData.x_handle}`} target="_blank" rel="noopener noreferrer">
                        <img src={process.env.PUBLIC_URL + "/images/twitter.svg"} alt="Twitter" />
                        </a>
                    )}
                </div>
            </div>
            <Tabs tab={tab} onTabChange={handleTabChange} />
            {tab === 0 && (
                <AboutComponent
                email={teamData.email}
                phone={teamData.phone_number}
                address={teamData.adress}
                bio={teamData.bio}
                />
            )}
                {tab === 1 && <TeamManagementComponent
                    players={players}
                    extras={extras}
                    onPlayerClick={onPlayerClick}
                    onExtraClick={onExtraClick}/>}
                {tab === 2 && <SettingsComponent roles={roles} onDeleteRole={handleDeleteRole} onAddRole={handleAddRole} onUpdateRole={ handleUpdateRole} />}
            
                
            
            </div>
        );
    }
    
};

export default TeamProfilePage;