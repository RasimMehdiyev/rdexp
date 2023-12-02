import { MapPinIcon, EnvelopeIcon, PhoneIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { PencilIcon } from '@heroicons/react/24/solid'
import { Link } from 'react-router-dom';




const AboutComponent = ( {teamData, clubData, isCoach}) => {
    
        console.log("IsCoach:", isCoach);
        return (

            <div className="w-full p-4 flex-col justify-start items-start gap-2 inline-flex">
                <div className="self-stretch flex-col justify-start items-start gap-2">
                    { isCoach && (
                    <div className="w-full self-stretch justify-between items-start inline-flex">
                        <div className="text-blue-800 text-2xl font-russoOne">Details</div>
                            <div className="w-[35px] h-[35px] relative"> 
                
                            <Link to={`/team-profile/edit/${clubData.id}/${teamData.id}`}>
                                <PencilIcon className='w-[24px] h-[24px] left-[5.5px] top-[5.5px] text-white relative z-10' />
                            </Link>
                            <div className="w-[35px] h-[35px] left-0 top-0 absolute bg-orange-500 rounded-full z-0" />                         
                                
                        </div>
                    </div>
                    )}
                    <div className="flex-col justify-start items-start gap-2 flex">
                        <div className="justify-start items-start gap-4 inline-flex">
                            <EnvelopeIcon className='w-6 h-6'/>
                                { teamData.email ? (
                                    <div className="text-neutral-600 text-sm font-normal font-['Inter']">{teamData.email}</div>
                                    ) : (
                                    <div className="text-neutral-600 text-sm font-normal font-['Inter']">No email</div>
                                )
                                }
                        </div>
                        <div className="justify-start items-center gap-4 inline-flex">
                                
                            <PhoneIcon className='w-6 h-6'/>
                                { teamData.phone_number ? (
                                    <div className="text-neutral-600 text-sm font-normal font-['Inter']">{teamData.phone_number}</div>
                                    ) : (
                                    <div className="text-neutral-600 text-sm font-normal font-['Inter']">No phone number</div>
                                )
                                }
                        </div>
                        <div className="justify-start items-start gap-4 inline-flex">
                            <MapPinIcon className='w-6 h-6'/>
                                { clubData.location ? (
                                    <div className="text-neutral-600 text-sm font-normal font-['Inter']">{clubData.location}</div>
                                    ) : (
                                    <div className="text-neutral-600 text-sm font-normal font-['Inter']">No location</div>
                                )
                                }
                        </div>
                    </div>
                </div>
                <div className="flex-col justify-start items-start gap-2 flex">
                    <div className="text-blue-800 text-2xl font-normal font-russoOne">Bio</div>
                        { clubData.description ? (
                            <div className="w-[343px] text-neutral-600 text-sm font-normal font-['Inter']">{clubData.description}</div>
                            ) : (
                            <div className="w-[343px] text-neutral-600 text-sm font-normal font-['Inter']">No bio</div>
                        )
                        }
                </div> 
            </div>
        )
}

export default AboutComponent;