import React, {useState} from 'react';
import { supabase } from '../lib/helper/supabaseClient';
import { MapPinIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'
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
                    {/* <div className="self-stretch px-4 justify-between items-center inline-flex">
                        
                        <div className="h-9 w-[275px] px-2 rounded-[10px] border border-orange-500 flex-col justify-center items-start gap-2.5 inline-flex">
                        <input                            
                            className="w-full border-none outline-none bg-transparent text-gray-500 font-interReg justify-center text-xl"                            
                            placeholder="Referee"
                            type="text"
                        />
                        </div>
                        <img src={process.env.PUBLIC_URL + "images/check-circle-2.svg"}/>
                    </div>
                    <div className="self-stretch px-4 justify-between items-center inline-flex">
                        <div className="h-9 w-[275px] px-2 rounded-[10px] border border-orange-500 flex-col justify-center items-start gap-2.5 inline-flex">
                        <input                            
                            className="w-full border-none outline-none bg-transparent text-gray-500 font-interReg justify-center text-xl"                            
                            placeholder="Catering"
                            type="text"
                        />
                        </div>
                        <img src={process.env.PUBLIC_URL + "images/check-circle-2.svg"}/>
                    </div> */}
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

// Functional component for the page
const TeamProfilePage = () => {
    const [email, setEmail] = useState("coolguy@cool.com");
    const [phone, setPhone] = useState("+123456789");
    const [address, setAddress] = useState("Mongoose Street 89 3000 Leuven");
    const [bio, setBio] = useState("The Synthlete Dunkers are a renowned basketball team hailing from the historic city of Leuven, Belgium. Their inception was as unique as their name—a group of ambitious athletes from the local university who shared a passion for both sports and synthetic biology, a pioneering field at KU Leuven...");
    const [roles, setRoles] = useState(["Referee", "Catering", "Referee 2"])

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
            
        <div className="w-full border-b border-orange-500 justify-between items-center flex py-2">
            <div className="basis-1/3 justify-center items-center flex">
                <div className="w-[85px] bg-indigo-100 rounded-lg justify-center items-center flex">
                    <div className="text-center text-blue-800 text-xl font-interReg]">About</div>
                </div>
            </div>
            <div className="basis-1/3 justify-center items-center flex">
                <div className="w-[104px] rounded-lg justify-center items-center flex">
                    <div className="text-center text-neutral-300 text-xl font-interReg]">Members</div>
                </div>
            </div>
            <div className="basis-1/3 justify-center items-center flex">
                <div className="w-[85px] rounded-lg justify-center items-center flex">
                    <div className="text-center text-neutral-300 text-xl font-interReg]">Settings</div>
                </div>
            </div>
        </div>          
            {/* <AboutComponent
                email={email}
                phone={phone}
                address={address}
                bio={bio}
            /> */}
            <SettingsComponent
                roles = {roles}
            />
        
        </div>
    );
};

export default TeamProfilePage;