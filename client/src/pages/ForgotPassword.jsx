import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { IoArrowBack } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [data, setData] = useState({ email: "" })

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((preve) => ({ ...preve, [name]: value }))
  }

  const valideValue = data.email.trim() !== ""

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await Axios({
        ...SummaryApi.forgotPassword,
        data: data
      })

      if (response.data.error) {
        toast.error(response.data.message)
      }

      if (response.data.success) {
        toast.success(response.data.message)
        navigate("/verifyotp", { state: { email: data.email } })
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <section className='fixed inset-0 z-50 flex items-center justify-center bg-black p-4'>
      <div className='bg-black w-full max-w-md p-8 rounded-md border border-white/10 relative'>
        <button 
          onClick={() => navigate("/login")} 
          className='absolute top-6 left-6 text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm'
        >
          <IoArrowBack size={18} /> Back
        </button>
        
        <div className='text-center mb-10 mt-6'>
          <h2 className='text-3xl font-bold text-white tracking-tight mb-1'>Reset</h2>
          <p className='text-gray-500 text-xs uppercase tracking-widest'>Verification Code</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-1.5'>
            <label htmlFor='email' className='block text-xs font-medium text-gray-400 ml-1'>Email</label>
            <input
              type="email" id='email' name='email' autoFocus value={data.email} onChange={handleChange}
              className='w-full px-4 py-3 rounded-sm bg-white/5 border border-white/10 text-white focus:border-white/30 outline-none transition-all'
              placeholder='name@example.com'
            />
          </div>
          
          <button 
            disabled={!valideValue} 
            className={`w-full py-3 rounded-sm font-bold text-sm uppercase tracking-wider transition-all mt-4
              ${valideValue ? "bg-white text-black hover:bg-gray-200" : "bg-white/10 text-white/30 cursor-not-allowed"}`}
          >
            Send Code
          </button>
        </form>
      </div>
    </section>
  )
}

export default ForgotPassword