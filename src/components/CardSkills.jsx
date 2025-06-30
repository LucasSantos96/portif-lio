import React from "react";
import Image from "next/image";

const CardSkills = ({ image, text }) => {
  return (
    <div className="rounded-[18px] bg-[#9CABBA61] text-white px-[32px] py-5 flex flex-col text-center cursor-pointer hover:bg-[#9cabbadd] hover:shadow-[0_4px_24px_0_rgba(10,128,237,0.3)] transition duration-500">
      <Image src={image} alt="imagem" width={100} height={100} />

      <h3 className="text-[18px] py-2">{text}</h3>
    </div>
  );
};

export default CardSkills;
