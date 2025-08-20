import React from 'react'
import Navbar from '../components/Navbar.jsx'
import Header from '../components/Header.jsx'
import Galaxy from '../Galaxy.jsx'

const Home = () => {
  return (
    <div className='bg-black '>
      <div style={{ width: '100%', height: '100%', position: 'absolute', overflow : 'hidden' }}>
        <Galaxy/>
      </div>
      <Header />
      <Navbar/>
    </div>
  )
}

export default Home
