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

const Skills: React.FC = () => {
    const iconSize = 64;

    return (
        <section className='mt-20 mx-4 text-white lg:mx-32 lg:py-28' id='habilidades'>
            <div>
                <h2 className='text-[20px] mb-[30px] lg:text-[40px] text-center'>Habilidades</h2>
            </div>
            <div className='flex flex-wrap gap-2 justify-center '>
                <CardSkills icon={<SiHtml5 size={iconSize} color="#E34F26" />} text='HTML5' />
                <CardSkills icon={<SiCss size={iconSize} color="#1572B6" />} text='CSS3' />
                <CardSkills icon={<SiJavascript size={iconSize} color="#F7DF1E" />} text='JavaScript' />
                <CardSkills icon={<SiTypescript size={iconSize} color="#3178C6" />} text='TypeScript' />
                <CardSkills icon={<SiReact size={iconSize} color="#61DAFB" />} text='React' />
                <CardSkills icon={<SiNextdotjs size={iconSize} color="#FFFFFF" />} text='Next.js' />
                <CardSkills icon={<SiTailwindcss size={iconSize} color="#06B6D4" />} text='Tailwind CSS' />
                <CardSkills icon={<SiBootstrap size={iconSize} color="#7952B3" />} text='Bootstrap' />
                <CardSkills icon={<SiNodedotjs size={iconSize} color="#339933" />} text='Node.js' />
                <CardSkills icon={<SiNestjs size={iconSize} color="#E0234E" />} text='NestJS' />
                <CardSkills icon={<SiPython size={iconSize} color="#3776AB" />} text='Python' />
                <CardSkills icon={<SiMysql size={iconSize} color="#4479A1" />} text='MySQL' />
                <CardSkills icon={<SiMongodb size={iconSize} color="#47A248" />} text='MongoDB' />
                <CardSkills icon={<SiSupabase size={iconSize} color="#3FCF8E" />} text='Supabase' />
                <CardSkills icon={<SiN8n size={iconSize} color="#EA4B71" />} text='n8n' />
                <CardSkills icon={<SiGit size={iconSize} color="#F05032" />} text='Git' />
            </div>
        </section>
    )
}

export default Skills
