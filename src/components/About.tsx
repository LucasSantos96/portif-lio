import React from 'react'
import Image from 'next/image'

const About: React.FC = () => {
    return (
        <section className='mt-20 text-white mx-5 lg:mx-32 lg:flex lg:justify-between lg:py-20 lg:items-center' id='sobre'>
            <div className='lg:w-[660px] '>
                <h2 className='text-[20px] mb-2 lg:text-[40px]'>
                    Sobre mim
                </h2>
                <p className='font-light text-sm text-[#b0afaf] lg:text-[18px]'>
                    Desenvolvedor com experiência prática na criação de sites e aplicações web, atuando como freelancer em projetos personalizados para diferentes negócios. Ao longo de mais de 10 anos de experiência em barbearia e empreendedorismo, desenvolvi habilidades como comunicação, trabalho em equipe, proatividade e organização. Essa trajetória me proporcionou uma visão estratégica e conhecimentos em gestão de projetos, pesquisa e planejamento, que aplico no desenvolvimento de soluções digitais eficientes e bem estruturadas.
                </p>
            </div>
            <div className='flex justify-center mt-5'>
                <Image
                    src={"/sobre.png"}
                    alt='sobre'
                    width={328}
                    height={100}
                    className='flex lg:hidden'
                />

                <Image
                    src={"/sobre.png"}
                    alt='sobre'
                    width={402}
                    height={100}
                    className='hidden lg:flex'
                />
            </div>
        </section>
    )
}

export default About
