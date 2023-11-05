import React from "react";

function ProfilePage() {
  return (
    <div className="bg-gradient-to-b from-indigo-100 to-white flex flex-col items-center justify-center h-screen">
    <div className="w-[375px] h-[595px] flex-col justify-start items-center inline-flex">
    <div className="self-stretch h-[237px] p-2 flex-col justify-start items-center gap-2 flex">
        <img className="w-[142px] h-[142px] rounded-full border-4 border-white" src="https://via.placeholder.com/142x142" />
        <div className="flex-col justify-start items-center gap-1 flex">
            <div className="text-center text-blue-800 text-3xl font-normal font-russo1 leading-normal">Jeff Hugh</div>
            <div className="text-center text-neutral-900 text-sm font-semibold font-inter-regular uppercase">Coach</div>
        </div>
        <div className="self-stretch justify-center items-center gap-4 inline-flex">
            <div className="justify-center items-center gap-1 flex">
                <div className="text-center text-neutral-900 text-sm font-normal font-inter-regular">jeff.hugh @email.co</div>
            </div>
            <div className="justify-center items-center gap-1 flex">
                <div className="w-[18px] h-[18px] relative"></div>
                <div className="text-center text-black text-sm font-normal font-inter-regular">+12 345 567 89</div>
            </div>
        </div>
    </div>
    <div className="self-stretch h-[242px] px-2 py-4 flex-col justify-start items-center gap-2 flex">
        <div className="self-stretch text-center text-neutral-900 text-xl font-bold font-inter-regular">About</div>
              <div className="w-[343px] text-center text-neutral-600 text-sm font-normal font-inter-regular">
                  Hey there, I am Jeff, I love football and I’ve been in the coaching game for the past 15 years. I’m just happy to be here! If you need anything don’t hesitate to contact me :)
              </div>
    </div>
    <div className="flex-col justify-start items-center gap-2 flex">
        <div className="w-[322px] h-[33px] p-2.5 bg-orange-500 rounded justify-center items-center gap-2.5 inline-flex">
            <div className="text-white text-sm font-normal font-inter-regular uppercase">Edit Profile</div>
        </div>
        <div className="w-[322px] h-[33px] p-2.5 bg-zinc-300 rounded justify-center items-center gap-2.5 inline-flex">
            <div className="text-neutral-900 text-sm font-normal font-inter-regular uppercase">Sign out</div>
        </div>
    </div>
      </div>
    </div>
  );
}

export default ProfilePage;
