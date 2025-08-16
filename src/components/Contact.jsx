"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Contact = () => {
  return (
    <section className="my-20 mx-4 text-white mb-14 flex flex-col items-center lg:mx-32 lg:py-28" id="contato">
      
      <div className="text-center mb-12">
        <h2 className="text-[20px] mb-5 lg:text-[40px]">Entre em Contato</h2>
        <p className="text-[#b0afaf] text-sm lg:text-base max-w-2xl">
          Estou sempre aberto a novas oportunidades e colaborações. 
          Vamos conversar sobre como posso ajudar no seu próximo projeto!
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Informações de Contato */}
        <div className="bg-[#ffffff4b] rounded-2xl p-8">
          <h3 className="text-xl font-semibold mb-6 text-center">Informações</h3>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-[#0980ec] p-3 rounded-full">
                <Image
                  src="/mail.png"
                  alt="Email"
                  width={24}
                  height={24}
                  className=""
                />
              </div>
              <div>
                <p className="text-sm text-[#b0afaf]">Email</p>
                <p className="font-medium">homeoficelucas@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-[#0980ec] p-3 rounded-full">
                <Image
                  src="/whatsapp.png"
                  alt="WhatsApp"
                  width={24}
                  height={24}
                  className=""
                />
              </div>
              <div>
                <p className="text-sm text-[#b0afaf]">WhatsApp</p>
                <p className="font-medium">+55 (22) 98107-3895</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-[#0980ec] p-3 rounded-full">
                <Image
                  src="/github.png"
                  alt="GitHub"
                  width={24}
                  height={24}
                  className=""
                />
              </div>
              <div>
                <p className="text-sm text-[#b0afaf]">GitHub</p>
                <p className="font-medium">github.com/LucasSantos96</p>
              </div>
            </div>
          </div>
        </div>

        {/* Redes Sociais */}
        <div className="bg-[#ffffff4b] rounded-2xl p-8">
          <h3 className="text-xl font-semibold mb-6 text-center">Redes Sociais</h3>
          
          <div className="space-y-4">
            <a 
              href="https://www.linkedin.com/in/lucas-santos-de-oliveira-874497325/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-[#ffffff1a] rounded-xl hover:bg-[#ffffff2a] transition-colors duration-300"
            >
              <Image
                src="/linkedin.png"
                alt="LinkedIn"
                width={32}
                height={32}
                className=""
              />
              <div>
                <p className="font-medium">LinkedIn</p>
                <p className="text-sm text-[#b0afaf]">Conecte-se profissionalmente</p>
              </div>
            </a>

            <a 
              href="https://github.com/LucasSantos96" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-[#ffffff1a] rounded-xl hover:bg-[#ffffff2a] transition-colors duration-300"
            >
              <Image
                src="/github.png"
                alt="GitHub"
                width={32}
                height={32}
                className=""
              />
              <div>
                <p className="font-medium">GitHub</p>
                <p className="text-sm text-[#b0afaf]">Veja meus projetos</p>
              </div>
            </a>

            <a 
              href="https://wa.me/5522981073895" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-[#ffffff1a] rounded-xl hover:bg-[#ffffff2a] transition-colors duration-300"
            >
              <Image
                src="/whatsapp.png"
                alt="WhatsApp"
                width={32}
                height={32}
                className=""
              />
              <div>
                <p className="font-medium">WhatsApp</p>
                <p className="text-sm text-[#b0afaf]">Mensagem direta</p>
              </div>
            </a>
          </div>
        </div>
      </div>

             {/* CTA */}
       <div className="text-center mt-12">
         <p className="text-[#b0afaf] mb-4">Tem um projeto em mente?</p>
         <a 
           href="mailto:homeoficelucas@gmail.com?subject=Proposta de Projeto&body=Olá Lucas! Gostaria de conversar sobre um projeto."
           className="inline-block bg-[#0980ec] hover:bg-[#0659a6] text-white font-medium py-3 px-8 rounded-full transition-colors duration-300 cursor-pointer"
         >
           Vamos Conversar!
         </a>
       </div>

    </section>
  );
};

export default Contact;
