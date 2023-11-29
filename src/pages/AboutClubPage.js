import React, { useState, useRef, useEffect } from 'react';
import {supabase} from '../lib/helper/supabaseClient';
import {useNavigate} from 'react-router-dom';

export const AboutClubPage = () => {

    const [fileName, setFileName] = useState('Choose Image');
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null); // file state for storing actual image
    const [file64, setFile64] = useState(''); // file64 state for storing base64 string of image
    const [clubName, setClubName] = useState(''); // club name
    const [clubEmail, setClubEmail] = useState(''); // club email
    const [clubPhone, setClubPhone] = useState(''); // club phone
    const [clubLocation, setClubLocation] = useState(''); // club location
    const [clubDescription, setClubDescription] = useState(''); // club description
    const navigate = useNavigate();

    const base64String = (file) => {
        // use setFile64 to set the base64 string
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setFile64(reader.result);
        };
    }
    
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            setFile(file);
            base64String(file); // call function to convert to base64 string
        }    
    };


    const handleClubNameInputChange = (e) => {
        // set the state values
        setClubName(e.target.value);
    }
    const handleClubDescriptionInputChange = (e) => {
        // set the state values
        setClubDescription(e.target.value);

    }
    const handleClubEmailInputChange = (e) => {
        // set the state values
        setClubEmail(e.target.value);

    }

    const handleClubPhoneInputChange = (e) => {
        // set the state values
        setClubPhone(e.target.value);
    }
    const handleLocationInputChange = (e) => {
        // set the state values
        setClubLocation(e.target.value);
    }




    useEffect(() => {
        // console.log('file', file);
        // console.log('file64', file64);
        // console.log('club name', clubName);
        // console.log('club email', clubEmail);
        // console.log('club phone', clubPhone);
        // console.log('club location', clubLocation);
        // console.log('club description', clubDescription);
    },[file, clubName, clubEmail, clubPhone, clubLocation, clubDescription])


    const submitChanges = async (event) =>{
        // do not reload page
        event.preventDefault();
        // submit changes to database
        console.log('submitting changes');
        const { data, error } = await supabase
        .from('club')
        .insert(
            [
                { 
                    name: clubName,
                    description: clubDescription,
                    picture: file64,
                    location: clubLocation,
                }
            ]
        )
        .select('id')
        .single()
        // get club's id 
        const clubID = data;
        console.log('club id', clubID.id);

        // insert team into teams table
    
        
        const { data: teamData, error: teamError } = await supabase
        .from('team')
        .insert(
            [
                {
                    email: clubEmail,
                    phone_number: clubPhone,
                }
            ]
        )
        .select('id')
        .single()
        if (teamError) console.log(teamError);
        console.log('team id', teamData.id);
        // insert into club_teams table
        const { data: clubTeamData, error: clubTeamError } = await supabase
        .from('club_teams')
        .insert(
            [
                {
                    club_id: clubID.id,
                    team_id: teamData.id,
                }
            ]
        )
        .select('id')
        .single()
        if (clubTeamError) console.log(clubTeamError);    
        console.log('club id', clubTeamData.id);
        
        // add team id into local storage
        localStorage.setItem('teamID', teamData.id);
        navigate('/club/create/settings');
    }    

  return (
    <form  onSubmit={submitChanges} className='bg-sn-bg-light-blue flex flex-col justify-center align-center px-8 h-screen gap-5 text-game-blue'>
        <div className='flex flex-col justify-center gap-0'>
            <h5 className='font-russoOne text-5xl  text-center leading-none'>ABOUT</h5>
            <h5 className='font-russoOne text-5xl  text-center leading-none'>YOUR CLUB</h5>
        </div>
        <div>
        <input onChange={handleClubNameInputChange} className="text-lf-dark-gray border-2 border-game-blue pl-2 w-[50vw] ml-[20%] align-center rounded-10px h-12" type="text" placeholder='Club name'/>
        </div >
        <div className='flex flex-row gap-[20px] align-center'>
            <span className='font-russoOne text-[20px]'>Logo</span>
            <input type="file" id="fileInput" ref={fileInputRef} 
                accept="image/*" 
                onChange={handleFileChange} 
                className="align-center pt-[5px]"/>
            <label htmlFor="fileInput" id="fileLabel" className='cursor-pointer flex flex-row text-[12px]'>
                <img src={process.env.PUBLIC_URL + "/images/upload_image.svg"} alt="upload" className='cursor-pointer w-4'/>
                <span className='w-20 underline underline-offset-1 font-interReg text-center align-center my-auto' id="fileText">Insert image</span>
            </label>
        </div>
        <div className='flex flex-col justify-center align-center gap-2'>
            <p className='font-russoOne text-[20px] '>Contact details</p>
            <div className='input-container'>
                <img className="input-icon" src={process.env.PUBLIC_URL + "/images/envelope.svg"}/>
                <input onChange={handleClubEmailInputChange} type="email" placeholder='info@youremail.com' className="text-lf-dark-gray border-2 pl-8 border-game-blue rounded-10px min-w-full h-12 m-auto"/>
            </div>
            <div className='input-container'>
                <img className="input-icon" src={process.env.PUBLIC_URL + "/images/phone-call.svg"}/>
                <input onChange={handleClubPhoneInputChange} type="text" placeholder='Phone number' className="text-lf-dark-gray border-2 pl-8 border-game-blue rounded-10px min-w-full h-12 m-auto"/>
            </div>
            <div className='input-container'>
                <img className="input-icon" src={process.env.PUBLIC_URL + "/images/map-pin.svg"}/>
                <input onChange={handleLocationInputChange} type="text" placeholder='Enter location' className="text-lf-dark-gray border-2 pl-8 border-game-blue rounded-10px min-w-full h-12 m-auto"/>
            </div>
        </div>
        <div className='flex flex-col gap-2 justify-center align-center'>
            <p className='font-russoOne text-[20px] '>Description</p>
            <textarea onChange={handleClubDescriptionInputChange} className='rounded-10px pt-2 pl-2 min-w-full m-auto border-2 border-game-blue text-lf-dark-gray' name="description" id="description" placeholder="(Optional)"cols="30" rows="5"></textarea>
        </div>
        <button type='submit' className="font-interReg bg-sn-main-orange ml-[20%] align-center rounded-10px h-12 w-[50vw] text-white">
            SAVE
        </button>
    </form>
  )
}
