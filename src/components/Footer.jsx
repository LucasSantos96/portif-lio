import React from 'react'

import Link from 'next/link'

const Footer = () => {
  return (
    <footer className='bg-[#000]  flex justify-center'>
        <p className='text-white px-4 py-6'>Desenvolvido por <span className='text-[#0A80ED]'><Link href={"https://github.com/LucasSantos96"} target='_blank'>Lucas Santos</Link></span></p>
    </footer>
  )
}

export default Footer