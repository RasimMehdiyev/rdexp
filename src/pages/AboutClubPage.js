import React, { useState, useRef, useEffect } from 'react';
import {supabase} from '../lib/helper/supabaseClient';
import {useNavigate} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import PhoneInput from "react-phone-input-2";
import 'react-toastify/dist/ReactToastify.css';
import LocationInput from '../components/LocationInput.js';


export const AboutClubPage = () => {
    


    const [fileName, setFileName] = useState('Choose Image');
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null); // file state for storing actual image
    const [file64, setFile64] = useState(''); // file64 state for storing base64 string of image
    const [clubName, setClubName] = useState(''); // club name
    const [clubEmail, setClubEmail] = useState(''); // club email
    const [clubPhone, setClubPhone] =  React.useState('+32');; // club phone
    const [clubLocation, setClubLocation] = useState(''); // club location
    const [clubDescription, setClubDescription] = useState(''); // club description
    const [userID, setUserID] = useState(''); // user id
    const [userData, setUserData] = useState({}); // user data
    const navigate = useNavigate();

    

    const base64String = (file) => {
        // use setFile64 to set the base64 string
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setFile64(reader.result);
        };
    }
    
    const handleLocationInputChange = (selectedAddress) => {
        console.log('Location changed:', selectedAddress);
      };
    

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

    const [emailBorderColor, setEmailBorderColor] = useState('border-club-header-blue');
    const [emailError, setEmailError] = useState('');
    
    const handleBlur = () => {
        if (clubEmail.trim() === '') {
            setEmailError('');
            setEmailBorderColor('border-club-header-blue'); 
        } else if (!validateEmail(clubEmail)) {
            setEmailError('Please enter a valid email address');
            setEmailBorderColor('border-red-500'); 
            toast.error("Please enter a valid email address.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            setEmailError('');
            setEmailBorderColor('border-club-header-blue'); 
        }
    };

    const validateEmail = (inputEmail) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(inputEmail);
    };



    useEffect(() => {
       const fetchUserID = async () => {
        try {
            const userResponse = await supabase.auth.getUser();
            const user = userResponse.data.user;
            console.log("User:", user);
            if (user) {
              // Initially, we don't know the user's role, so fetch from both tables.
              const { data: user_data, error: userError } = await supabase
                .from('users')
                .select('id')
                .eq('user_id', user.id)
                .single(); // Use single to get a single record or null   
              if (userError) throw userError;
              console.log("User data:", user_data);     
              setUserData(user_data);   
              localStorage.setItem('userID', user_data.id);  
            }
            else{
                navigate('/auth');
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }     
       }  
         fetchUserID();
    },[])

    // set user ID from supabase in localstorage
    

    useEffect(() => {
        // console.log('file', file);
        // console.log('file64', file64);
        // console.log('club name', clubName);
        // console.log('club email', clubEmail);
        // console.log('club phone', clubPhone);
        // console.log('club location', clubLocation);
        // console.log('club description', clubDescription);
    },[file, clubName, clubEmail, clubPhone, clubLocation, clubDescription])


    // useEffect(() => {

    // },[navigate])

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
        localStorage.setItem('teamID', teamData.id);

        toast.success('Successful club registration! 🎉 Redirecting...', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: 'light',
        });
  
      // Delay the navigation after 5 seconds
      setTimeout(() => {
        navigate('/team/create');
      }, 5000); 
    }
  return (
    
    <form  onSubmit={submitChanges} className='bg-sn-bg-light-blue flex flex-col justify-center align-center px-8 h-screen gap-5 text-club-header-blue'>
        <div className='flex flex-col justify-center gap-0'>
            <h5 className='font-russoOne text-5xl  text-center leading-none'>ABOUT</h5>
            <h5 className='font-russoOne text-5xl  text-center leading-none'>YOUR CLUB</h5>
        </div>
        <div className="flex flex-col justify-center">
            <input
                onChange={handleClubNameInputChange}
                className="text-black border-2 border-club-header-blue pl-2 w-[60vw] mx-auto rounded-10px h-12"
                type="text"
                placeholder="Club name"
                maxLength={30}
            />
        </div>
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

            <input
                    className={`shadow-md placeholder-text pl-2 font-interReg w-full h-12 rounded-lg border-2 
                        ${emailBorderColor} ${
                    emailError ? 'text-red-500' : 'text-black'
                }`}
                    placeholder='Email'
                    type="email"
                    value={clubEmail}
                    onChange={handleClubEmailInputChange}
                    onBlur={handleBlur}
                    maxLength={254}
                />

                
            {/*<div className='input-container'>
                <img className="input-icon" src={process.env.PUBLIC_URL + "/images/envelope.svg"}/>
                <input onChange={handleClubEmailInputChange} type="email" placeholder='Email' className="text-black border-2 pl-8 border-club-header-blue rounded-10px min-w-full h-12 m-auto"/>
            </div>*/}

            <div className='input-container'>
                <PhoneInput
                    style={{ height: '3rem' }}
                    inputStyle={{ height: '100%', width:'100%',borderRadius:'10px'}}
                    className="text-black border-2 border-club-header-blue rounded-10px min-w-full h-12 m-auto"
                    placeholder='Enter phone number'
                    value={clubPhone}
                    onChange={(clubPhone) => setClubPhone(clubPhone)}
                    />
            </div>
            
            <LocationInput onChange={handleLocationInputChange}/>

            

        </div>
        <div className='flex flex-col gap-2 justify-center align-center'>
            <p className='font-russoOne text-[20px] '>Description</p>
            <textarea onChange={handleClubDescriptionInputChange} className='rounded-10px pt-2 pl-2 min-w-full m-auto border-2 border-club-header-blue text-black' name="description" id="description" cols="30" rows="5" maxLength={255}></textarea>
        </div>
        

        <button
            className={`font-russoOne text-white ml-[20%] align-center rounded-10px h-12 w-[50vw]  ${
                clubName.length === 0 ? 'bg-sn-lighter-orange cursor-not-allowed' : 'bg-sn-main-orange cursor-pointer'
            }`}
            type="submit"
            disabled={clubName.length === 0}>
            SAVE
        </button>

        <ToastContainer/>
    </form> 
  )
}
