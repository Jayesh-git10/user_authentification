import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext.jsx'

const Header = () => {
  const {userData}= useContext(AppContext)
  

  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center px-4 text-center text-white relative '>
      <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>
        Hey {userData ? userData.name :  'Developer'} !
      </h1>
      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>
        Welcome To Our App
      </h2>
      <p className='mb-8 max-w-md'>
        Let's start with a quick product tour and we will have you up and running in no time!
      </p>
      <button className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 text-white hover:text-black'>
        Get Started
      </button>
    </div>
  )
}

export default Header