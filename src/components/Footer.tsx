import React from 'react'

import Link from 'next/link'
import { Mail, Linkedin, Github } from 'lucide-react';
import { SiWhatsapp } from '@icons-pack/react-simple-icons';

const Footer: React.FC = () => {
    return (
        <footer className='bg-[#00000080]'>
            <div className='flex flex-col lg:flex-row items-center lg:items-start lg:mx-[120px] mx-5 py-10 lg:py-14 justify-between gap-10 lg:gap-0'>
                <div className='flex flex-col items-center lg:items-start text-center lg:text-left'>
                    <h2 className='text-2xl text-[#fff] font-medium uppercase tracking-wider'>Lucas Santos</h2>
                    <p className='text-[#0980ec] font-light'>Desenvolvedor Fullstack</p>

                    <div className='flex items-center gap-2 mt-4'>
                        <Mail
                            size={20}
                            className="text-white bg-[#ffffff20] p-1 rounded-full"
                        />
                        <p className='text-white text-sm font-light'>homeoficelucas@gmail.com</p>
                    </div>
                </div>
                <div className='flex flex-col items-center lg:items-start'>
                    <h2 className='text-2xl text-[#fff] font-light mb-4'>Redes sociais</h2>
                    <div className='flex gap-6'>
                        <a
                            href="https://www.linkedin.com/in/lucas-santos-de-oliveira-874497325/"
                            target='_blank'
                            aria-label="Visitar perfil no LinkedIn"
                            className="hover:scale-110 transition-transform duration-300"
                        >
                            <Linkedin size={32} className="text-white hover:text-[#0A80ED]" />
                        </a>

                        <a
                            href="https://github.com/LucasSantos96"
                            target='_blank'
                            aria-label="Visitar perfil no GitHub"
                            className="hover:scale-110 transition-transform duration-300"
                        >
                            <Github size={32} className="text-white hover:text-[#0A80ED]" />
                        </a>

                        <a
                            href="https://wa.me/5522981073895"
                            target='_blank'
                            aria-label="Entrar em contato via WhatsApp"
                            className="hover:scale-110 transition-transform duration-300"
                        >
                            <SiWhatsapp size={32} color="#25D366" />
                        </a>
                    </div>

                </div>
            </div>


            <hr className='border-[#565555]' />
            <div className='bg-[#111111] w-full text-center'>
                <p className='text-white py-2 text-[14px]'>Desenvolvido por <span className='text-[#0A80ED]'><Link href={"https://github.com/LucasSantos96"} target='_blank'>Lucas Santos</Link></span></p>
            </div>
        </footer>
    )
}

export default Footer
