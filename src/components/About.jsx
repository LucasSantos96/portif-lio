import React from 'react'
import Image from 'next/image'

const About = () => {
  return (
    <section className='mt-20 text-white mx-5 lg:mx-32 lg:flex lg:justify-between lg:py-20 lg:items-center'  id='sobre'>
        <div className='lg:w-[660px] '>
            <h2 className='text-[20px] mb-2 lg:text-[40px]'>
                Sobre mim
            </h2>
            <p className='font-light text-sm text-[#b0afaf] lg:text-[18px]'>
                Cursando analise e desenvolvimento de sistemas e estou em transição de carreira. Já desenvolvi sites como freelance e já empreendi  na area de barbearia e também com confeitaria, trabalhei por mais de 10 anos em barbearia, onde desenvolvi habilidades em marketing, mídias sociais, vendas, proatividade, além de aprimorar minha comunicação e trabalho em equipe. Minha experiência como empreendedor e freelancer também me proporcionou conhecimentos em gestão de projetos, pesquisa on-line e organização, fundamentais para o desenvolvimento de aplicações.
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