import React from "react";


const FloatingMessage = () => {
    return (
        <div className="absolute right-10 top-[180px] bg-white p-2 rounded shadow-lg z-50 text-[12px] transition-opacity duration-500" style={{ opacity: 1 }}>
            Double click <br />  to edit picture  <br /> or number.
        </div>
    );
};

export default FloatingMessage;