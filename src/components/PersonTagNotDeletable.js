import React, { useState } from "react";
const PersonTagNotDeletable= ({ name, number, isPlayer }) => {



  return (
    <div className="flex items-center bg-white shadow-md p-2 pr-3 rounded-10px w-full">
      {isPlayer && (
        <div className="font-russoOne circle-number shadow-md bg-sn-main-orange text-white mr-4">{number}</div>
      )}
      <h5 className="font-interReg text-2xl cursor-pointer">{name}</h5>

    </div>
  );
};

export default PersonTagNotDeletable;