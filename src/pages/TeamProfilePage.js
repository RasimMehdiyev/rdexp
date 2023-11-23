import React, {useState} from 'react';
import { supabase } from '../lib/helper/supabaseClient';
import { MapPinIcon, EnvelopeIcon, PhoneIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { PencilIcon } from '@heroicons/react/24/solid'

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

const SettingsComponent = ({roles}) => {
    return (
        <div className="w-full py-4 flex-col justify-start items-center gap-6 inline-flex">
            <div className="self-stretch py-2 flex-col justify-start items-start gap-6 flex">
                <div className="self-stretch px-4 justify-start items-center gap-4 inline-flex">
                    <div className="text-blue-800 text-2xl font-normal font-russoOne leading-normal">Extra roles needed</div>
                    <div className="h-8 bg-blue-800 rounded-[10px] justify-center items-center gap-2.5 flex">
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
                            />
                        </div>
                        <img src={process.env.PUBLIC_URL + "images/check-circle-2.svg"} alt={`Check ${role}`} />
                        </div>
                    ))}
                    
                </div>
            </div>
        </div>
    )
}

const PlayerClickable = ({ clicked, name, number, onClick }) => {
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
                    <div className="w-8 h-[29.87px] pl-px pr-[0.70px] pt-[0.84px] pb-[0.79px] rounded-[4px] border-[2px] border-indigo-300 justify-center items-center flex">
                    <XMarkIcon className=' h-[20px] w-[20px] text-indigo-300'/>
                    </div>
                ): (
                    <div className="w-8 h-[29.87px] pl-px pr-[0.70px] pt-[0.84px] pb-[0.79px] rounded-[4px] justify-center items-center flex">
                    
                    </div>  
                )}
                
            </div>
        )
        
}

const ExtraClickable = ({ clicked, name, onClick }) => {
    return (
        <div className='w-full'>
            {clicked ? (
                    <div className="w-full px-4 justify-between items-center inline-flex">
                    <div className="w-[284px] h-[42px] px-2 bg-indigo-100 rounded-[10px] shadow justify-start items-center gap-2.5 inline-flex"
                    onClick={onClick}>
                            <div className="text-black text-xl font-normal font-['Inter']">{name}</div>
                        </div>
                        <div className="w-8 h-[29.87px] pl-px pr-[0.70px] pt-[0.84px] pb-[0.79px] rounded-[4px] border-[2px] border-indigo-300 justify-center items-center flex">
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
        </div>
    )
}

const TeamManagementComponent = ({ players, extras, onPlayerClick, onExtraClick }) => {   
    
    

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
                    <div className="h-8 bg-blue-800 rounded-[10px] justify-center items-center gap-2.5 flex">
                        <img src={process.env.PUBLIC_URL + "images/plus-square.svg"}></img>
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
                <div className="text-blue-800 text-2xl font-normal font-['Russo One'] leading-normal">Extra</div>
                <div className="h-8 bg-blue-800 rounded-[10px] justify-center items-center gap-2.5 flex">
                        <img src={process.env.PUBLIC_URL + "images/plus-square.svg"}></img>
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
    const [email, setEmail] = useState("coolguy@cool.com");
    const [phone, setPhone] = useState("+123456789");
    const [address, setAddress] = useState("Mongoose Street 89 3000 Leuven");
    const [bio, setBio] = useState("The Synthlete Dunkers are a renowned basketball team hailing from the historic city of Leuven, Belgium. Their inception was as unique as their name—a group of ambitious athletes from the local university who shared a passion for both sports and synthetic biology, a pioneering field at KU Leuven...");
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

    return (
        <div className="w-screen h-screen py-4 bg-gradient-to-b from-indigo-100 via-white to-white flex-col justify-start items-center flex">
        {/* should be component */}
            <div className=" justify-center items-center gap-[53px] flex">               
                    
            <img src={process.env.PUBLIC_URL + "images/arrow-left.svg"}></img>
            <div className="text-neutral-300 font-interReg text-xl">Synthlete Dunkers</div>
            <img src={process.env.PUBLIC_URL + "images/arrow-right.svg"}></img>                                
            
        </div>           
        
        <div className="self-stretch h-[258px] p-2 flex-col justify-start items-center gap-2 flex">
            <img className="w-[142px] h-[142px] rounded-[100px] border-4 border-white" src="https://via.placeholder.com/142x142" />
            <div className="flex-col justify-start items-center gap-1 flex">
                <div className="text-center text-blue-800 text-3xl font-russoOne">Synthlete Dunkers </div>
            </div>
            <div className="justify-center items-center gap-4 inline-flex">
                <div className="w-[177.12px] h-4 relative">
                    <div className="w-[15.87px] h-4 px-[1.74px] py-[0.45px] left-0 top-0 absolute flex-col justify-center items-center inline-flex">
                        <MapPinIcon className='h-6 w-6'></MapPinIcon>
                    </div>
                    <div className="w-[177px] h-[15px] left-[0.12px] top-0 absolute text-center text-neutral-300 text-xs font-interReg uppercase">Leuven City Stadium</div>
                </div>
            </div>
            <div className="w-28 justify-between items-start inline-flex">
                <img src={process.env.PUBLIC_URL + "images/facebook.svg"}></img>
                <img src={process.env.PUBLIC_URL + "images/instagram.svg"}></img>
                <img src={process.env.PUBLIC_URL + "images/twitter.svg"}></img>
            </div>
        </div>
        <Tabs tab={tab} onTabChange={handleTabChange} />
        {tab === 0 && (
            <AboutComponent
            email={email}
            phone={phone}
            address={address}
            bio={bio}
            />
        )}
            {tab === 1 && <TeamManagementComponent
                players={players}
                extras={extras}
                onPlayerClick={onPlayerClick}
                onExtraClick={onExtraClick}/>}
        {tab === 2 && <SettingsComponent roles={roles} />}
        
            
        
        </div>
    );
};

export default TeamProfilePage;