'use client'
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CardProjectsProps } from "@/types";

const CardProjects: React.FC<CardProjectsProps> = ({ image, title, subtitle, link, tecImg }) => {

    const [detail, setDetail] = useState<boolean>(false)

    const handleDetails = (): void => {
        setDetail(!detail)
    }


    return (
        <div className="w-[340px] cursor-pointer px-3 pt-2 pb-8 bg-[#ffffff4b] rounded-2xl  transition-transform duration-300 hover:scale-105">
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
            <p className={`${detail ? " " : "truncate "}   font-light text-sm text-[#b0afaf] `}> {subtitle}</p>

            <div className={`${detail ? "block" : "hidden"} mt-4`}>
                <p className="font-light text-[14px] mb-2">Tecnologias utilizadas</p>

                <div className="flex gap-2">{Array.isArray(tecImg) ? tecImg.map((img) => img) : tecImg}</div>
            </div>

            <button onClick={handleDetails} className="mt-4 cursor-pointer rounded-full bg-[#0980ec] font-light text-[12px] py-2 px-4 hover:bg-[#0659a6]">Mais detalhes</button>
        </div>
    );
};

export default CardProjects;
