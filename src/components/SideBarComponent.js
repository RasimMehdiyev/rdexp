import React from 'react';

const SideBarComponent = ({isOpen}) => {
    return (
        <>
        {isOpen && (
        <div className="absolute top-0 left-0 w-full h-screen bg-blue-700 mt-[85px] bg-lf-light-gray">
                <ul className='flex flex-col justify-center items-center'>
                    <li className='w-[80%] m-auto mt-[20px] bg-lf-dark-gray pt-[24px] text-center h-[68px]'>Announcements</li>
                    <li className='w-[80%] m-auto mt-[20px] bg-lf-dark-gray pt-[24px] text-center h-[68px]'>Manage teams</li>
                    <li className='w-[80%] m-auto mt-[20px] bg-lf-dark-gray pt-[24px] text-center h-[68px]'>Line-up</li>
                    <li className='w-[80%] m-auto mt-[20px] bg-lf-dark-gray pt-[24px] text-center h-[68px]'>Player stats</li>
                </ul>
        </div>
        )}
        </>


    );
};

export default SideBarComponent;
