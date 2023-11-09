import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import {PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

const ProfilePage = () => {
  return (
    <div className="bg-gradient-to-b from-indigo-100 from-40% to-white to-55% flex flex-col items-center justify-center h-screen">
    <div className="flex-col justify-start items-center inline-flex gap-4">
        <div className="self-stretch h-[237px] p-2 flex-col justify-start items-center gap-2 flex">
            <img className="w-[142px] h-[142px] rounded-full border-4 border-white" src="https://via.placeholder.com/142x142" />
            <div className="flex-col justify-start items-center gap-0 flex">
                <div className="text-center text-blue-800 text-3xl font-russoOne leading-normal">Jeff Hugh</div>
                <div className="text-center text-neutral-900 text-sm font-interEBold uppercase">Coach</div>
            </div>
            <div className="self-stretch justify-center items-center gap-4 inline-flex">
                      <div className="justify-center items-center gap-1 flex">
                          <EnvelopeIcon className="h-6 w-6"/>
                    <div className="text-center text-neutral-900 text-sm font-interReg">jeff.hugh@email.co</div>
                </div>
                <div className="justify-center items-center gap-1 flex">
                    <div className="w-[18px] h-[18px] relative"><PhoneIcon className="h-5 w-5"></PhoneIcon></div>
                    <div className="text-center text-black text-sm font-interReg">+12 345 567 89</div>
                </div>
            </div>
        </div>
        <div className="self-stretch h-[242px] px-2 py-4 flex-col justify-start items-center gap-2 flex">
            <div className="self-stretch text-center text-neutral-900 text-xl font-interEBold">About</div>
                <div className="w-[343px] text-center text-neutral-600 text-sm font-interReg">
                    Hey there, I am Jeff, I love football and I’ve been in the coaching game for the past 15 years. I’m just happy to be here! If you need anything don’t hesitate to contact me :)
                </div>
        </div>
            <div className="grow flex-col justify-end items-center gap-2 flex">
            <Link to='/editProfile'>
            <div className="w-[322px] h-[33px] p-2.5 bg-orange-500 rounded justify-center items-center gap-2.5 inline-flex">
                <div className="text-white text-sm font-normal font-interReg uppercase">Edit Profile</div>
            </div>
            </Link>
            <div className="w-[322px] h-[33px] p-2.5 bg-zinc-300 rounded justify-center items-center gap-2.5 inline-flex">
                <div className="text-neutral-900 text-sm font-normal font-interReg uppercase">Sign out</div>
            </div>
        </div>
    </div>
    </div>
  );
}

export default ProfilePage;
