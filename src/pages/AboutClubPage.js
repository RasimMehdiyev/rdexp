import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/helper/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import PhoneInput from 'react-phone-input-2';
import 'react-toastify/dist/ReactToastify.css';
import LocationInput from '../components/LocationInput.js';

export const AboutClubPage = () => {
  const [fileName, setFileName] = useState('Choose Image');
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [file64, setFile64] = useState('');
  const [pictureUrl, setPictureUrl] = useState('');
  const [clubName, setClubName] = useState('');
  const [clubEmail, setClubEmail] = useState('');
  const [clubPhone, setClubPhone] = React.useState('+32');
  const [clubLocation, setClubLocation] = useState('');
  const [clubDescription, setClubDescription] = useState('');
  const [userID, setUserID] = useState('');
  const [userData, setUserData] = useState({});
  const [emailBorderColor, setEmailBorderColor] = useState('border-club-header-blue');
  const [clubBorderColor, setClubBorderColor] = useState('border-club-header-blue'); 
  const [emailError, setEmailError] = useState('');
  const [clubError, setClubError] = useState('');
  const navigate = useNavigate();

  const base64String = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setFile64(reader.result);
    };
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFile(file);
      base64String(file);
      setPictureUrl(URL.createObjectURL(file));
    }
  };

  const handleClubNameInputChange = (e) => {
    setClubName(e.target.value);
  };

  const handleClubDescriptionInputChange = (e) => {
    setClubDescription(e.target.value);
  };

  const handleClubEmailInputChange = (e) => {
    setClubEmail(e.target.value);
  };

  const handleClubPhoneInputChange = (e) => {
    setClubPhone(e.target.value);
  };

  const handleLocationInputChange = (value) => {
    setClubLocation(value);
  };

  const clubExists = async (club_name) =>{
    let { data, error } = await supabase
      .rpc('does_club_exist', {
        club_name: club_name
      })
    if (error) 
    {
        console.error(error)
    }
    else if (data) {
        setClubBorderColor('border-red-500');
        setClubError('Club already exists!');
        toast.error('Club already exists!', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'light',
          });
    }
    else{
        setClubBorderColor('border-club-header-blue');
        setClubError('');
    }
  }
  

  const handleBlur = () => {
    if (clubEmail.trim() === '') {
      setEmailError('');
      setEmailBorderColor('border-club-header-blue');
    } else if (!validateEmail(clubEmail)) {
      setEmailError('Please enter a valid email address');
      setEmailBorderColor('border-red-500');
      toast.error('Please enter a valid email address.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
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
        console.log('User:', user);
        if (user) {
          const { data: user_data, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('user_id', user.id)
            .single();
          if (userError) throw userError;
          console.log('User data:', user_data);
          setUserData(user_data);
          localStorage.setItem('userID', user_data.id);
        } else {
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchUserID();
  }, []);

  const submitChanges = async (event) => {
    event.preventDefault();
    console.log('submitting changes');
    const { data, error } = await supabase
      .from('club')
      .insert([
        {
          name: clubName,
          description: clubDescription,
          picture: file64,
          location: clubLocation,
        },
      ])
      .select('id')
      .single();
    const clubID = data;
    console.log('club id', clubID.id);
    localStorage.setItem('clubID', clubID.id);

    const { data: teamData, error: teamError } = await supabase
      .from('team')
      .insert([
        {
          email: clubEmail,
          phone_number: clubPhone,
        },
      ])
      .select('id')
      .single();
    if (teamError) console.log(teamError);
    console.log('team id', teamData.id);

    const { data: clubTeamData, error: clubTeamError } = await supabase
      .from('club_teams')
      .insert([
        {
          club_id: clubID.id,
          team_id: teamData.id,
        },
      ])
      .select('id')
      .single();
    if (clubTeamError) console.log(clubTeamError);
    console.log('club id', clubTeamData.id);
    localStorage.setItem('teamID', teamData.id);

    toast.success('Successful club registration! Redirecting...', {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: 'light',
    });

    setTimeout(() => {
      navigate('/team/create');
    }, 1500);
  };

  return (
    <form onSubmit={submitChanges} className='bg-sn-bg-light-blue flex flex-col justify-center align-center px-8 h-screen gap-5 text-club-header-blue'>
      <div className='flex flex-col mt-7 justify-center gap-0'>
        <h5 className='font-russoOne text-5xl  text-center leading-none'>ABOUT</h5>
        <h5 className='font-russoOne text-5xl  text-center leading-none'>YOUR CLUB</h5>
      </div>
      <div className="flex flex-col justify-center">
        <input
          onChange={handleClubNameInputChange}
          className={`placeholder:-translate-x-2 border-2 ${clubBorderColor} ${clubError ? 'text-red-500' : 'text-black'} p-2 w-[60vw] mx-auto rounded-10px h-12`}
          type="text"
          placeholder="Club name"
          maxLength={30}
          onBlur={(e) => {clubExists(e.target.value)}}
        />
      </div>
      <div className='flex flex-row gap-[20px] align-center'>
        <span className='font-russoOne text-[20px]'>Logo</span>
        <input
          type="file"
          id="fileInput"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="align-center pt-[5px]"
        />
        <label htmlFor="fileInput" id="fileLabel" className='cursor-pointer flex flex-row text-[12px]'>
            <img src={process.env.PUBLIC_URL + "/images/upload_image.svg"} alt="upload" className='cursor-pointer w-4'/>
            <span className='pl-2 flex-1 underline underline-offset-1 font-interReg text-center align-center my-auto'>
                {pictureUrl ? (
                <span className='text-left'>{fileName}</span>
                ) : (
                <span className='text-center'>Insert image</span>
                )}
            </span>
        </label>
      </div>
      <div className='flex flex-col justify-center align-center gap-2'>
        <p className='font-russoOne text-[20px] '>Contact details</p>

        <input
          className={`placeholder:-translate-x-2 shadow-md placeholder-text p-2 font-interReg w-full h-12 rounded-lg border-2 
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

        <div className='input-container'>
          <PhoneInput
            style={{ height: '3rem' }}
            inputStyle={{ height: '100%', width: '100%', borderRadius: '10px' }}
            className="text-black border-2 border-club-header-blue rounded-10px min-w-full h-12 m-auto"
            placeholder='Enter phone number'
            value={clubPhone}
            onChange={(clubPhone) => setClubPhone(clubPhone)}
          />
        </div>

        <LocationInput onLocationChange={handleLocationInputChange} borderColor="club-header-blue" isIconVisible={false} value="" />

      </div>
      <div className='flex flex-col gap-2 justify-center align-center'>
        <p className='font-russoOne text-[20px]'>Description</p>
        <textarea onChange={handleClubDescriptionInputChange} className='rounded-10px p-2 min-w-full m-auto border-2 border-club-header-blue text-black' name="description" id="description" cols="30" rows="5" maxLength={255}></textarea>
      </div>

      <button
        className={`font-interBold text-white bg-sn-main-orange mx-auto my-auto text-xl rounded-10px w-[70vw] h-16 ${
          clubName.length === 0 || emailError
            ? ' cursor-not-allowed opacity-50'
            : 'cursor-pointer'
        }`}
        type="submit"
        disabled={clubName.length === 0 || emailError}>
        SAVE
      </button>
      <ToastContainer />
    </form>
  );
};