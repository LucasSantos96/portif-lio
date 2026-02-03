import React from 'react'

import Link from 'next/link'
import { Mail, Linkedin, Github } from 'lucide-react';
import { SiWhatsapp } from '@icons-pack/react-simple-icons';

const Footer: React.FC = () => {
    return (
        <footer className='bg-[#00000080] justify-center'>
            <div className='flex items-center lg:mx-[120px] mx-5 justify-between'>
                <div className='py-14'>
                    <h2 className='text-2xl text-[#fff] font-medium'>Lucas Santos</h2>
                    <p className='text-[#0980ec]'>Desenvolvedor fullstack</p>

                    <div className='flex items-center gap-2 mt-4'>
                        <Mail
                            size={24}
                            className="text-white bg-[#ffffff71] p-1 rounded-full"
                        />
                        <p className='text-white text-[12px] '>homeoficelucas@gmail.com</p>
                    </div>
                </div>
                <div>
                    <h2 className='text-2xl text-[#fff] font-light'>Redes sociais</h2>
                    <div className='flex gap-4 mt-4'>
                        <a
                            href="https://www.linkedin.com/in/lucas-santos-de-oliveira-874497325/"
                            target='_blank'
                            aria-label="Visitar perfil no LinkedIn"
                            className="hover:scale-110 transition-transform duration-300"
                        >
                            <Linkedin size={36} className="text-white hover:text-[#0A80ED]" />
                        </a>

                        <a
                            href="https://github.com/LucasSantos96"
                            target='_blank'
                            aria-label="Visitar perfil no GitHub"
                            className="hover:scale-110 transition-transform duration-300"
                        >
                            <Github size={36} className="text-white hover:text-[#0A80ED]" />
                        </a>

                        <a
                            href="https://wa.me/5522981073895"
                            target='_blank'
                            aria-label="Entrar em contato via WhatsApp"
                            className="hover:scale-110 transition-transform duration-300"
                        >
                            <SiWhatsapp size={36} color="#25D366" />
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
