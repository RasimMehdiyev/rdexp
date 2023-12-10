import { EnvelopeIcon, PhoneIcon} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';





const AboutComponent = ( {teamData, clubData, isCoach}) => {
    

        return (

            <div className="w-full p-4 flex-col justify-start items-start gap-2 inline-flex">
                <div className="self-stretch flex-col justify-start items-start gap-2">
                    { isCoach && (
                    <div className="w-full self-stretch justify-between items-start inline-flex">
                        <div className="text-blue-800 text-2xl font-russoOne">Details</div>
                        <Link to={`/team-profile/edit/${clubData.id}/${teamData.id}`} className='flex items-center space-x-2 p-2 rounded-md justify-start'>
                            <div className="bg-orange-500 rounded-full p-2 flex items-center justify-center w-8 h-8">
                                <FontAwesomeIcon icon={faPencil} className="h-4 w-4 text-white"/> 
                            </div>
                        </Link>
                    </div>
                    )}
                    <div className="flex-col justify-start items-start gap-2 flex">
                        <div className="inline-flex items-center gap-4">
                            <EnvelopeIcon className='w-6 h-6'/>
                            { teamData.email ? (
                                <div className="text-neutral-600 text-sm font-normal font-['Inter']">{teamData.email}</div>
                                ) : (
                                <div className="text-neutral-600 text-sm font-normal font-['Inter']">No email</div>
                            )}
                        </div>

                        <div className="inline-flex items-center gap-4">
                            <PhoneIcon className='w-6 h-6'/>
                            { teamData.phone_number ? (
                                <div className="text-neutral-600 text-sm font-normal font-['Inter']">{teamData.phone_number}</div>
                                ) : (
                                <div className="text-neutral-600 text-sm font-normal font-['Inter']">No phone number</div>
                            )}
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