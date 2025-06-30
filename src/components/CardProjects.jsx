import React from "react";
import Image from "next/image";
import Link from "next/link";

const CardProjects = ({ image, title, subtitle, link }) => {
  return (
    <div className="w-[390px] cursor-pointer">
      <Link href={link} target="_blank" className="">
        <Image
          src={image}
          alt="project"
          width={390}
          height={100}
          className="rounded-2xl mb-4 hover:opacity-40 hover:shadow-[0_4px_24px_0_rgba(245,125,56,0.3)] transition duration-300"
        />
      </Link>

      <h2 className="text-[20px]">{title}</h2>
      <p className="font-light text-sm text-[#b0afaf] w-fit"> {subtitle}</p>
    </div>
  );
};

export default CardProjects;
