import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { IoEyeOutline, IoEyeOffOutline, IoArrowBack } from "react-icons/io5"; 
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate() 

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((preve) => {
      return { ...preve, [name]: value }
    })
  }

  const valideValue = Object.values(data).every(el => el)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (data.password !== data.confirmPassword) {
      toast.error("Password and confirm password must be same")
      return
    }

    try {
      const response = await Axios({
        ...SummaryApi.register,
        data: data 
      })
      if (response.data.error) {
        toast.error(response.data.message) 
      }
      if (response.data.success) {
        toast.success(response.data.message)
        setData({ name: "", email: "", password: "", confirmPassword: "" })
        navigate("/login")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <section className='fixed inset-0 z-50 flex items-center justify-center bg-black p-4'>
      
      <div className='bg-black w-full max-w-md p-8 rounded-md border border-white/10 relative'>
        
        <button 
          onClick={() => navigate("/")} 
          className='absolute top-6 left-6 text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm'
        >
          <IoArrowBack size={18}/> Back
        </button>

        <div className='text-center mb-8 mt-6'>
            <h2 className='text-3xl font-bold text-white tracking-tight mb-1'>Register</h2>
            <p className='text-gray-500 text-xs uppercase tracking-widest'>Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-1.5'>
            <label htmlFor='name' className='block text-xs font-medium text-gray-400 ml-1'>Name</label>
            <input 
              type="text"
              id='name'
              autoFocus
              value={data.name}
              name='name'
              onChange={handleChange}
              className='w-full px-4 py-3 rounded-sm bg-white/5 border border-white/10 text-white focus:border-white/30 outline-none transition-all'
              placeholder='John Doe' 
            />
          </div>

          <div className='space-y-1.5'>
            <label htmlFor='email' className='block text-xs font-medium text-gray-400 ml-1'>Email</label>
            <input 
              type="email"
              id='email'
              value={data.email}
              name='email'
              onChange={handleChange}
              className='w-full px-4 py-3 rounded-sm bg-white/5 border border-white/10 text-white focus:border-white/30 outline-none transition-all'
              placeholder='name@example.com'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label htmlFor='password' title='Password' className='block text-xs font-medium text-gray-400 ml-1'>Password</label>
              <div className='relative flex items-center'>
                  <input 
                  type={showPassword ? "text" : "password"}
                  id='password'
                  value={data.password}
                  name='password'
                  onChange={handleChange}
                  className='w-full px-4 py-3 rounded-sm bg-white/5 border border-white/10 text-white focus:border-white/30 outline-none transition-all'
                  placeholder='••••••••' 
                  />
                  <div onClick={() => setShowPassword(prev => !prev)} className='absolute right-3 cursor-pointer text-gray-500 hover:text-white'>
                      { showPassword ? <IoEyeOutline size={18}/> : <IoEyeOffOutline size={18}/> }
                  </div>
              </div>
            </div>

            <div className='space-y-1.5'>
              <label htmlFor='confirmPassword' title='Confirm' className='block text-xs font-medium text-gray-400 ml-1'>Confirm</label>
              <div className='relative flex items-center'>
                  <input 
                  type={showConfirmPassword ? "text" : "password"}
                  id='confirmPassword'
                  value={data.confirmPassword}
                  name='confirmPassword'
                  onChange={handleChange}
                  className='w-full px-4 py-3 rounded-sm bg-white/5 border border-white/10 text-white focus:border-white/30 outline-none transition-all'
                  placeholder='••••••••' 
                  />
                  <div onClick={() => setShowConfirmPassword(prev => !prev)} className='absolute right-3 cursor-pointer text-gray-500 hover:text-white'>
                      { showConfirmPassword ? <IoEyeOutline size={18}/> : <IoEyeOffOutline size={18}/> }
                  </div>
              </div>
            </div>
          </div>

          <button 
            disabled={!valideValue} 
            className={`w-full py-3 rounded-sm font-bold text-sm uppercase tracking-wider transition-all mt-4
              ${valideValue 
                ? "bg-white text-black hover:bg-gray-200" 
                : "bg-white/10 text-white/30 cursor-not-allowed"}`}
          >
            Create Account
          </button>

          <p className='text-center text-xs text-gray-500 mt-6'>
            Already a member? <Link to={"/login"} className='text-white font-bold hover:underline ml-1'>
              Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  )
}

export default Register