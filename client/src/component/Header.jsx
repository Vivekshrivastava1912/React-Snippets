import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { setUserDetails } from '../redux/userSlice'
import { FaUserCircle, FaSignOutAlt, FaUsers, FaLaptopCode } from 'react-icons/fa'

const Header = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const location = useLocation()
  const [showMenu, setShowMenu] = useState(false)

  // Route change hote hi menu band ho jaye
  useEffect(() => {
    setShowMenu(false)
  }, [location.pathname])

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout
      });
      if (response.data.success) {
        toast.success("Logged out successfully");
        dispatch(setUserDetails(null));
        localStorage.clear();
        window.location.href = "/";
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  }

  // User ke naam ka pehla letter nikalne ke liye
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U"

  return (
    <header className='h-20 bg-black border-b border-white/10 sticky top-0 z-50 w-full font-sans'>
      <div className='container mx-auto h-full flex items-center justify-between px-6'>

        {/* Logo */}
        <Link to="/" className='flex items-center gap-2'>
          <div className='w-10 h-10 bg-yellow-500 flex items-center justify-center rounded-sm rotate-3 shadow-[0_0_15px_rgba(234,179,8,0.3)]'>
            <span className='text-black font-black text-xl'>RS</span>
          </div>
          <h1 className='text-white font-bold text-2xl tracking-tighter uppercase'>React <span className='text-yellow-500'>Snippet</span></h1>
        </Link>

        {/* Laptop Navigation (Center) */}
        <nav className='hidden md:flex items-center gap-3 bg-[#0a0a0a] border border-white/5 p-1.5 rounded-2xl'>
          <Link to="/" className={`px-5 py-2 text-sm font-bold rounded-xl transition-all ${location.pathname === "/" ? "bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.2)]" : "text-gray-500 hover:text-white"}`}>Home</Link>
          <Link to="/aicomponent-gen" className={`px-5 py-2 text-sm font-bold rounded-xl transition-all ${location.pathname === "/aicomponent-gen" ? "bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.2)]" : "text-gray-500 hover:text-white"}`}>AI Lab</Link>
          <Link to="/svgai-gen" className={`px-5 py-2 text-sm font-bold rounded-xl transition-all ${location.pathname === "/svgai-gen" ? "bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.2)]" : "text-gray-500 hover:text-white"}`}>SVG AI</Link>
          <Link to="/components" className={`px-5 py-2 text-sm font-bold rounded-xl transition-all ${location.pathname === "/components" ? "bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.2)]" : "text-gray-500 hover:text-white"}`}>Components</Link>
        </nav>

        {/* Auth Section */}
        <div className='flex items-center gap-4 relative'>
          {user?._id ? (
            <div className='relative'>
              {/* Profile Initial Circle */}
              <button
                onClick={() => setShowMenu(!showMenu)}
                className='w-10 h-10 rounded-full border-2 border-yellow-500/30 flex items-center justify-center hover:border-yellow-500 transition-all bg-yellow-500/10 text-yellow-500 font-bold overflow-hidden'
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className='w-full h-full object-cover' />
                ) : (
                  <span>{userInitial}</span>
                )}
              </button>

              {/* LAPTOP DROPDOWN */}
              {showMenu && (
                <div className='hidden md:block absolute right-0 mt-4 w-64 bg-[#0f0f0f]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] py-3 z-50 overflow-hidden transform transition-all opacity-100 scale-100 origin-top-right'>
                  <div className='px-5 py-3 border-b border-white/5 mb-2 bg-white/2 mx-2 rounded-xl'>
                    <p className='text-[10px] uppercase tracking-wider text-gray-500 mb-1'>Signed in as</p>
                    <p className='text-sm font-bold text-white truncate'>{user.name}</p>
                    <p className='text-xs text-gray-400 truncate mt-0.5'>{user.email}</p>
                  </div>

                  <div className="px-2 space-y-1">
                    <Link to="/profile" className='flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-yellow-500 hover:text-black font-semibold rounded-xl transition-all group'>
                      <FaUserCircle className="text-gray-400 group-hover:text-black transition-colors" size={16} /> My Profile
                    </Link>

                    {(user.role === 'admin' || user.role === 'ADMIN') && (
                      <>
                        <div className='h-px bg-white/5 my-2 mx-4'></div>
                        <p className='text-[10px] uppercase tracking-wider text-gray-500 px-4 py-1'>Admin Panel</p>
                        <Link to="/admin/all-users" className='flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-yellow-500 hover:text-black font-semibold rounded-xl transition-all group'>
                          <FaUsers className="text-gray-400 group-hover:text-black transition-colors" size={16} /> Visit All Users
                        </Link>
                        <Link to="/admin/all-components" className='flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-yellow-500 hover:text-black font-semibold rounded-xl transition-all group'>
                          <FaLaptopCode className="text-gray-400 group-hover:text-black transition-colors" size={16} /> Visit All Components
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="px-2 mt-2 pt-2 border-t border-white/5">
                    <button
                      onClick={handleLogout}
                      className='flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 hover:text-red-400 font-bold rounded-xl transition-all'
                    >
                      <FaSignOutAlt size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className='flex items-center gap-4'>
              <Link to="/login" className='text-sm font-medium text-gray-400 hover:text-yellow-500'>Login</Link>
              <Link to="/register" className='px-5 py-2.5 bg-yellow-500 text-black text-sm font-bold rounded-sm hover:bg-yellow-400 transition-all'>Get Started</Link>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FULL SCREEN MENU */}
      {showMenu && (
        <div className='md:hidden fixed inset-0 bg-black z-100 flex flex-col p-8'>
          <div className='flex items-center justify-between mb-12'>
            <span className='text-yellow-500 font-black text-md tracking-widest uppercase'>Menu</span>
            <button
              onClick={() => setShowMenu(false)}
              className='w-5 h-10 flex items-center justify-center bg-white/5 rounded-full text-white text-2xl font-light'
            >
              ✕
            </button>
          </div>

          <div className='flex flex-col gap-3 overflow-y-auto'>
            <Link to="/" className='p-3 bg-white/5 rounded-md text-md font-bold text-white active:bg-yellow-500 active:text-black'>Home</Link>
            <Link to="/aicomponent-gen" className='p-3 bg-white/5 rounded-md text-md font-bold text-white active:bg-yellow-500 active:text-black'>AI Lab</Link>
            <Link to="/components" className='p-3 bg-white/5 rounded-md text-md font-bold text-white active:bg-yellow-500 active:text-black'>Components</Link>
            <Link to="/profile" className='p-3 bg-white/5 rounded-md text-md font-bold text-white active:bg-yellow-500 active:text-black'>My Profile</Link>

            {(user.role === 'admin' || user.role === 'ADMIN') && (
              <>
                <div className='h-px bg-white/10 my-2'></div>
                <Link to="/admin/all-users" className='p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md text-md font-bold text-yellow-500'>Visit All Users</Link>
                <Link to="/admin/all-components" className='p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md text-md font-bold text-yellow-500'>Visit All Components</Link>
              </>
            )}

            <button
              onClick={handleLogout}
              className='p-5 bg-red-500/10 rounded-md text-md font-bold text-red-500 mt-6 border border-red-500/20'
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header