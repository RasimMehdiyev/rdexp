import React from 'react';

const TeamManagementPage = () => {
    return (
        <div className="h-screen"> 
            <div className="font-inter flex flex-col items-center">
                <h1 className=" text-4xl mt-8">
                <span className="font-russoOne arrow-left text-blue-700 hover:text-blue-500"></span>
                Team 1
                <span className="font-russoOne arrow-right text-blue-700 hover:text-blue-500"></span>
                </h1>
            </div>

            <div style={{ marginLeft:"2rem"}}>
                <h2 className="text-5xl text-blue-700 mb-5 mt-10">Players</h2>
                <div className="flex items-center mb-5">
                    <div className="circle-number bg-orange-500 text-white mr-10">21</div>
                    <h5 className="font-interReg" style={{ fontSize: "2rem" }}> Michael Johnson</h5>
                </div>

                <div className="flex items-center">
                    <div className="circle-number bg-orange-500 text-white mr-10">5</div>
                    <h5 className="font-interReg" style={{ fontSize: "2rem" }}> John Williams</h5>
                </div>
            </div>

        </div>
    );
};

export default TeamManagementPage;