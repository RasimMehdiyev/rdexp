import React,  { useEffect, useState } from "react";
import { supabase } from '../lib/helper/supabaseClient';
import LoadingPage from "./LoadingPage";
import { PencilIcon } from '@heroicons/react/24/solid'
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom';
import StickyEditTeamComponent from "../components/StickyEditTeamComponent";
import { useParams } from 'react-router-dom';

const EditTeamPage = () => {
    const { clubId, teamId } = useParams();

    const [clubData, setClubData] = useState({});
    const [teamData, setTeamData] = useState({});
    const [teamSocialsData, setTeamSocialsData] = useState({});
    
    const [newTeamName, setNewTeamName] = useState('');
    const [newBio, setNewBio] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const [newLocation, setNewLocation] = useState('');
    const [newStadium, setNewStadium] = useState('');
    const [newX, setNewX] = useState('');
    const [newInstagram, setNewInstagram] = useState('');
    const [newFacebook, setNewFacebook] = useState('');
    

    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(true); // Add a loading state
    // navigate
    const navigate = useNavigate();
    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
    
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
           
        };
        reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            console.log("Fetching data");
            try {

                const { data: team_data, error: teamError } = await supabase
                    .from('team')
                    .select('*')
                    .eq('id', teamId)
                    .single();
                if (teamError) throw teamError;
                setTeamData(team_data);

                const { data: team_socials_data, error: teamSocialsError } = await supabase
                    .from('team_socials')
                    .select('*')
                    .eq('id', teamId)
                    .single();
                if (teamSocialsError) throw teamSocialsError;
                setTeamSocialsData(team_socials_data);

                setNewX(teamSocialsData.x_handle);
                setNewInstagram(teamSocialsData.instagram_handle);
                setNewFacebook(teamSocialsData.facebook_handle);


                    
                        
                const { data: club_data, error: clubError } = await supabase
                    .from('club')
                    .select('*')
                    .eq('id', clubId)
                    .single(); 
                if (clubError) throw clubError;
                setClubData(club_data);

                setNewBio(clubData.description);
                setNewEmail(teamData.email);
                setNewPhoneNumber(teamData.phone_number);
                setPreviewImage(clubData.picture);
                setNewLocation(clubData.location);
                setNewStadium(clubData.stadium);

          } catch (error) {
            console.error("Error fetching data:", error);
          }
          finally {
            setLoading(false); // Stop loading regardless of the outcome
          }
        };
    
        fetchData();
    }, []);

    const validateEmail = (newEmail) => {
        // Regular expression for a valid email address
        if (newEmail != '') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailPattern.test(newEmail);
        } else return true;
        
    };

    const validatePhoneNumber = (newPhoneNumber) => {
        // Regular expression for a valid phone number
        if (newPhoneNumber != '') {
            const phonePattern = /^[\d\+\-\s]+$/;
            return phonePattern.test(newPhoneNumber);
        } else return true;
        
    };
    
    const onSave = async (event) => {
        setLoading(true);
        event.preventDefault();
        
        if (!validateEmail(newEmail) | !validatePhoneNumber(newPhoneNumber)) {
            if (!validateEmail(newEmail)) {
                setEmailError('Email is not valid.');                
            } else {
                setEmailError('');
            }
            // Validate phone number
            if (!validatePhoneNumber(newPhoneNumber)) {
                setPhoneNumberError('Phone number is not valid.');
            } else {
                setPhoneNumberError('');
            }
            setLoading(false)
            return;
        }
    

        try {
            const { data: team_data, error: teamError } = await supabase
                .from('team')
                .update({
                    email: newEmail,
                    phone_number: newPhoneNumber,
                })
                .eq('id', teamId)
                .single();
            if (teamError) throw teamError;
            setTeamData(team_data);        
            
            const { data: club_data, error: clubError } = await supabase
                .from('club')
                .update({
                    description: newBio,
                    location: newLocation,
                    stadium: newStadium,
                    picture: previewImage,
                })
                .eq('id', clubId)
                .single();
            if (clubError) throw clubError;
            setClubData(club_data);    

                
                        
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
            navigate('/team-profile/'+clubId+'/'+teamId+'/');
        }

    };

    
    if (loading) {
        return <LoadingPage />; // You can replace this with any loading spinner or indicator
    } else {
        return (
            <div>
            <StickyEditTeamComponent onSave={onSave}/>
            <div className="grow flex bg-indigo-100 flex-col items-center justify-start h-screen">
                <div className="grow p-4 flex-col justify-start items-center gap-4 inline-flex">
                    <div className="w-[329px] justify-center items-start gap-2.5 inline-flex">
                        <div className="w-[142px] h-[142px] relative">
                        
                            <label htmlFor="profilePictureInput">
                            {previewImage ? (
                            <img className="w-[142px] h-[142px] rounded-full object-cover overflow-hidden cursor-pointer" src={previewImage} alt="Preview" />
                            ) : (
                            <img className="w-[142px] h-[142px] rounded-full border-4 border-white cursor-pointer" src={process.env.PUBLIC_URL + "/images/no_user.png"} alt="No user" />
                            )}

                            <div className="w-[35px] h-[35px] left-[107px] top-[98px] absolute">
                            <div className="w-[35px] h-[35px] left-[-3px] top-0 absolute bg-blue-600 rounded-full flex justify-center items-center cursor-pointer">
                                <PencilIcon className="h-6 w-6 text-white" />
                            </div>
                            </div>
                            </label>
                            <input
                                type="file"
                                id="profilePictureInput"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            
                            />
                        </div>
                    </div>
                    <div className="flex-col justify-start items-start gap-2 flex">
                        <div className="flex-col justify-start items-start gap-1 flex">
                            <div className="px-4 justify-start items-start gap-2.5 inline-flex">
                                <div className="text-blue-600 text-xl font-russoOne">Team Name</div>
                            </div>
                            <div className="w-[322px] h-8 pl-5 pr-4 py-3 bg-white rounded-md border border-blue-600  justify-start items-center gap-2.5 inline-flex">
                                <div className="w-full h-auto basis-0 justify-start items-center flex">
                                    <input
                                        className='text-neutral-500 text-base font-normal font-interReg leading-normal'
                                        placeholder={teamData.team_name}
                                        type="text"
                                        value={newTeamName}
                                            onChange={(event) => {
                                                setNewTeamName(event.target.value);
                                             }
                                        } />
                                </div>
                            </div>
                        </div>                                                 
                    </div>
                    <div className="flex-col justify-start items-start gap-2 flex">
                        <div className="flex-col justify-start items-start gap-1 flex">
                        <div className="px-4 justify-start items-start gap-2.5 inline-flex">
                            <div className="text-blue-600 text-xl font-russoOne">Contact details</div>
                        </div>
                        <div className="w-[322px] h-8 pl-5 pr-4 py-3 bg-white rounded-md border border-blue-600  justify-start items-center gap-2.5 inline-flex">
                            <EnvelopeIcon className="h-5 w-5 text-neutral-500"></EnvelopeIcon>
                            <div className="w-full h-auto basis-0 justify-start items-center flex">
                                <input
                                    className='text-neutral-500 text-base font-normal font-interReg leading-normal'
                                    placeholder={teamData.email}
                                    type="email"
                                    value={newEmail}
                                        onChange={(event) => {
                                            setNewEmail(event.target.value);
                                            setEmailError(''); }
                                    } />
                            </div>
                        </div>
                        {(emailError != '') ? <div className="text-red-500">{emailError}</div>:<div></div>}
                        <div className="w-[322px] h-8 pl-5 pr-4 py-3 bg-white rounded-md border border-blue-600 justify-start items-center gap-2.5 inline-flex">
                            <PhoneIcon className="h-5 w-5 text-neutral-500"></PhoneIcon>
                            <div className="w-full h-auto basis-0 justify-start items-center flex">                            
                                <input
                                    className="text-neutral-500 text-base font-normal font-interReg leading-normal"
                                    placeholder={teamData.phone_number}
                                    type="tel"
                                    value={newPhoneNumber}
                                            onChange={(event) => {
                                                setNewPhoneNumber(event.target.value);
                                                setPhoneNumberError('');
                                            }} />
                            </div>
                        </div>
                        {(phoneNumberError != '') ? <div className="text-red-500">{phoneNumberError}</div>:<div></div>}        
                        
                        <div className="w-[322px] h-8 pl-5 pr-4 py-3 bg-white rounded-md border border-blue-600 justify-start items-center gap-2.5 inline-flex">
                            <MapPinIcon className="h-5 w-5 text-neutral-500"></MapPinIcon>
                            <div className="w-full h-auto basis-0 justify-start items-center flex">                            
                                <input
                                    className="text-neutral-500 text-base font-normal font-interReg leading-normal"
                                    placeholder={clubData.location}
                                    type="text"
                                    value={newLocation}
                                            onChange={(event) => {
                                                setNewLocation(event.target.value);
                                            }} />
                            </div>
                        </div>
                        <div className="w-[322px] h-8 pl-5 pr-4 py-3 bg-white rounded-md border border-blue-600 justify-start items-center gap-2.5 inline-flex">
                            <MapPinIcon className="h-5 w-5 text-neutral-500"></MapPinIcon>
                            <div className="w-full h-auto basis-0 justify-start items-center flex">                            
                                <input
                                    className="text-neutral-500 text-base font-normal font-interReg leading-normal"
                                    placeholder={clubData.stadium}
                                    type="text"
                                    value={newStadium}
                                            onChange={(event) => {
                                                setNewStadium(event.target.value);
                                            }} />
                            </div>
                        </div>
                        </div>                                                 
                    </div>

                    <div className="flex-col justify-start items-start gap-2 flex">
                        <div className="flex-col justify-start items-start gap-1 flex">
                        <div className="px-4 justify-start items-start gap-2.5 inline-flex">
                            <div className="text-blue-600 text-xl font-russoOne">Socials</div>
                        </div>
                        <div className="w-[322px] h-8 pl-5 pr-4 py-3 bg-white rounded-md border border-blue-600  justify-start items-center gap-2.5 inline-flex">
                            <img src={`${process.env.PUBLIC_URL}/images/facebook.svg`} alt='facebook' />
                            <div className="w-full h-auto basis-0 justify-start items-center flex">
                                <input
                                    className='text-neutral-500 text-base font-normal font-interReg leading-normal'
                                    placeholder={teamSocialsData.facebook_handle}
                                    type="text"
                                    value={newFacebook}
                                        onChange={(event) => {
                                            setNewFacebook>(event.target.value);
                                        }
                                    } />
                            </div>
                        </div>
                        <div className="w-[322px] h-8 pl-5 pr-4 py-3 bg-white rounded-md border border-blue-600  justify-start items-center gap-2.5 inline-flex">
                            <img src={`${process.env.PUBLIC_URL}/images/instagram.svg`} alt='instagram' />
                            <div className="w-full h-auto basis-0 justify-start items-center flex">
                                <input
                                    className='text-neutral-500 text-base font-normal font-interReg leading-normal'
                                    placeholder={teamSocialsData.instagram_handle}
                                    type="text"
                                    value={newInstagram}
                                        onChange={(event) => {
                                            setNewInstagram>(event.target.value);
                                        }
                                    } />
                            </div>
                        </div>
                        
                        <div className="w-[322px] h-8 pl-5 pr-4 py-3 bg-white rounded-md border border-blue-600  justify-start items-center gap-2.5 inline-flex">
                            <img src={`${process.env.PUBLIC_URL}/images/twitter.svg`} alt='twitter' />
                            <div className="w-full h-auto basis-0 justify-start items-center flex">
                                <input
                                    className='text-neutral-500 text-base font-normal font-interReg leading-normal'
                                    placeholder={teamSocialsData.x_handle}
                                    type="text"
                                    value={newX}
                                        onChange={(event) => {
                                            setNewX>(event.target.value);
                                        }
                                    } />
                            </div>
                        </div>
                        </div>                                                 
                    </div>

                    <div className="flex-col justify-start items-start gap-1 flex">
                        <div className="w-[178px] px-4 justify-start items-start gap-2.5 inline-flex">
                            <div className="text-blue-600 text-xl font-russoOne">Bio</div>
                        </div>
                        <div className="w-[322px] px-4 py-1 bg-white rounded-md border border-blue-600  justify-start items-center inline-flex">
                            <div className="grow h-auto basis-0 justify-start items-center flex">
                                <textarea
                                    value={newBio}
                                    onChange={(event) => setNewBio(event.target.value)}
                                    className="grow basis-0 text-neutral-500 text-sm font-normal font-interReg"
                                    placeholder={clubData.description}
                                    />
                            </div>
                        </div>
                    </div>        
                </div>
                
                
                </div>
            </div>  
            
    );
    }

    
}

export default EditTeamPage;
