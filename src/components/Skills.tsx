"use client";

import React from 'react';
import CardSkills from './CardSkills';
import {
    SiHtml5,
    SiCss,
    SiJavascript,
    SiTypescript,
    SiReact,
    SiNextdotjs,
    SiTailwindcss,
    SiBootstrap,
    SiNodedotjs,
    SiMysql,
    SiMongodb,
    SiGit,
    SiNestjs,
    SiPython,
    SiSupabase,
    SiN8n
} from '@icons-pack/react-simple-icons';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/autoplay';

const Skills: React.FC = () => {
    const iconSize = 64;

    const skills = [
        { icon: <SiHtml5 size={iconSize} color="#E34F26" />, text: 'HTML5' },
        { icon: <SiCss size={iconSize} color="#1572B6" />, text: 'CSS3' },
        { icon: <SiJavascript size={iconSize} color="#F7DF1E" />, text: 'JavaScript' },
        { icon: <SiTypescript size={iconSize} color="#3178C6" />, text: 'TypeScript' },
        { icon: <SiReact size={iconSize} color="#61DAFB" />, text: 'React' },
        { icon: <SiNextdotjs size={iconSize} color="#FFFFFF" />, text: 'Next.js' },
        { icon: <SiTailwindcss size={iconSize} color="#06B6D4" />, text: 'Tailwind CSS' },
        { icon: <SiBootstrap size={iconSize} color="#7952B3" />, text: 'Bootstrap' },
        { icon: <SiNodedotjs size={iconSize} color="#339933" />, text: 'Node.js' },
        { icon: <SiNestjs size={iconSize} color="#E0234E" />, text: 'NestJS' },
        { icon: <SiPython size={iconSize} color="#3776AB" />, text: 'Python' },
        { icon: <SiMysql size={iconSize} color="#4479A1" />, text: 'MySQL' },
        { icon: <SiMongodb size={iconSize} color="#47A248" />, text: 'MongoDB' },
        { icon: <SiSupabase size={iconSize} color="#3FCF8E" />, text: 'Supabase' },
        { icon: <SiN8n size={iconSize} color="#EA4B71" />, text: 'n8n' },
        { icon: <SiGit size={iconSize} color="#F05032" />, text: 'Git' },
    ];

    return (
        <section className='mt-20 mx-4 text-white lg:mx-32 lg:py-28 overflow-hidden' id='habilidades'>
            <style jsx global>{`
                .skills-swiper .swiper-wrapper {
                    transition-timing-function: linear !important;
                }
                .skills-swiper .swiper-slide {
                    width: auto !important;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: auto;
                }
            `}</style>
            <div>
                <h2 className='text-[20px] mb-[30px] lg:text-[40px] text-center'>Habilidades</h2>
            </div>

            <div className="relative w-full">
                {/* Gradient Fades for a premium look */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#121417] to-transparent z-10 pointer-events-none hidden md:block" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#121417] to-transparent z-10 pointer-events-none hidden md:block" />

                <Swiper
                    modules={[Autoplay, FreeMode]}
                    loop={true}
                    freeMode={true}
                    spaceBetween={20}
                    slidesPerView="auto"
                    speed={3000}
                    autoplay={{
                        delay: 0,
                        disableOnInteraction: false,
                    }}
                    className="skills-swiper"
                >
                    {skills.map((skill, index) => (
                        <SwiperSlide key={index} style={{ width: 'auto' }}>
                            <CardSkills icon={skill.icon} text={skill.text} />
                        </SwiperSlide>
                    ))}
                    {/* Repeat to ensure smooth infinite scroll if few items */}
                    {skills.map((skill, index) => (
                        <SwiperSlide key={`repeat-${index}`} style={{ width: 'auto' }}>
                            <CardSkills icon={skill.icon} text={skill.text} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}

export default Skills;
