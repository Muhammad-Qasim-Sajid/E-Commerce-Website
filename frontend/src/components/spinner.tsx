import React from "react";

function Spinner() {
    return (
        <div className="min-h-screen bg-[#eeeceb] flex items-center justify-center">
        <div className="flex flex-col items-center animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a1a1a]"></div>
        </div>
    );
}

export default Spinner;