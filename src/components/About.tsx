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
                    Desenvolvedor Full Stack especializado em transformar desafios de negócios em soluções digitais inteligentes. Com mais de 10 anos de jornada no empreendedorismo, trago uma visão estratégica que vai além do código: foco em ROI, produtividade e experiência do usuário. Sou especialista em construir não apenas sites, mas ecossistemas que trabalham para você, integrando <strong>automacões avançadas (n8n, Python)</strong> para eliminar processos manuais e escalar operações. Meu objetivo é criar tecnologia que gera valor real e libera tempo para o que realmente importa no seu negócio.
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
