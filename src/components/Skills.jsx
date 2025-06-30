import React from 'react'
import CardSkills from './CardSkills'

const Skills = () => {
  return (
    <section className='mt-20 mx-4 text-white lg:mx-32 lg:py-28' id='habilidades'>
        <div>
            <h2 className='text-[20px] mb-[30px] lg:text-[40px] text-center'>Habilidades</h2>
        </div>
        <div className='flex flex-wrap gap-2 justify-center '>
            <CardSkills image={"/Html5.png"} text='HTML5'/>
            <CardSkills image={"/CSS3.png"} text='CSS3'/>
            <CardSkills image={"/JavaScript.png"} text='JAVASCRIPT'/>
            <CardSkills image={"/React.png"} text='REACT'/>
            <CardSkills image={"/Next.js.png"} text='NEXTJS'/>
            <CardSkills image={"/Tailwindcss.png"} text='TAILWIND'/>
            <CardSkills image={"/Nodejs.png"} text='NODEJS'/>
            <CardSkills image={"/MongoDB.png"} text='MONGODB'/>
            <CardSkills image={"/Git.png"} text='GIT'/>


        </div>
    </section>
  )
}

export default Skills