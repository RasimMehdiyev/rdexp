import React,  { useEffect, useState } from "react";
import { supabase } from '../lib/helper/supabaseClient';
import LoadingPage from "./LoadingPage";
import { PencilIcon } from '@heroicons/react/24/solid'
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom';
import StickyEditTeamComponent from "../components/StickyEditTeamComponent";
import { useParams } from 'react-router-dom';
import useTeamData from "../hooks/useTeamData";

const EditTeamPage = () => {
    const { clubId, teamId } = useParams();
    const navigate = useNavigate();
    const { userData, teamData, clubData, teamSocialsData, loading, isCoach, setLoading } = useTeamData(teamId, clubId);

    const [formValues, setFormValues] = useState({
        teamName: '',
        bio: '',
        email: '',
        phoneNumber: '',
        location: '',
        stadium: '',
        facebook: '',
        instagram: '',
        x: ''
    });
    const [errors, setErrors] = useState({});
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check if the necessary data is available
                if(!loading){
                    if(userData){
                        if(isCoach){
                            if (teamData && clubData && teamSocialsData) {
                                // Update form fields with the fetched data
                                setFormValues({
                                    teamName: teamData.team_name || '',
                                    bio: clubData.description || '',
                                    email: teamData.email || '',
                                    phoneNumber: teamData.phone_number || '',
                                    location: clubData.location || '',
                                    stadium: clubData.stadium || '',
                                    facebook: teamSocialsData.facebook_handle || '',
                                    instagram: teamSocialsData.instagram_handle || '',
                                    x: teamSocialsData.x_handle || '' // Replace 'x_handle' with actual field name if different
                                });
                
                                // Set the preview image if available
                                setPreviewImage(clubData.picture || null);
                            }
                        } else {
                            navigate(`/team-profile/${clubId}/${teamId}`);
                        }
                    } else  {
                        navigate(`/auth`);
                    }
                }
                
                
                
            } catch (error) {
                console.error("Error fetching team data:", error);
            }
        };
    
        fetchData();
    }, [loading, userData, teamData, clubData, teamSocialsData]);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };


    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhoneNumber = (phone) => /^[\d\+\-\s]+$/.test(phone);
        
    
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
    
        let newErrors = {};
        if (!validateEmail(formValues.email)) {
            newErrors.email = 'Email is not valid.';
        }
        if (!validatePhoneNumber(formValues.phoneNumber)) {
            newErrors.phoneNumber = 'Phone number is not valid.';
        }
    
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }
    
        try {
            const updatedTeamData = await updateTeamData(teamId, formValues);
            const updatedClubData = await updateClubData(clubId, formValues);
            const updatedSocialsData = await updateTeamSocialsData(teamId, formValues);
            navigate(`/team-profile/${clubId}/${teamId}`);
        } catch (error) {
            console.error("Error updating data:", error);
        } finally {
            setLoading(false);
        }
    };
    

    const updateTeamData = async (teamId, formData) => {
        try {
            const { data, error } = await supabase
                .from('team')
                .update({
                    team_name: formData.teamName,
                    email: formData.email,
                    phone_number: formData.phoneNumber,
                })
                .eq('id', teamId);
    
            if (error) throw error;
    
            return data;
        } catch (error) {
            console.error('Error updating team data:', error);
            throw error;
        }
    };
    

    const updateClubData = async (clubId, formData) => {
        try {
            const { data, error } = await supabase
                .from('club') 
                .update({
                    description: formData.bio,
                    location: formData.location,
                    stadium: formData.stadium,
                    picture: previewImage, 
                })
                .eq('id', clubId);
    
            if (error) throw error;
    
            return data;
        } catch (error) {
            console.error('Error updating club data:', error);
            throw error;
        }
    };
    

    const updateTeamSocialsData = async (teamId, formData) => {
        try {
            const upsertData = {
                team_id: teamId,
                facebook_handle: formData.facebook,
                instagram_handle: formData.instagram,
                x_handle: formData.x,
            };
            let { data, error } = await supabase
                .from('team_socials')
                .upsert(upsertData, { onConflict: 'team_id' }) 
    
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error in upsert operation:', error);
            throw error;
        }
    };
    
    
    
    if (loading) {
        return <LoadingPage />;
    } else {
        return (
            <div>
                <StickyEditTeamComponent onSave={handleSubmit}/>
                <div className="grow flex bg-indigo-100 flex-col items-center justify-start h-screen">
                    <div className="grow p-4 flex-col justify-start items-center gap-4 inline-flex">

                        {/* Profile Picture Section */}
                        
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

                        {/* Team Name Input */}

                        <div className="flex-col justify-start items-start gap-2 flex">
                            <div className="flex-col justify-start items-start gap-1 flex">
                                <div className="justify-start items-start gap-2.5 inline-flex">
                                    <label className="text-blue-600 text-xl font-russoOne">Team Name</label>
                                </div>
                                <div className="w-[322px] h-8 pl-1 pr-4 py-3 bg-white rounded-md border border-blue-600  justify-start items-center gap-2.5 inline-flex">
                                    <div className="w-full h-auto basis-0 justify-start items-center flex"></div>
                                        <input
                                            name="teamName"
                                            value={formValues.teamName}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            type="text"
                                            placeholder="Enter team name"
                                        />
                                </div>
                            </div>
                        </div>

                         {/* Contact Details Section */}

                        <div className="flex-col justify-start items-start gap-2 flex">


                            <div className="flex-col justify-start items-start gap-1 flex">
                                <div className=" justify-start items-start gap-2.5 inline-flex">
                                    <div className="text-blue-600 text-xl font-russoOne">Contact details</div>
                                </div>

                                 {/* Email Section */}

                                <div className="w-[322px] h-8 pl-3 pr-4 py-3 bg-white rounded-md border border-blue-600  justify-start items-center gap-2.5 inline-flex">
                                    <EnvelopeIcon className="h-5 w-5 text-neutral-500"></EnvelopeIcon>
                                    <div className="w-full h-auto basis-0 justify-start items-center flex">
                                        <input
                                            name="email"
                                            value={formValues.email}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            type="email"
                                            placeholder="Enter email"
                                        />
                                        {errors.email && <span className="error">{errors.email}</span>}
                                    </div>
                                </div>

                                {/* Phone Section */}

                                <div className="w-[322px] h-8 pl-3 pr-4 py-3 bg-white rounded-md border border-blue-600 justify-start items-center gap-2.5 inline-flex">
                                    <PhoneIcon className="h-5 w-5 text-neutral-500"></PhoneIcon>
                                    <div className="w-full h-auto basis-0 justify-start items-center flex">                            
                                        <input
                                            name="phoneNumber"
                                            value={formValues.phoneNumber}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            type="tel"
                                            placeholder="Enter phone number"
                                        />
                                        {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location Details Section */}

                        <div className="flex-col justify-start items-start gap-2 flex">

                        <div className="flex-col justify-start items-start gap-1 flex">
                            <div className=" justify-start items-start gap-2.5 inline-flex">
                                <div className="text-blue-600 text-xl font-russoOne">Location Details</div>
                            </div>

                                {/* Location Section */}

                                <div className="w-[322px] h-8 pl-3 pr-4 py-3 bg-white rounded-md border border-blue-600 justify-start items-center gap-2.5 inline-flex">
                                    <MapPinIcon className="h-5 w-5 text-neutral-500"></MapPinIcon>
                                    <div className="w-full h-auto basis-0 justify-start items-center flex">                            
                                    <input
                                        name="location"
                                        value={formValues.location}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        type="text"
                                        placeholder="Enter location"
                                    />
                                    </div>
                                </div>

                                {/* Stadium Section */}

                                <div className="w-[322px] h-8 pl-3 pr-4 py-3 bg-white rounded-md border border-blue-600 justify-start items-center gap-2.5 inline-flex">
                                    <MapPinIcon className="h-5 w-5 text-neutral-500"></MapPinIcon>
                                    <div className="w-full h-auto basis-0 justify-start items-center flex">                            
                                    <input
                                        name="stadium"
                                        value={formValues.stadium}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        type="text"
                                        placeholder="Enter stadium"
                                    />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Media Section */}

                        <div className="flex-col justify-start items-start gap-2 flex">


                            <div className="flex-col justify-start items-start gap-1 flex">
                                <div className=" justify-start items-start gap-2.5 inline-flex">
                                    <div className="text-blue-600 text-xl font-russoOne">Social Media</div>
                                </div>

                                 {/* Facebook Section */}

                                <div className="w-[322px] h-8 pl-3 pr-4 py-3 bg-white rounded-md border border-blue-600  justify-start items-center gap-2.5 inline-flex">
                                    <img src={`${process.env.PUBLIC_URL}/images/facebook.svg`} alt='facebook' />
                                    <div className="w-full h-auto basis-0 justify-start items-center flex">
                                        <input
                                            name="facebook"
                                            value={formValues.facebook}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            type="text"
                                            placeholder="Enter Facebook name"
                                        />
                                    </div>
                                </div>

                                {/* Instagram Section */}

                                <div className="w-[322px] h-8 pl-3 pr-4 py-3 bg-white rounded-md border border-blue-600 justify-start items-center gap-2.5 inline-flex">
                                    <img src={`${process.env.PUBLIC_URL}/images/instagram.svg`} alt='instagram' />
                                    <div className="w-full h-auto basis-0 justify-start items-center flex">                            
                                        <input
                                            name="instagram"
                                            value={formValues.instagram}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            type="text"
                                            placeholder="Enter Instagram name"
                                        />
                                    </div>
                                </div>

                                {/* X Section */}

                                <div className="w-[322px] h-8 pl-3 pr-4 py-3 bg-white rounded-md border border-blue-600 justify-start items-center gap-2.5 inline-flex">
                                    <img src={`${process.env.PUBLIC_URL}/images/twitter.svg`} alt='twitter' />
                                    <div className="w-full h-auto basis-0 justify-start items-center flex">                            
                                        <input
                                            name="x"
                                            value={formValues.x}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            type="text"
                                            placeholder="Enter X name"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-col justify-start items-start gap-1 flex">
                            <div className="w-[178px]  justify-start items-start gap-2.5 inline-flex">
                                <div className="text-blue-600 text-xl font-russoOne">Bio</div>
                            </div>
                            <div className="w-[322px]  py-1 bg-white rounded-md border border-blue-600  justify-start items-center inline-flex">
                                <div className="grow h-auto basis-0 justify-start items-center flex">
                                    <textarea
                                        name="bio"
                                        value={formValues.bio}
                                        onChange={handleInputChange}
                                        className="form-textarea pl-2 pt-1 h-[100px] "
                                        placeholder="Enter bio"
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
