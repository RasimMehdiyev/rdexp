import React from 'react';

const NoTeamPage = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-white">
      <div className='text-center w-[70%]'>
        <h1 className="text-3xl text-sn-main-orange mb-4 font-interBold">
          Waiting for Team Assignment
        </h1>
        <p className="text-sm font-interELight  text-sn-main-orange">
          You are currently not assigned to any team. 
          Please wait until a team manager adds you to a team.
        </p>
      </div>
    </div>
  );
};

export default NoTeamPage;
