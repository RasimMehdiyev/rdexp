import React from 'react';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
const ClubInfoComponent = ({isDone}) => {
    const [sportType, setSportType] = useState('');
    const [clubName, setClubName] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    const submitClub = async(event) => {
        navigate('/');
    }
    const isDisabled = !clubName || !sportType || !role;
    return (
        <>
        {isDone && 
            (
                <form className='text-center gap-5 items-center flex flex-col justify-center' onSubmit={submitClub}>
                    <h1 className='text-[50px] my-[100px]  text-center'>Club info</h1>
                    <input onChange={(event) => setClubName(event.target.value)} value={clubName} className='shadow-md text-[12px] pl-2 font-[Arial] w-64 h-12 rounded-lg' type="text" placeholder='Club name'/>
                    <select value={sportType} onChange={(event)=>setSportType(event.target.value)} className='shadow-md pl-2 font-[Arial] text-[12px] border-[black] w-64 h-12 rounded-lg'>
                        <option className='font-[Arial]' value="">No Selection</option>
                        <option className='font-[Arial]' value="Basketball">Basketball</option>
                        <option className='font-[Arial]' value="Football">Football</option>
                        <option className='font-[Arial]' value="Volleyball">Volleyball</option>
                    </select>
                    <select onChange={(event)=> setRole(event.target.value)} value={role} className='shadow-md pl-2 font-[Arial] text-[12px] border-[black] w-64 h-12 rounded-lg'>
                        <option className='font-[Arial]' value="">No Selection</option>
                        <option className='font-[Arial]' value="coach">Coach</option>
                        <option className='font-[Arial]' value="player">Player</option>
                        <option className='font-[Arial]' value="volunteer">Volunteer</option>
                    </select>
                <button onSubmit={submitClub} className={`${(isDisabled) ? 'cursor-not-allowed' : 'cursor-pointer'} text-4xl text-[white] w-72 h-16 bg-[#656A6B]`}  type="submit">Finalize</button>
                </form>
            )
        }
        </>
    
    );
}

export default ClubInfoComponent;
