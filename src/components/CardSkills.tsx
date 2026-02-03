import React from "react";
import type { CardSkillsProps } from "@/types";

const CardSkills: React.FC<CardSkillsProps> = ({ icon, text }) => {
    return (
        <div className="rounded-[18px] bg-[#9CABBA61] text-white px-[32px] py-5 flex flex-col items-center text-center cursor-pointer hover:bg-[#9cabbadd] hover:shadow-[0_4px_24px_0_rgba(10,128,237,0.3)] transition duration-500">
            <div className="flex justify-center items-center mb-2">
                {icon}
            </div>

            <h3 className="text-[18px] py-2">{text}</h3>
        </div>
    );
};

export default CardSkills;
