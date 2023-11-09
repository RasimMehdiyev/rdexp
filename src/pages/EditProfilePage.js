import React from "react";
import { Link, useNavigate } from 'react-router-dom';

const EditProfilePage = () => {
  return (
    <div className="flex bg-indigo-100 flex-col items-center justify-center h-screen">
      <div className="grow p-4 flex-col justify-start items-center gap-4 inline-flex">
        <div className="w-[329px] justify-center items-start gap-2.5 inline-flex">
            <div className="w-[142px] h-[142px] relative">
                <img className="w-[142px] h-[142px] left-0 top-0 absolute rounded-full border-4 border-white" src="https://via.placeholder.com/142x142" />
                <div className="w-[35px] h-[35px] left-[107px] top-[98px] absolute">
                    <div className="w-[35px] h-[35px] left-[-3px] top-0 absolute bg-zinc-300 rounded-full" />
                    <div className="w-[30px] h-[30px] left-0 top-[2px] absolute rounded" />
                </div>
            </div>
        </div>
        <div className="flex-col justify-start items-start gap-2 flex">
            <div className="flex-col justify-start items-start gap-1 flex">
                <div className="w-[178px] px-4 justify-start items-start gap-2.5 inline-flex">
                    <div className="text-black text-base font-normal font-interReg leading-normal">About yourself</div>
                </div>
                <div className="w-[322px] px-4 py-1 bg-white rounded-md border border-orange-500 justify-start items-start inline-flex">
                    <div className="grow shrink basis-0 h-[68px] justify-start items-center flex">
                        <div className="grow shrink basis-0 text-neutral-500 text-sm font-normal font-interReg">Hey there, I am Jeff, I love football and I’ve been in the coaching game for the past 15 years. I’m just happy to be here! If you need anything don’t hesitate to contact me :)</div>
                    </div>
                </div>
            </div>
            <div className="flex-col justify-start items-start gap-1 flex">
                <div className="px-4 justify-start items-start gap-2.5 inline-flex">
                    <div className="text-black text-base font-normal font-interReg leading-normal">Email</div>
                </div>
                <div className="w-[322px] h-8 pl-5 pr-4 py-3 bg-white rounded-md border border-orange-500 justify-start items-center gap-2.5 inline-flex">
                    <div className="grow shrink basis-0 h-6 justify-start items-center gap-[116px] flex">
                        <div className="text-neutral-500 text-base font-normal font-interReg leading-normal">jeff.hugh@email.co</div>
                    </div>
                </div>
            </div>
            <div className="flex-col justify-start items-start gap-1 flex">
                <div className="px-4 justify-start items-start gap-2.5 inline-flex">
                    <div className="text-black text-base font-normal font-interReg leading-normal">Phone number</div>
                </div>
                <div className="w-[322px] h-8 pl-5 pr-4 py-3 bg-white rounded-md border border-orange-500 justify-start items-center gap-2.5 inline-flex">
                    <div className="grow shrink basis-0 h-6 justify-start items-center gap-[116px] flex">
                        <div className="text-neutral-500 text-base font-normal font-interReg leading-normal">+12 345 567 89</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex-col justify-end items-center gap-2 flex">
            <div className="w-[322px] h-[33px] p-2.5 bg-orange-500 rounded justify-center items-center gap-2.5 inline-flex">
                <div className="text-white text-sm font-normal font-interReg uppercase">save profile</div>
            </div>
            <div className="w-[322px] h-[33px] p-2.5 bg-zinc-300 rounded justify-center items-center gap-2.5 inline-flex">
                <div className="text-neutral-900 text-sm font-normal font-interReg uppercase">cancel</div>
            </div>
        </div>
      </div>
    </div>  
  );
}

export default EditProfilePage;
