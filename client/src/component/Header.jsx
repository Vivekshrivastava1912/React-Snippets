import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { LuUser } from "react-icons/lu";
import UserDetails from './userDetails';

const Header = () => {
  const user = useSelector(state => state.user)
  const location = useLocation()
  const [showUserDetails, setShowUserDetails] = useState(false)

  return (
    <header className='h-20 bg-black border-b border-white/10 sticky top-0 z-40 w-full'>
      <div className='container mx-auto h-full flex items-center justify-between px-6'>

        {/* Logo */}
        <Link to="/" className='flex items-center gap-2'>
          <div className='w-10 h-10 bg-yellow-500 flex items-center justify-center rounded-sm rotate-3 group-hover:rotate-0 transition-transform shadow-[0_0_15px_rgba(234,179,8,0.3)]'>
            <span className='text-black font-black text-xl'>RS</span>
          </div>
          <h1 className='text-white font-bold text-2xl tracking-tighter'>React <span className='text-yellow-500'>Snippet</span></h1>
        </Link>

        {/* Navigation */}
        <nav className='hidden md:flex items-center gap-3 bg-[#0a0a0a] border border-white/5 p-1.5 rounded-2xl hover:bg-white/10'>
          <Link
            to="/"
            className={`px-5 py-2 text-sm font-bold rounded-xl transition-all duration-300 ${location.pathname === "/"
              ? "bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.2)]"
              : "text-gray-500 hover:text-white hover:bg-white/10"
              }`}
          >
            Home
          </Link>

          <Link
            to="/aicomponent-gen"
            className={`px-5 py-2 text-sm font-bold rounded-xl transition-all duration-300 ${location.pathname === "/aicomponent-gen"
              ? "bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.2)]"
              : "text-gray-500 hover:text-white hover:bg-white/10"
              }`}
          >
            AI Lab
          </Link>

          <Link
            to="/components"
            className={`px-5 py-2 text-sm font-bold rounded-xl transition-all duration-300 ${location.pathname === "/components" || location.pathname === "/edit-component"
              ? "bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.2)]"
              : "text-gray-500 hover:text-white hover:bg-white/10"
              }`}
          >
            Components
          </Link>
        </nav>

        {/* Auth Actions */}
        <div className='flex items-center gap-4'>
          {user?._id ? (
            <button
              onClick={() => setShowUserDetails(prev => !prev)}
              className='w-10 h-10 rounded-full border border-yellow-500/20 flex items-center justify-center hover:border-yellow-500 transition-colors overflow-hidden group'
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className='w-full h-full object-cover' />
              ) : (
                <LuUser size={20} className='text-white group-hover:text-yellow-500 group-hover:scale-110 transition-transform' />
              )}
            </button>
          ) : (
            <div className='flex items-center gap-4'>
              <Link to="/login" className='text-sm font-medium text-gray-400 hover:text-yellow-500 transition-colors'>
                Login
              </Link>
              <Link
                to="/register"
                className='px-5 py-2.5 bg-yellow-500 text-black text-sm font-bold rounded-sm hover:bg-yellow-400 active:scale-95 transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)]'
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

      </div>

      {showUserDetails && (
        <UserDetails onClose={() => setShowUserDetails(false)} />
      )}
    </header>
  )
}

export default Header
