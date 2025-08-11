import React from 'react'

import Link from 'next/link'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className='bg-[#00000080] justify-center'>
      <div className='flex items-center lg:mx-[120px] mx-5 justify-between'>
        <div className='py-14'>
          <h2 className='text-2xl text-[#fff] font-medium'>Lucas Santos</h2>
          <p className='text-[#0980ec]'>Desenvolvedor fullstack</p>
        
        <div className='flex items-center gap-2 mt-4'>
             <Image
              src={'/mail.png'}
              alt="email"
              width={24}
              height={100}
              className="bg-[#ffffff71] p-1 rounded-full"
            />
            <p className='text-white text-[12px] '>homeoficelucas@gmail.com</p>
        </div>
        </div>
        <div>
          <h2 className='text-2xl text-[#fff] font-light'>Redes sociais</h2>
          <div className='flex gap-4 mt-4'>
            <a href="https://www.linkedin.com/in/lucas-santos-de-oliveira-874497325/" target='_blank'>
              <Image
              src={'/linkedin.png'}
              alt="project"
              width={36}
              height={100}
              className=""
                      />
            </a>

             <a href="https://github.com/LucasSantos96" target='_blank'>
               <Image
                           src={'/github.png'}
                           alt="project"
                           width={36}
                           height={100}
                           className=""
                      />
             </a>

             <a href="https://wa.me/5522981073895" target='_blank'>
               <Image
                           src={'/whatsapp.png'}
                           alt="project"
                           width={36}
                           height={100}
                           className=""
                      />
             </a>
          </div>
        
        </div>
      </div>


    <hr  className='border-[#565555]'/>
        <div className='bg-[#111111] w-full text-center'>
          <p className='text-white py-2 text-[14px]'>Desenvolvido por <span className='text-[#0A80ED]'><Link href={"https://github.com/LucasSantos96"} target='_blank'>Lucas Santos</Link></span></p>
        </div>
    </footer>
  )
}

export default Footer